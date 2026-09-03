import fs from 'node:fs';
import path from 'node:path';

export interface ClientResponse {
  readonly body: Buffer;
  readonly contentType: 'text/html;charset=utf-8' | 'text/javascript;charset=utf-8' | 'text/css;charset=utf-8';
}

export type ClientResponseTable = Readonly<Record<string, ClientResponse>>;

function ordinaryDirectoryAncestors(directory: string): boolean {
  let current = directory;
  while (true) {
    const stat = fs.lstatSync(current);
    if (!stat.isDirectory() || stat.isSymbolicLink()) return false;
    const parent = path.dirname(current);
    if (parent === current) return true;
    current = parent;
  }
}

function ordinaryFile(root: string, relative: string): Buffer {
  const components = relative.split(/[\\/]/);
  let file = root;
  for (const component of components.slice(0, -1)) {
    file = path.join(file, component);
    const directory = fs.lstatSync(file);
    if (!directory.isDirectory() || directory.isSymbolicLink()) throw new Error('client-unavailable');
  }
  file = path.join(file, components.at(-1)!);
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('client-unavailable');
  const rootReal = fs.realpathSync(root);
  const fileReal = fs.realpathSync(file);
  const prefix = rootReal.endsWith(path.sep) ? rootReal : rootReal + path.sep;
  if (!fileReal.toLowerCase().startsWith(prefix.toLowerCase())) throw new Error('client-unavailable');
  return fs.readFileSync(file);
}

function clientResponse(body: Buffer, contentType: ClientResponse['contentType']): ClientResponse {
  const storedBody = Buffer.from(body);
  return Object.freeze({
    get body(): Buffer { return Buffer.from(storedBody); },
    contentType,
  });
}

function attributes(tag: string): Record<string, string> {
  const result: Record<string, string> = Object.create(null);
  const attribute = /\s+([A-Za-z][A-Za-z0-9:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/y;
  let position = /^<[A-Za-z]+/.exec(tag)![0].length;
  while (!/^\s*\/?>$/.test(tag.slice(position))) {
    attribute.lastIndex = position;
    const match = attribute.exec(tag);
    if (!match) throw new Error('client-unavailable');
    const name = match[1]!.toLowerCase();
    if (Object.hasOwn(result, name)) throw new Error('client-unavailable');
    result[name] = match[2] ?? match[3] ?? match[4] ?? '';
    position = attribute.lastIndex;
  }
  return result;
}

export function loadClientResponses(root: string): ClientResponseTable {
  try {
    if (!path.isAbsolute(root) || !ordinaryDirectoryAncestors(root)) throw new Error('client-unavailable');
    const indexBytes = ordinaryFile(root, 'index.html');
    const html = indexBytes.toString('utf8');
    const assets = new Map<string, ClientResponse['contentType']>();
    for (const match of html.matchAll(/<script\b[^>]*>/gi)) {
      const value = attributes(match[0]);
      if (value.type !== 'module' || !value.src || !/^\/assets\/[^/?#%\\]+\.js$/.test(value.src)) {
        throw new Error('client-unavailable');
      }
      if (assets.has(value.src)) throw new Error('client-unavailable');
      assets.set(value.src, 'text/javascript;charset=utf-8');
    }
    for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
      const value = attributes(match[0]);
      const relations = value.rel?.toLowerCase().split(/\s+/) ?? [];
      if (!relations.includes('stylesheet')) continue;
      if (!value.href || !/^\/assets\/[^/?#%\\]+\.css$/.test(value.href) || assets.has(value.href)) {
        throw new Error('client-unavailable');
      }
      assets.set(value.href, 'text/css;charset=utf-8');
    }
    if (![...assets.values()].includes('text/javascript;charset=utf-8')) throw new Error('client-unavailable');
    const table: Record<string, ClientResponse> = Object.create(null);
    const entry = clientResponse(indexBytes, 'text/html;charset=utf-8');
    table['/'] = entry;
    table['/index.html'] = entry;
    for (const [asset, contentType] of assets) {
      table[asset] = clientResponse(ordinaryFile(root, asset.slice(1)), contentType);
    }
    return Object.freeze(table);
  } catch {
    throw new Error('client-unavailable');
  }
}
