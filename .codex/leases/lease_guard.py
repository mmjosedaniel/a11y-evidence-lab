#!/usr/bin/env python3
"""Dependency-free automatic write-lease guard for Git working trees."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path, PurePosixPath, PureWindowsPath
from typing import Any, Iterable, NoReturn


VERSION = 2
STATE_RELATIVE_ROOT = "logs/agent-flow-leases/v2"
CONTRACT_FILE = "contract.json"
RECEIPT_FILE = "receipt.json"
ACTIVE_FILE = "active.json"
IDENTIFIER = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")
HASH = re.compile(r"^[0-9a-f]{64}$")
GLOB_CHARACTERS = frozenset("*?[]{}")
ASCII_CASE_MAP = str.maketrans("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")
WINDOWS_DEVICE = re.compile(r"^(con|prn|aux|nul|com[1-9]|lpt[1-9]|conin\$|conout\$)$", re.IGNORECASE)
WORKER_PHASES = {
    "test_worker": frozenset(("red", "evidence")),
    "code_worker": frozenset(("setup", "green")),
    "frontend_code_worker": frozenset(("green",)),
}


class GuardError(Exception):
    """A controlled failure with a stable process exit code."""

    def __init__(self, message: str, code: int = 3) -> None:
        super().__init__(message)
        self.code = code


class UsageError(GuardError):
    def __init__(self, message: str) -> None:
        super().__init__(message, 2)


class ArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> NoReturn:
        raise UsageError(message)


@dataclass(frozen=True)
class Repository:
    root: Path
    identity: str
    head: str | None
    head_ref: str | None
    ignore_case: bool
    index_digest: str
    ignore_control_digest: str


def _emit(payload: dict[str, Any]) -> None:
    print(json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True))


def _run_git(root: Path | None, arguments: list[str], *, allow_one: bool = False) -> bytes:
    command = ["git"]
    if root is not None:
        command.extend(["-C", str(root)])
    command.extend(arguments)
    try:
        environment = os.environ.copy()
        environment["GIT_OPTIONAL_LOCKS"] = "0"
        completed = subprocess.run(
            command,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=False,
            check=False,
            env=environment,
        )
    except OSError as error:
        raise GuardError(f"Git inspection could not start: {error}") from error
    if completed.returncode == 0 or (allow_one and completed.returncode == 1):
        return completed.stdout
    detail = completed.stderr.decode("utf-8", "replace").strip()
    raise GuardError(f"Git inspection failed: {detail or 'unknown Git error'}")


def _decode_git_path(value: bytes) -> str:
    try:
        return value.decode("utf-8", "strict")
    except UnicodeDecodeError as error:
        raise GuardError("Git returned a path that is not valid UTF-8.") from error


def _discover_repository(cwd: Path) -> Repository:
    root_text = _run_git(None, ["-C", str(cwd), "rev-parse", "--show-toplevel"]).decode(
        "utf-8", "strict"
    ).strip()
    root = Path(root_text).resolve(strict=True)
    common_text = _run_git(root, ["rev-parse", "--git-common-dir"]).decode(
        "utf-8", "strict"
    ).strip()
    common = Path(common_text)
    if not common.is_absolute():
        common = root / common
    common = common.resolve(strict=True)
    identity_input = f"lease-guard-repository-v1\0{os.path.normcase(str(root))}\0{os.path.normcase(str(common))}"
    identity = hashlib.sha256(identity_input.encode("utf-8")).hexdigest()
    head_output = _run_git(root, ["rev-parse", "--verify", "--quiet", "HEAD"], allow_one=True).decode(
        "ascii", "strict"
    ).strip()
    head = head_output or None
    head_ref_output = _run_git(root, ["symbolic-ref", "--quiet", "HEAD"], allow_one=True).decode(
        "utf-8", "strict"
    ).strip()
    head_ref = head_ref_output or None
    ignore_case_output = _run_git(
        root, ["config", "--bool", "--get", "core.ignorecase"], allow_one=True
    ).decode("ascii", "strict").strip()
    ignore_case = ignore_case_output.lower() == "true" or os.name == "nt"
    repository = Repository(
        root=root,
        identity=identity,
        head=head,
        head_ref=head_ref,
        ignore_case=ignore_case,
        index_digest="",
        ignore_control_digest="",
    )
    return Repository(
        root=root,
        identity=identity,
        head=head,
        head_ref=head_ref,
        ignore_case=ignore_case,
        index_digest=_index_digest(repository),
        ignore_control_digest=_ignore_control_digest(repository),
    )


def _stable_file_digest(path: Path, label: str) -> bytes:
    try:
        before = path.stat()
    except FileNotFoundError:
        return b"missing"
    try:
        data = path.read_bytes()
        after = path.stat()
    except OSError as error:
        raise GuardError(f"Could not inspect {label}: {error}") from error
    if (before.st_size, before.st_mtime_ns, before.st_ctime_ns) != (
        after.st_size, after.st_mtime_ns, after.st_ctime_ns
    ):
        raise GuardError(f"{label} changed during inspection.")
    return hashlib.sha256(data).hexdigest().encode("ascii")


def _git_path(repository: Repository, name: str) -> Path:
    value = _run_git(repository.root, ["rev-parse", "--git-path", name]).decode("utf-8", "strict").strip()
    path = Path(value)
    if not path.is_absolute():
        path = repository.root / path
    return path.resolve()


def _index_digest(repository: Repository) -> str:
    arguments = ["ls-files", "--stage", "-z"]
    first = _run_git(repository.root, arguments)
    second = _run_git(repository.root, arguments)
    if first != second:
        raise GuardError("Git index changed during inspection.")
    for record in first.split(b"\0"):
        if not record:
            continue
        metadata, separator, encoded_path = record.partition(b"\t")
        if not separator or not encoded_path:
            raise GuardError("Git returned a malformed logical index entry.")
        mode = metadata.split(b" ", 1)[0]
        if mode == b"160000":
            path = _decode_git_path(encoded_path)
            raise GuardError(
                f"Gitlinks and submodules are unsupported by the lease guard: {path!r}."
            )
    flags_arguments = ["ls-files", "-v", "-z"]
    flags_first = _run_git(repository.root, flags_arguments)
    flags_second = _run_git(repository.root, flags_arguments)
    if flags_first != flags_second:
        raise GuardError("Git index flags changed during inspection.")
    return hashlib.sha256(
        b"lease-guard-logical-index-v1\0" + first + b"\0flags\0" + flags_first
    ).hexdigest()


def _git_path_is_ignored(repository: Repository, display: str) -> bool:
    output = _run_git(
        repository.root,
        ["check-ignore", "--no-index", "--", display],
        allow_one=True,
    )
    return bool(output)


def _tracked_path_keys(repository: Repository) -> set[str]:
    output = _run_git(repository.root, ["ls-files", "--cached", "-z"])
    return {
        _canonical_git_path(_decode_git_path(encoded), repository.ignore_case)
        for encoded in output.split(b"\0")
        if encoded
    }


def _validate_scope_observability(
    repository: Repository, scopes: dict[str, list[str]]
) -> None:
    tracked = _tracked_path_keys(repository)
    for name, values in scopes.items():
        directory_scope = name.endswith("dir_roots")
        for relative in values:
            if not directory_scope and relative in tracked:
                continue
            probe = relative + "/" if directory_scope else relative
            if _git_path_is_ignored(repository, probe):
                raise UsageError(
                    f"Lease scope {relative!r} is ignored by Git and cannot be verified."
                )


def _active_gitignore_paths(repository: Repository) -> list[tuple[str, Path]]:
    runtime = _runtime_prefix(repository)
    discovered: dict[str, tuple[str, Path]] = {}
    tracked = _run_git(repository.root, ["ls-files", "--cached", "-z"])
    for encoded in tracked.split(b"\0"):
        if not encoded:
            continue
        display = _decode_git_path(encoded)
        if PurePosixPath(display).name != ".gitignore":
            continue
        canonical = _canonical_git_path(display, repository.ignore_case)
        path = repository.root / Path(*PurePosixPath(display).parts)
        discovered[canonical] = (display, path)

    stack = [repository.root]
    while stack:
        directory = stack.pop()
        try:
            with os.scandir(directory) as iterator:
                entries = sorted(iterator, key=lambda item: item.name)
        except OSError as error:
            raise GuardError(f"Could not enumerate ignore controls below {directory.name!r}: {error}") from error
        for entry in entries:
            path = Path(entry.path)
            relative = path.relative_to(repository.root).as_posix()
            canonical = _canonical_git_path(relative, repository.ignore_case)
            if canonical == ".git" or canonical.startswith(".git/"):
                continue
            if runtime and (canonical == runtime or canonical.startswith(runtime + "/")):
                continue
            try:
                metadata = path.lstat()
            except OSError as error:
                raise GuardError(f"Could not inspect ignore-control topology for {relative!r}: {error}") from error
            is_directory = stat.S_ISDIR(metadata.st_mode)
            if is_directory:
                ignored = _git_path_is_ignored(repository, relative + "/")
                if ignored:
                    continue
                if _is_link_or_reparse(metadata):
                    raise GuardError(
                        f"Symbolic links, junctions, and reparse points are unsupported: {relative!r}."
                    )
                stack.append(path)
            elif entry.name == ".gitignore":
                if _is_link_or_reparse(metadata) or not stat.S_ISREG(metadata.st_mode):
                    raise GuardError(f"Unsupported .gitignore path type: {relative!r}.")
                discovered[canonical] = (relative, path)
    return sorted(discovered.values(), key=lambda item: item[0])


def _ignore_control_digest(repository: Repository) -> str:
    controls: list[bytes] = []
    for display, path in _active_gitignore_paths(repository):
        _reject_linked_ancestors(repository.root, path)
        relative = display.encode("utf-8")
        controls.append(b"gitignore\0" + relative + b"\0" + _stable_file_digest(path, ".gitignore"))
    info_exclude = _git_path(repository, "info/exclude")
    controls.append(
        b"info-exclude\0"
        + str(info_exclude).encode("utf-8")
        + b"\0"
        + _stable_file_digest(info_exclude, ".git/info/exclude")
    )
    config = _run_git(
        repository.root,
        [
            "config", "--show-origin", "--null", "--get-regexp",
            r"^core\.(excludesfile|ignorecase|filemode|symlinks)$",
        ],
        allow_one=True,
    )
    controls.append(b"core-config\0" + hashlib.sha256(config).digest())
    external_output = _run_git(
        repository.root,
        ["config", "--show-origin", "--null", "--path", "--get", "core.excludesFile"],
        allow_one=True,
    )
    external_path: Path
    if external_output:
        fields = external_output.rstrip(b"\0").split(b"\0")
        if len(fields) != 2:
            raise GuardError("Could not parse the effective core.excludesFile configuration.")
        origin = fields[0].decode("utf-8", "strict")
        external_text = fields[1].decode("utf-8", "strict").strip()
        external_path = Path(os.path.expanduser(external_text))
        if not external_path.is_absolute():
            if not origin.startswith("file:"):
                raise GuardError("A relative core.excludesFile has no resolvable file origin.")
            origin_path = Path(origin[5:])
            if not origin_path.is_absolute():
                origin_path = repository.root / origin_path
            external_path = origin_path.resolve().parent / external_path
    else:
        xdg_home = os.environ.get("XDG_CONFIG_HOME")
        if xdg_home:
            config_home = Path(xdg_home)
            if not config_home.is_absolute():
                raise GuardError("XDG_CONFIG_HOME must be absolute to seal Git global excludes.")
            external_path = config_home / "git" / "ignore"
        else:
            home_value = os.environ.get("HOME")
            home = Path(home_value) if home_value else Path.home()
            if not home.is_absolute():
                raise GuardError("HOME must be absolute to seal Git global excludes.")
            external_path = home / ".config" / "git" / "ignore"
    external_path = external_path.resolve()
    controls.append(
        b"external-excludes\0"
        + str(external_path).encode("utf-8")
        + b"\0"
        + _stable_file_digest(external_path, "effective global excludes file")
    )
    return hashlib.sha256(b"lease-guard-ignore-controls-v1\0" + b"\0".join(controls)).hexdigest()


def _validate_identifier(name: str, value: str) -> str:
    if not IDENTIFIER.fullmatch(value):
        raise UsageError(
            f"{name} must be 1-128 characters using letters, digits, period, underscore, colon, or hyphen."
        )
    return value


def _validate_assignment_identity(
    phase: str,
    attempt: int,
    agent_type: str,
    error_type: type[GuardError],
) -> None:
    if not isinstance(attempt, int) or isinstance(attempt, bool) or attempt not in (1, 2):
        raise error_type("attempt must be 1 or 2.")
    allowed_phases = WORKER_PHASES.get(agent_type)
    if allowed_phases is None:
        raise error_type(f"unsupported write-capable agent type {agent_type!r}.")
    if phase not in allowed_phases:
        raise error_type(f"agent type {agent_type!r} does not permit phase {phase!r}.")


def _path_key(value: str, ignore_case: bool) -> str:
    return value.translate(ASCII_CASE_MAP) if ignore_case else value


def _unsafe_windows_component(component: str) -> bool:
    basename = component.split(".", 1)[0]
    return (
        component.endswith((".", " "))
        or ":" in component
        or any(ord(character) < 32 for character in component)
        or WINDOWS_DEVICE.fullmatch(basename) is not None
    )


def _canonical_path(raw: str, ignore_case: bool) -> str:
    if not raw or "\x00" in raw:
        raise UsageError("Lease paths must be non-empty and cannot contain NUL.")
    if any(character in raw for character in GLOB_CHARACTERS):
        raise UsageError(f"Lease path {raw!r} contains a glob character.")
    windows = PureWindowsPath(raw)
    if windows.is_absolute() or windows.drive or raw.startswith(("/", "\\")):
        raise UsageError(f"Lease path {raw!r} must be repository-relative.")
    normalized = raw.replace("\\", "/") if os.name == "nt" else raw
    parts = normalized.split("/")
    if not parts or any(part in ("", ".", "..") for part in parts):
        raise UsageError(f"Lease path {raw!r} contains traversal or an empty component.")
    if os.name == "nt" and any(_unsafe_windows_component(part) for part in parts):
        raise UsageError(f"Lease path {raw!r} contains a Windows-ambiguous component.")
    canonical = "/".join(parts)
    comparison = _path_key(canonical, ignore_case)
    if comparison == ".git" or comparison.startswith(".git/"):
        raise UsageError("The .git directory cannot be leased.")
    runtime = _path_key(STATE_RELATIVE_ROOT, ignore_case)
    if comparison == runtime or comparison.startswith(runtime + "/"):
        raise UsageError("Lease runtime state cannot be leased.")
    return comparison


def _canonical_git_path(raw: str, ignore_case: bool) -> str:
    normalized = raw.replace("\\", "/") if os.name == "nt" else raw
    parts = normalized.split("/")
    if not parts or any(part in ("", ".", "..") for part in parts):
        raise GuardError(f"Git returned a non-canonical working-tree path: {raw!r}.")
    if os.name == "nt" and any(_unsafe_windows_component(part) for part in parts):
        raise GuardError(f"Git returned a Windows-ambiguous working-tree path: {raw!r}.")
    return _path_key(normalized, ignore_case)


def _unique_paths(values: Iterable[str], option: str, ignore_case: bool) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        canonical = _canonical_path(value, ignore_case)
        if canonical in seen:
            raise UsageError(f"Duplicate {option} scope: {value!r}.")
        seen.add(canonical)
        result.append(canonical)
    return sorted(result)


def _inside(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def _is_link_or_reparse(metadata: os.stat_result) -> bool:
    reparse_flag = getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0)
    attributes = getattr(metadata, "st_file_attributes", 0)
    return stat.S_ISLNK(metadata.st_mode) or bool(reparse_flag and attributes & reparse_flag)


def _reject_linked_ancestors(root: Path, path: Path) -> None:
    try:
        relative = path.relative_to(root)
    except ValueError as error:
        raise GuardError("A working-tree path escaped the repository.") from error
    current = root
    for index, component in enumerate(relative.parts):
        current = current / component
        try:
            metadata = current.lstat()
        except FileNotFoundError:
            return
        except OSError as error:
            raise GuardError(f"Could not inspect path topology for {relative.as_posix()!r}: {error}") from error
        if _is_link_or_reparse(metadata):
            raise GuardError(
                f"Symbolic links, junctions, and reparse points are unsupported: {relative.as_posix()!r}."
            )
        if index < len(relative.parts) - 1 and not stat.S_ISDIR(metadata.st_mode):
            raise GuardError(f"A non-directory path blocks {relative.as_posix()!r}.")


def _validate_scope_topology(
    repository: Repository,
    scopes: dict[str, list[str]],
    *,
    contract_input: bool = True,
) -> None:
    try:
        for name, values in scopes.items():
            directory_scope = name.endswith("dir_roots")
            for relative in values:
                path = repository.root / Path(*relative.split("/"))
                _reject_linked_ancestors(repository.root, path)
                try:
                    metadata = path.lstat()
                except FileNotFoundError:
                    continue
                if directory_scope and not stat.S_ISDIR(metadata.st_mode):
                    raise GuardError(
                        f"Directory-root scope {relative!r} must be an ordinary directory."
                    )
                if not directory_scope and not stat.S_ISREG(metadata.st_mode):
                    raise GuardError(f"Exact-file scope {relative!r} must be an ordinary file.")
    except GuardError as error:
        if contract_input:
            raise UsageError(f"Unsafe lease scope: {error}") from error
        raise


def _state_root(repository: Repository) -> Path:
    lexical = repository.root / Path(*STATE_RELATIVE_ROOT.split("/"))
    _reject_linked_ancestors(repository.root, lexical)
    resolved = lexical.resolve()
    if not _inside(resolved, repository.root):
        raise GuardError("The lease runtime root escaped the repository.")
    if os.path.normcase(str(resolved)) != os.path.normcase(str(lexical.absolute())):
        raise GuardError("The lease runtime root contains a symbolic link, junction, or reparse point.")
    return lexical


def _lease_directory(repository: Repository, lease_id: str) -> Path:
    directory = _state_root(repository) / lease_id
    _reject_linked_ancestors(repository.root, directory)
    return directory


def _runtime_prefix(repository: Repository) -> str | None:
    _state_root(repository)
    return _canonical_git_path(STATE_RELATIVE_ROOT, repository.ignore_case)


def _listed_paths(repository: Repository) -> list[tuple[str, str]]:
    output = _run_git(
        repository.root,
        ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    )
    runtime = _runtime_prefix(repository)
    paths: dict[str, str] = {}
    for encoded in output.split(b"\0"):
        if not encoded:
            continue
        display = _decode_git_path(encoded)
        canonical = _canonical_git_path(display, repository.ignore_case)
        if runtime and (canonical == runtime or canonical.startswith(runtime + "/")):
            continue
        previous = paths.get(canonical)
        if previous is not None and previous != display:
            raise GuardError(f"Case-colliding working-tree paths cannot be inspected: {previous!r}, {display!r}.")
        paths[canonical] = display
    return sorted(paths.items())


def _hash_path(path: Path) -> str | None:
    try:
        before = path.lstat()
    except FileNotFoundError:
        return None
    if _is_link_or_reparse(before):
        raise GuardError(
            f"Symbolic links, junctions, and reparse points are unsupported: {path.name!r}."
        )
    if stat.S_ISREG(before.st_mode):
        digest_object = hashlib.sha256()
        executable = b"executable" if before.st_mode & 0o111 else b"non-executable"
        digest_object.update(b"file\0" + executable + b"\0")
        try:
            with path.open("rb") as stream:
                while True:
                    block = stream.read(1024 * 1024)
                    if not block:
                        break
                    digest_object.update(block)
        except OSError as error:
            raise GuardError(f"Could not read working-tree path {path.name!r}: {error}") from error
        digest = digest_object.hexdigest()
    elif stat.S_ISDIR(before.st_mode):
        raise GuardError(f"Nested repositories and directory endpoints are unsupported: {path.name!r}.")
    else:
        raise GuardError(f"Unsupported working-tree path type: {path.name!r}.")
    try:
        after = path.lstat()
    except FileNotFoundError as error:
        raise GuardError(f"Working-tree path changed during inspection: {path.name!r}.") from error
    stable_fields = ("st_mode", "st_size", "st_mtime_ns", "st_ctime_ns")
    if any(getattr(before, field) != getattr(after, field) for field in stable_fields):
        raise GuardError(f"Working-tree path changed during inspection: {path.name!r}.")
    return digest


def _snapshot_once(repository: Repository) -> dict[str, str]:
    listed_before = _listed_paths(repository)
    snapshot: dict[str, str] = {}
    for canonical, display in listed_before:
        path = repository.root / Path(*PurePosixPath(display).parts)
        _reject_linked_ancestors(repository.root, path)
        digest = _hash_path(path)
        if digest is not None:
            snapshot[canonical] = digest
    if listed_before != _listed_paths(repository):
        raise GuardError("The working-tree path set changed during inspection.")
    return snapshot


def _snapshot(repository: Repository) -> dict[str, str]:
    first = _snapshot_once(repository)
    second = _snapshot_once(repository)
    if first != second:
        raise GuardError("The working tree changed during inspection.")
    return first


def _canonical_json(payload: dict[str, Any]) -> bytes:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("utf-8")


def _digest_payload(payload: dict[str, Any]) -> str:
    unsigned = dict(payload)
    unsigned.pop("digest", None)
    return hashlib.sha256(b"lease-guard-state-v1\0" + _canonical_json(unsigned)).hexdigest()


def _make_read_only(path: Path) -> None:
    try:
        path.chmod(stat.S_IREAD)
    except OSError as error:
        raise GuardError(f"Could not make runtime state immutable: {error}") from error


def _atomic_write_new(path: Path, payload: dict[str, Any]) -> dict[str, Any]:
    payload = dict(payload)
    payload["digest"] = _digest_payload(payload)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    try:
        descriptor = os.open(temporary, flags, 0o600)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(_canonical_json(payload) + b"\n")
            stream.flush()
            os.fsync(stream.fileno())
        try:
            os.link(temporary, path)
        except FileExistsError as error:
            raise GuardError(f"Runtime state already exists: {path.name}.") from error
        temporary.unlink()
        _make_read_only(path)
    except Exception:
        try:
            temporary.unlink(missing_ok=True)
        except OSError:
            pass
        raise
    return payload


def _read_json(path: Path, kind: str) -> dict[str, Any]:
    try:
        metadata = path.lstat()
        if _is_link_or_reparse(metadata) or not stat.S_ISREG(metadata.st_mode):
            raise GuardError(f"{kind} state is not an ordinary file.")
        raw = path.read_bytes()
        after = path.lstat()
        if (
            _is_link_or_reparse(after)
            or not stat.S_ISREG(after.st_mode)
            or any(
                getattr(metadata, field) != getattr(after, field)
                for field in ("st_mode", "st_size", "st_mtime_ns", "st_ctime_ns")
            )
        ):
            raise GuardError(f"{kind} state changed during inspection.")
        payload = json.loads(raw.decode("utf-8"))
    except GuardError:
        raise
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise GuardError(f"{kind} state is missing or malformed: {error}") from error
    if not isinstance(payload, dict):
        raise GuardError(f"{kind} state must be a JSON object.")
    digest = payload.get("digest")
    if not isinstance(digest, str) or not HASH.fullmatch(digest) or digest != _digest_payload(payload):
        raise GuardError(f"{kind} state failed its tamper-evident digest check.")
    return payload


def _validate_contract(payload: dict[str, Any], lease_id: str) -> None:
    required = {
        "schema_version", "repository_identity", "repository_head", "repository_head_ref",
        "repository_ignore_case", "workflow_id", "task_id",
        "cycle_id", "lease_id", "phase", "attempt", "correction_parent_lease_id",
        "owner", "agent_type", "scopes",
        "baseline", "index_digest", "ignore_control_digest", "digest",
    }
    if set(payload) != required or payload.get("schema_version") != VERSION:
        raise GuardError("Contract state has an unsupported or malformed schema.")
    if payload.get("lease_id") != lease_id:
        raise GuardError("Contract state lease identity does not match its directory.")
    for field in ("repository_identity", "workflow_id", "task_id", "cycle_id", "lease_id", "phase", "owner", "agent_type"):
        if not isinstance(payload.get(field), str):
            raise GuardError(f"Contract field {field!r} is malformed.")
    if not HASH.fullmatch(payload["repository_identity"]):
        raise GuardError("Contract repository identity is malformed.")
    if payload["repository_head"] is not None and (
        not isinstance(payload["repository_head"], str)
        or not re.fullmatch(r"[0-9a-fA-F]{40,64}", payload["repository_head"])
    ):
        raise GuardError("Contract repository HEAD is malformed.")
    if payload["repository_head_ref"] is not None and (
        not isinstance(payload["repository_head_ref"], str)
        or not payload["repository_head_ref"].startswith("refs/")
    ):
        raise GuardError("Contract symbolic HEAD is malformed.")
    if not isinstance(payload["repository_ignore_case"], bool):
        raise GuardError("Contract repository case mode is malformed.")
    _validate_assignment_identity(
        payload["phase"], payload["attempt"], payload["agent_type"], GuardError
    )
    correction_parent = payload["correction_parent_lease_id"]
    if payload["attempt"] == 1:
        if correction_parent is not None:
            raise GuardError("Attempt 1 cannot name a correction parent lease.")
    elif (
        not isinstance(correction_parent, str)
        or not IDENTIFIER.fullmatch(correction_parent)
        or correction_parent == lease_id
    ):
        raise GuardError("Attempt 2 requires a valid, distinct correction parent lease ID.")
    if not isinstance(payload.get("baseline"), dict):
        raise GuardError("Contract baseline is malformed.")
    for field in ("index_digest", "ignore_control_digest"):
        if not isinstance(payload.get(field), str) or not HASH.fullmatch(payload[field]):
            raise GuardError(f"Contract {field.replace('_', ' ')} is malformed.")
    for path, digest in payload["baseline"].items():
        if not isinstance(path, str) or not isinstance(digest, str) or not HASH.fullmatch(digest):
            raise GuardError("Contract baseline contains a malformed path or digest.")
    scopes = payload.get("scopes")
    if not isinstance(scopes, dict) or set(scopes) != {
        "allow_files", "allow_dir_roots", "forbid_files", "forbid_dir_roots"
    } or not all(isinstance(value, list) and all(isinstance(item, str) for item in value) for value in scopes.values()):
        raise GuardError("Contract scopes are malformed.")


def _validate_receipt(payload: dict[str, Any], lease_id: str, contract_digest: str) -> None:
    required = {
        "schema_version", "repository_identity", "lease_id", "contract_digest", "verified_head",
        "verified_head_ref", "verified_ignore_case",
        "verified_snapshot_digest", "verified_index_digest", "verified_ignore_control_digest",
        "outcome", "changes", "digest",
    }
    if set(payload) != required or payload.get("schema_version") != VERSION:
        raise GuardError("Receipt state has an unsupported or malformed schema.")
    if payload.get("lease_id") != lease_id or payload.get("contract_digest") != contract_digest:
        raise GuardError("Receipt does not match its lease contract.")
    if not isinstance(payload.get("repository_identity"), str) or not HASH.fullmatch(payload["repository_identity"]):
        raise GuardError("Receipt repository identity is malformed.")
    if not isinstance(payload.get("verified_snapshot_digest"), str) or not HASH.fullmatch(payload["verified_snapshot_digest"]):
        raise GuardError("Receipt snapshot digest is malformed.")
    for field in ("verified_index_digest", "verified_ignore_control_digest"):
        if not isinstance(payload.get(field), str) or not HASH.fullmatch(payload[field]):
            raise GuardError(f"Receipt {field.replace('_', ' ')} is malformed.")
    if payload.get("outcome") not in {"compliant", "violated"}:
        raise GuardError("Receipt outcome is malformed.")
    if payload["verified_head"] is not None and (
        not isinstance(payload["verified_head"], str)
        or not re.fullmatch(r"[0-9a-fA-F]{40,64}", payload["verified_head"])
    ):
        raise GuardError("Receipt repository HEAD is malformed.")
    if payload["verified_head_ref"] is not None and (
        not isinstance(payload["verified_head_ref"], str)
        or not payload["verified_head_ref"].startswith("refs/")
    ):
        raise GuardError("Receipt symbolic HEAD is malformed.")
    if not isinstance(payload["verified_ignore_case"], bool):
        raise GuardError("Receipt repository case mode is malformed.")
    changes = payload.get("changes")
    if not isinstance(changes, dict) or set(changes) != {
        "created", "modified", "deleted", "allowed", "forbidden", "unleased"
    }:
        raise GuardError("Receipt changes are malformed.")
    if not all(isinstance(changes[name], list) for name in changes):
        raise GuardError("Receipt change collections are malformed.")
    if not all(isinstance(path, str) for name in ("created", "modified", "deleted") for path in changes[name]):
        raise GuardError("Receipt path classifications are malformed.")
    for name in ("allowed", "forbidden", "unleased"):
        for entry in changes[name]:
            if (
                not isinstance(entry, dict)
                or set(entry) != {"change", "path"}
                or entry.get("change") not in {"created", "modified", "deleted"}
                or not isinstance(entry.get("path"), str)
            ):
                raise GuardError("Receipt lease classifications are malformed.")


def _validate_existing_receipt(
    repository: Repository, directory: Path, contract: dict[str, Any]
) -> dict[str, Any] | None:
    if _lease_directory(repository, contract["lease_id"]) != directory:
        raise GuardError("Lease directory changed during receipt inspection.")
    receipt_path = directory / RECEIPT_FILE
    if not os.path.lexists(receipt_path):
        return None
    receipt = _read_json(receipt_path, "Receipt")
    if _lease_directory(repository, contract["lease_id"]) != directory:
        raise GuardError("Lease directory changed during receipt inspection.")
    _validate_receipt(receipt, contract["lease_id"], contract["digest"])
    if receipt["repository_identity"] != repository.identity:
        raise GuardError("Receipt belongs to a different repository.")
    return receipt


def _load_contract(repository: Repository, lease_id: str) -> tuple[Path, dict[str, Any]]:
    directory = _lease_directory(repository, lease_id)
    contract = _read_json(directory / CONTRACT_FILE, "Contract")
    if _lease_directory(repository, lease_id) != directory:
        raise GuardError("Lease directory changed during contract inspection.")
    _validate_contract(contract, lease_id)
    if contract["repository_identity"] != repository.identity:
        raise GuardError("Lease contract belongs to a different repository.")
    return directory, contract


def _validate_correction_lineage(
    repository: Repository,
    identities: dict[str, str],
    attempt: int,
    correction_parent_lease_id: str | None,
    scopes: dict[str, list[str]],
) -> str | None:
    """Validate the guard-enforceable portion of one same-contract correction."""

    if attempt == 1:
        if correction_parent_lease_id is not None:
            raise UsageError("Attempt 1 cannot name a correction parent lease.")
        return None
    if correction_parent_lease_id is None:
        raise UsageError("Attempt 2 requires --correction-parent-lease-id.")
    parent_id = _validate_identifier(
        "correction-parent-lease-id", correction_parent_lease_id
    )
    if parent_id == identities["lease_id"]:
        raise UsageError("A correction lease cannot name itself as its parent.")

    parent_directory, parent = _load_contract(repository, parent_id)
    parent_receipt = _validate_existing_receipt(repository, parent_directory, parent)
    if parent_receipt is None:
        raise GuardError("A correction parent lease must have a terminal receipt.")
    if parent["attempt"] != 1 or parent["correction_parent_lease_id"] is not None:
        raise GuardError("A correction parent must be an attempt-1 lease.")

    matching_fields = (
        "workflow_id",
        "task_id",
        "cycle_id",
        "phase",
        "agent_type",
    )
    mismatches = [
        field for field in matching_fields if parent[field] != identities[field]
    ]
    if mismatches:
        raise UsageError(
            "Correction parent assignment does not match: " + ", ".join(mismatches) + "."
        )
    if parent["scopes"] != scopes:
        raise UsageError("Correction parent path scope does not match the new lease.")

    state_root = _state_root(repository)
    for candidate_directory in sorted(state_root.iterdir(), key=lambda path: path.name):
        candidate_metadata = candidate_directory.lstat()
        if _is_link_or_reparse(candidate_metadata):
            raise GuardError("Correction-lineage state contains a link or reparse point.")
        if candidate_directory.name == parent_id or not stat.S_ISDIR(candidate_metadata.st_mode):
            continue
        candidate_path = candidate_directory / CONTRACT_FILE
        if not os.path.lexists(candidate_path):
            continue
        candidate = _read_json(candidate_path, "Correction-child contract")
        _validate_contract(candidate, candidate_directory.name)
        if candidate["repository_identity"] != repository.identity:
            raise GuardError("Correction-child contract belongs to a different repository.")
        if candidate["correction_parent_lease_id"] == parent_id:
            raise UsageError(
                f"Correction parent {parent_id!r} already has an attempt-2 child."
            )
    return parent_id


def _require_contract_pin(contract: dict[str, Any], supplied: str) -> None:
    if not HASH.fullmatch(supplied):
        raise UsageError("contract-digest must be exactly 64 lowercase hexadecimal characters.")
    if supplied != contract["digest"]:
        raise GuardError("Supplied contract digest does not match the immutable lease contract.")


def _active_path(repository: Repository) -> Path:
    return _state_root(repository) / ACTIVE_FILE


def _read_active(repository: Repository) -> dict[str, Any]:
    active = _read_json(_active_path(repository), "Active lease")
    if set(active) != {"schema_version", "repository_identity", "lease_id", "digest"}:
        raise GuardError("Active lease state is malformed.")
    if active.get("schema_version") != VERSION or active.get("repository_identity") != repository.identity:
        raise GuardError("Active lease state belongs to a different repository or schema.")
    if not isinstance(active.get("lease_id"), str) or not IDENTIFIER.fullmatch(active["lease_id"]):
        raise GuardError("Active lease identity is malformed.")
    return active


def _claim_active(repository: Repository, lease_id: str) -> None:
    _atomic_write_new(
        _active_path(repository),
        {"schema_version": VERSION, "repository_identity": repository.identity, "lease_id": lease_id},
    )


def _require_active(repository: Repository, lease_id: str) -> None:
    active = _read_active(repository)
    if active["lease_id"] != lease_id:
        raise GuardError(f"Another lease is active for this worktree: {active['lease_id']!r}.")


def _release_active(repository: Repository, lease_id: str) -> None:
    _require_active(repository, lease_id)
    if os.environ.get("LEASE_GUARD_INTERNAL_FAIL_RELEASE_ACTIVE") == "1":
        raise GuardError("Injected active-pointer release failure.")
    path = _active_path(repository)
    try:
        path.chmod(stat.S_IREAD | stat.S_IWRITE)
        path.unlink()
    except OSError as error:
        raise GuardError(f"Could not release the active lease pointer: {error}") from error


def _matches(path: str, exact: list[str], roots: list[str]) -> bool:
    return path in exact or any(path == root or path.startswith(root + "/") for root in roots)


def _verification(repository: Repository, contract: dict[str, Any]) -> tuple[dict[str, Any], dict[str, str]]:
    _validate_scope_topology(repository, contract["scopes"], contract_input=False)
    current = _snapshot(repository)
    baseline: dict[str, str] = contract["baseline"]
    created = sorted(set(current) - set(baseline))
    deleted = sorted(set(baseline) - set(current))
    modified = sorted(path for path in set(baseline) & set(current) if baseline[path] != current[path])
    scopes = contract["scopes"]
    allowed: list[dict[str, str]] = []
    forbidden: list[dict[str, str]] = []
    unleased: list[dict[str, str]] = []
    for change, paths in (("created", created), ("modified", modified), ("deleted", deleted)):
        for path in paths:
            entry = {"change": change, "path": path}
            if _matches(path, scopes["forbid_files"], scopes["forbid_dir_roots"]):
                forbidden.append(entry)
            elif _matches(path, scopes["allow_files"], scopes["allow_dir_roots"]):
                allowed.append(entry)
            else:
                unleased.append(entry)
    head_oid_changed = repository.head != contract["repository_head"]
    head_ref_changed = repository.head_ref != contract["repository_head_ref"]
    head_changed = head_oid_changed or head_ref_changed
    ignore_case_changed = repository.ignore_case != contract["repository_ignore_case"]
    index_changed = repository.index_digest != contract["index_digest"]
    ignore_controls_changed = repository.ignore_control_digest != contract["ignore_control_digest"]
    ok = (
        not forbidden
        and not unleased
        and not head_changed
        and not ignore_case_changed
        and not index_changed
        and not ignore_controls_changed
    )
    result = {
        "ok": ok,
        "lease_id": contract["lease_id"],
        "status": "verified" if ok else "violation",
        "head_changed": head_changed,
        "head_oid_changed": head_oid_changed,
        "head_ref_changed": head_ref_changed,
        "ignore_case_changed": ignore_case_changed,
        "index_changed": index_changed,
        "ignore_controls_changed": ignore_controls_changed,
        "changes": {
            "created": created,
            "modified": modified,
            "deleted": deleted,
            "allowed": allowed,
            "forbidden": forbidden,
            "unleased": unleased,
        },
    }
    return result, current


def _same_repository_seals(first: Repository, second: Repository) -> bool:
    return all(
        (
            first.identity == second.identity,
            first.head == second.head,
            first.head_ref == second.head_ref,
            first.ignore_case == second.ignore_case,
            first.index_digest == second.index_digest,
            first.ignore_control_digest == second.ignore_control_digest,
        )
    )


def _start(arguments: argparse.Namespace) -> tuple[int, dict[str, Any]]:
    repository = _discover_repository(Path.cwd())
    scope_ignore_case = repository.ignore_case
    identities = {
        key: _validate_identifier(key.replace("_", "-"), getattr(arguments, key))
        for key in ("workflow_id", "task_id", "cycle_id", "lease_id", "phase", "owner", "agent_type")
    }
    _validate_assignment_identity(
        identities["phase"], arguments.attempt, identities["agent_type"], UsageError
    )
    scopes = {
        "allow_files": _unique_paths(arguments.allow_file, "allow-file", repository.ignore_case),
        "allow_dir_roots": _unique_paths(arguments.allow_dir_root, "allow-dir-root", repository.ignore_case),
        "forbid_files": _unique_paths(arguments.forbid_file, "forbid-file", repository.ignore_case),
        "forbid_dir_roots": _unique_paths(arguments.forbid_dir_root, "forbid-dir-root", repository.ignore_case),
    }
    if not scopes["allow_files"] and not scopes["allow_dir_roots"]:
        raise UsageError("At least one allow-file or allow-dir-root scope is required.")
    _validate_scope_topology(repository, scopes)
    _validate_scope_observability(repository, scopes)
    state_root = _state_root(repository)
    state_root.mkdir(parents=True, exist_ok=True)
    correction_parent_lease_id = _validate_correction_lineage(
        repository,
        identities,
        arguments.attempt,
        arguments.correction_parent_lease_id,
        scopes,
    )
    directory = state_root / identities["lease_id"]
    try:
        directory.mkdir(mode=0o700)
    except FileExistsError as error:
        raise UsageError(f"Lease ID {identities['lease_id']!r} already exists and cannot be redefined.") from error
    published: dict[str, Any] | None = None
    try:
        if os.environ.get("LEASE_GUARD_INTERNAL_FAIL_START_AFTER_DIRECTORY") == "1":
            raise GuardError("Injected pre-contract start failure.")
        _claim_active(repository, identities["lease_id"])
        if os.environ.get("LEASE_GUARD_INTERNAL_FAIL_START_AFTER_CLAIM") == "1":
            raise GuardError("Injected post-claim start failure.")
        repository = _discover_repository(repository.root)
        if arguments.attempt == 2:
            revalidated_parent = _validate_correction_lineage(
                repository,
                identities,
                arguments.attempt,
                correction_parent_lease_id,
                scopes,
            )
            if revalidated_parent != correction_parent_lease_id:
                raise GuardError("Correction lineage changed while the lease was starting.")
        if repository.ignore_case != scope_ignore_case:
            raise GuardError("Git path case mode changed while the lease was starting.")
        _validate_scope_topology(repository, scopes)
        _validate_scope_observability(repository, scopes)
        baseline = _snapshot(repository)
        final_repository = _discover_repository(repository.root)
        final_baseline = _snapshot(final_repository)
        if not _same_repository_seals(repository, final_repository) or baseline != final_baseline:
            raise GuardError("The repository changed while the lease baseline was being captured.")
        repository = final_repository
        baseline = final_baseline
        contract = {
            "schema_version": VERSION,
            "repository_identity": repository.identity,
            "repository_head": repository.head,
            "repository_head_ref": repository.head_ref,
            "repository_ignore_case": repository.ignore_case,
            "index_digest": repository.index_digest,
            "ignore_control_digest": repository.ignore_control_digest,
            **identities,
            "attempt": arguments.attempt,
            "correction_parent_lease_id": correction_parent_lease_id,
            "scopes": scopes,
            "baseline": baseline,
        }
        if _lease_directory(repository, identities["lease_id"]) != directory:
            raise GuardError("Lease directory changed while the contract was being published.")
        published = _atomic_write_new(directory / CONTRACT_FILE, contract)
        if _lease_directory(repository, identities["lease_id"]) != directory:
            raise GuardError("Lease directory changed while the contract was being published.")
    except BaseException as error:
        cleanup_errors: list[str] = []
        try:
            active_path = _active_path(repository)
            if os.path.lexists(active_path):
                active = _read_active(repository)
                if active["lease_id"] == identities["lease_id"]:
                    _release_active(repository, identities["lease_id"])
        except GuardError as cleanup_error:
            cleanup_errors.append(str(cleanup_error))
        try:
            if _lease_directory(repository, identities["lease_id"]) != directory:
                raise GuardError("Lease directory changed before start rollback.")
            contract_path = directory / CONTRACT_FILE
            if os.path.lexists(contract_path):
                metadata = contract_path.lstat()
                if _is_link_or_reparse(metadata) or not stat.S_ISREG(metadata.st_mode):
                    raise GuardError("Incomplete contract is not an ordinary file.")
                contract_path.chmod(stat.S_IREAD | stat.S_IWRITE)
                contract_path.unlink()
            directory.rmdir()
        except (GuardError, OSError) as cleanup_error:
            cleanup_errors.append(f"Could not remove incomplete lease state: {cleanup_error}")
        if cleanup_errors:
            raise GuardError(
                "Lease start failed and rollback was incomplete: " + "; ".join(cleanup_errors)
            ) from error
        raise
    assert published is not None
    return 0, {
        "ok": True, "status": "started", "lease_id": identities["lease_id"],
        "contract_digest": published["digest"], "baseline_paths": len(baseline),
    }


def _verify(arguments: argparse.Namespace) -> tuple[int, dict[str, Any]]:
    repository = _discover_repository(Path.cwd())
    lease_id = _validate_identifier("lease-id", arguments.lease_id)
    directory, contract = _load_contract(repository, lease_id)
    _require_contract_pin(contract, arguments.contract_digest)
    if _validate_existing_receipt(repository, directory, contract) is not None:
        raise GuardError("Lease is already closed; use status to inspect its terminal receipt.")
    _require_active(repository, lease_id)
    result, _ = _verification(repository, contract)
    return (0 if result["ok"] else 1), result


def _close(arguments: argparse.Namespace) -> tuple[int, dict[str, Any]]:
    repository = _discover_repository(Path.cwd())
    lease_id = _validate_identifier("lease-id", arguments.lease_id)
    directory, contract = _load_contract(repository, lease_id)
    _require_contract_pin(contract, arguments.contract_digest)
    existing_receipt = _validate_existing_receipt(repository, directory, contract)
    if existing_receipt is not None:
        recovered_active_pointer = False
        active_path = _active_path(repository)
        if os.path.lexists(active_path):
            active = _read_active(repository)
            if active["lease_id"] == lease_id:
                _release_active(repository, lease_id)
                recovered_active_pointer = True
        return 3, {
            "ok": False,
            "status": "closed-replayed",
            "closed": True,
            "already_closed": True,
            "recovered_active_pointer": recovered_active_pointer,
            "requires_status_check": True,
            "terminal_outcome": existing_receipt["outcome"],
            "lease_id": lease_id,
            "receipt_digest": existing_receipt["digest"],
            "changes": existing_receipt["changes"],
        }
    _require_active(repository, lease_id)
    result, verified_snapshot = _verification(repository, contract)
    final_repository = _discover_repository(repository.root)
    if _snapshot(final_repository) != verified_snapshot or not _same_repository_seals(
        repository, final_repository
    ):
        raise GuardError("The working tree changed while the lease was closing.")
    receipt = {
        "schema_version": VERSION,
        "repository_identity": repository.identity,
        "lease_id": lease_id,
        "contract_digest": contract["digest"],
        "verified_head": repository.head,
        "verified_head_ref": repository.head_ref,
        "verified_ignore_case": repository.ignore_case,
        "verified_snapshot_digest": hashlib.sha256(_canonical_json(verified_snapshot)).hexdigest(),
        "verified_index_digest": repository.index_digest,
        "verified_ignore_control_digest": repository.ignore_control_digest,
        "outcome": "compliant" if result["ok"] else "violated",
        "changes": result["changes"],
    }
    if _lease_directory(repository, lease_id) != directory:
        raise GuardError("Lease directory changed while the receipt was being published.")
    published_receipt = _atomic_write_new(directory / RECEIPT_FILE, receipt)
    if _lease_directory(repository, lease_id) != directory:
        raise GuardError("Lease directory changed while the receipt was being published.")
    _release_active(repository, lease_id)
    result["status"] = "closed-compliant" if result["ok"] else "closed-violated"
    result["closed"] = True
    result["receipt_digest"] = published_receipt["digest"]
    return (0 if result["ok"] else 1), result


def _status(arguments: argparse.Namespace) -> tuple[int, dict[str, Any]]:
    repository = _discover_repository(Path.cwd())
    lease_id = _validate_identifier("lease-id", arguments.lease_id)
    directory, contract = _load_contract(repository, lease_id)
    _require_contract_pin(contract, arguments.contract_digest)
    receipt = _validate_existing_receipt(repository, directory, contract)
    closed = receipt is not None
    if not closed:
        _require_active(repository, lease_id)
    result, current_snapshot = _verification(repository, contract)
    result["closed"] = closed
    if receipt is None:
        result["status"] = "active"
        return (0 if result["ok"] else 1), result
    current_snapshot_digest = hashlib.sha256(_canonical_json(current_snapshot)).hexdigest()
    drift = {
        "snapshot_changed": current_snapshot_digest != receipt["verified_snapshot_digest"],
        "head_changed": repository.head != receipt["verified_head"],
        "head_ref_changed": repository.head_ref != receipt["verified_head_ref"],
        "ignore_case_changed": repository.ignore_case != receipt["verified_ignore_case"],
        "index_changed": repository.index_digest != receipt["verified_index_digest"],
        "ignore_controls_changed": (
            repository.ignore_control_digest != receipt["verified_ignore_control_digest"]
        ),
    }
    post_close_drift = any(drift.values())
    current_changes = result.pop("changes")
    result.update(
        {
            "ok": receipt["outcome"] == "compliant" and not post_close_drift,
            "status": "closed-drifted" if post_close_drift else f"closed-{receipt['outcome']}",
            "close_outcome": receipt["outcome"],
            "terminal_receipt": {
                "digest": receipt["digest"],
                "outcome": receipt["outcome"],
                "changes": receipt["changes"],
                "verified_snapshot_digest": receipt["verified_snapshot_digest"],
            },
            "post_close_drift": post_close_drift,
            "post_close_drift_details": drift,
            "current_changes_from_baseline": current_changes,
        }
    )
    return (0 if result["ok"] else 1), result


def _build_parser() -> ArgumentParser:
    parser = ArgumentParser(prog="lease_guard.py", description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    start = commands.add_parser("start", help="Create an immutable lease contract and baseline.")
    for option in ("workflow-id", "task-id", "cycle-id", "lease-id", "phase", "owner", "agent-type"):
        start.add_argument(f"--{option}", required=True)
    start.add_argument("--attempt", required=True, type=int)
    start.add_argument("--correction-parent-lease-id")
    for option in ("allow-file", "allow-dir-root", "forbid-file", "forbid-dir-root"):
        start.add_argument(f"--{option}", action="append", default=[])
    for command in ("verify", "close", "status"):
        subparser = commands.add_parser(command, help=f"{command.title()} a lease.")
        subparser.add_argument("--lease-id", required=True)
        subparser.add_argument("--contract-digest", required=True)
    commands.add_parser("self-test", help="Run isolated end-to-end tests.")
    return parser


def _self_test() -> tuple[int, dict[str, Any]]:
    script = Path(__file__).resolve()
    checks: list[str] = []
    pins: dict[tuple[Path, str], str] = {}

    def git(repo: Path, *args: str) -> None:
        completed = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, shell=False)
        if completed.returncode:
            raise AssertionError(completed.stderr.decode("utf-8", "replace"))

    def repo(root: Path, name: str) -> Path:
        target = root / name
        target.mkdir()
        git(target, "init", "--quiet")
        git(target, "config", "user.email", "lease-guard@example.invalid")
        git(target, "config", "user.name", "Lease Guard Test")
        (target / ".gitignore").write_text("logs/\n", encoding="utf-8")
        (target / "tracked.txt").write_text("baseline\n", encoding="utf-8")
        (target / "delete.txt").write_text("delete me\n", encoding="utf-8")
        git(target, "add", ".gitignore", "tracked.txt", "delete.txt")
        git(target, "commit", "--quiet", "-m", "baseline")
        return target

    def invoke(
        target: Path, *args: str, environment: dict[str, str] | None = None
    ) -> tuple[int, dict[str, Any]]:
        command = list(args)
        if command and command[0] in {"verify", "close", "status"} and "--contract-digest" not in command:
            lease = command[command.index("--lease-id") + 1]
            command.extend(["--contract-digest", pins[(target, lease)]])
        completed = subprocess.run(
            [sys.executable, "-B", str(script), *command],
            cwd=target,
            capture_output=True,
            shell=False,
            env=environment,
        )
        output = completed.stdout.decode("utf-8", "strict").strip()
        try:
            payload = json.loads(output)
        except json.JSONDecodeError as error:
            raise AssertionError(f"Non-JSON output for {command}: {output!r}; stderr={completed.stderr!r}") from error
        if command and command[0] == "start" and completed.returncode == 0:
            lease = command[command.index("--lease-id") + 1]
            pins[(target, lease)] = payload["contract_digest"]
        return completed.returncode, payload

    def start_args(
        lease: str,
        *scopes: str,
        phase: str = "green",
        attempt: int = 1,
        agent_type: str = "code_worker",
        correction_parent_lease_id: str | None = None,
    ) -> tuple[str, ...]:
        command = (
            "start", "--workflow-id", "wf-test", "--task-id", "TASK-TEST", "--cycle-id", "cycle-1",
            "--lease-id", lease, "--phase", phase, "--attempt", str(attempt), "--owner", "coordinator",
            "--agent-type", agent_type, *scopes,
        )
        if correction_parent_lease_id is not None:
            command += ("--correction-parent-lease-id", correction_parent_lease_id)
        return command

    def make_directory_link(link: Path, destination: Path) -> bool:
        try:
            os.symlink(destination, link, target_is_directory=True)
            return True
        except (OSError, NotImplementedError):
            if os.name != "nt":
                return False
        completed = subprocess.run(
            ["cmd.exe", "/d", "/c", "mklink", "/J", str(link), str(destination)],
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=False,
        )
        return completed.returncode == 0 and link.exists()

    with tempfile.TemporaryDirectory(prefix="lease-guard-self-test-") as temporary:
        root = Path(temporary)

        target = repo(root, "assignment-identity")
        invalid_assignments = (
            ("attempt-zero", "green", 0, "code_worker", "attempt must be 1 or 2"),
            ("attempt-three", "green", 3, "code_worker", "attempt must be 1 or 2"),
            ("test-green", "green", 1, "test_worker", "does not permit phase"),
            ("code-red", "red", 1, "code_worker", "does not permit phase"),
            ("code-refactor", "refactor", 1, "code_worker", "does not permit phase"),
            ("code-evidence", "evidence", 2, "code_worker", "does not permit phase"),
            ("frontend-red", "red", 1, "frontend_code_worker", "does not permit phase"),
            ("frontend-evidence", "evidence", 1, "frontend_code_worker", "does not permit phase"),
            ("frontend-setup", "setup", 1, "frontend_code_worker", "does not permit phase"),
            ("frontend-refactor", "refactor", 1, "frontend_code_worker", "does not permit phase"),
            ("uppercase-phase", "GREEN", 1, "code_worker", "does not permit phase"),
            ("unknown-role", "green", 1, "reviewer", "unsupported write-capable agent type"),
        )
        for lease, phase, attempt, agent_type, expected_message in invalid_assignments:
            code, payload = invoke(
                target,
                *start_args(
                    lease,
                    "--allow-file",
                    "tracked.txt",
                    phase=phase,
                    attempt=attempt,
                    agent_type=agent_type,
                ),
            )
            assert code == 2 and expected_message in payload["message"], payload
        valid_assignments = (
            ("test-red", "red", 1, "test_worker"),
            ("test-evidence", "evidence", 1, "test_worker"),
            ("code-setup", "setup", 1, "code_worker"),
            ("code-green", "green", 1, "code_worker"),
            ("frontend-green", "green", 1, "frontend_code_worker"),
        )
        for lease, phase, attempt, agent_type in valid_assignments:
            code, payload = invoke(
                target,
                *start_args(
                    lease,
                    "--allow-file",
                    "tracked.txt",
                    phase=phase,
                    attempt=attempt,
                    agent_type=agent_type,
                ),
            )
            assert code == 0 and payload["status"] == "started", payload
            code, payload = invoke(target, "close", "--lease-id", lease)
            assert code == 0 and payload["status"] == "closed-compliant", payload

        target = repo(root, "stored-assignment-identity")
        code, _ = invoke(
            target,
            *start_args("stored-invalid", "--allow-file", "tracked.txt"),
        )
        assert code == 0
        contract_path = target / STATE_RELATIVE_ROOT / "stored-invalid" / CONTRACT_FILE
        contract_path.chmod(stat.S_IWRITE | stat.S_IREAD)
        contract = json.loads(contract_path.read_text(encoding="utf-8"))
        contract["attempt"] = 3
        contract["digest"] = _digest_payload(contract)
        contract_path.write_bytes(_canonical_json(contract) + b"\n")
        _make_read_only(contract_path)
        code, payload = invoke(target, "verify", "--lease-id", "stored-invalid")
        assert code == 3 and "attempt must be 1 or 2" in payload["message"], payload
        checks.append("attempt and worker phase identity")

        target = repo(root, "correction-lineage")
        code, payload = invoke(
            target,
            *start_args(
                "missing-parent", "--allow-file", "tracked.txt", attempt=2
            ),
        )
        assert code == 2 and "requires --correction-parent-lease-id" in payload["message"], payload
        code, payload = invoke(
            target,
            *start_args(
                "unknown-child",
                "--allow-file",
                "tracked.txt",
                attempt=2,
                correction_parent_lease_id="unknown-parent",
            ),
        )
        assert code == 3 and "missing or malformed" in payload["message"], payload
        code, payload = invoke(
            target,
            *start_args("lineage-parent", "--allow-file", "tracked.txt"),
        )
        assert code == 0, payload
        code, payload = invoke(
            target,
            *start_args(
                "nonterminal-child",
                "--allow-file",
                "tracked.txt",
                attempt=2,
                correction_parent_lease_id="lineage-parent",
            ),
        )
        assert code == 3 and "terminal receipt" in payload["message"], payload
        code, payload = invoke(target, "close", "--lease-id", "lineage-parent")
        assert code == 0, payload
        code, payload = invoke(
            target,
            *start_args(
                "parent-on-attempt-one",
                "--allow-file",
                "tracked.txt",
                correction_parent_lease_id="lineage-parent",
            ),
        )
        assert code == 2 and "Attempt 1 cannot" in payload["message"], payload
        code, payload = invoke(
            target,
            *start_args(
                "wrong-phase-child",
                "--allow-file",
                "tracked.txt",
                phase="setup",
                attempt=2,
                correction_parent_lease_id="lineage-parent",
            ),
        )
        assert code == 2 and "does not match" in payload["message"], payload
        code, payload = invoke(
            target,
            *start_args(
                "wrong-scope-child",
                "--allow-file",
                "delete.txt",
                attempt=2,
                correction_parent_lease_id="lineage-parent",
            ),
        )
        assert code == 2 and "path scope does not match" in payload["message"], payload
        code, payload = invoke(
            target,
            *start_args(
                "lineage-child",
                "--allow-file",
                "tracked.txt",
                attempt=2,
                correction_parent_lease_id="lineage-parent",
            ),
        )
        assert code == 0, payload
        code, payload = invoke(target, "close", "--lease-id", "lineage-child")
        assert code == 0, payload
        code, payload = invoke(
            target,
            *start_args(
                "duplicate-child",
                "--allow-file",
                "tracked.txt",
                attempt=2,
                correction_parent_lease_id="lineage-parent",
            ),
        )
        assert code == 2 and "already has an attempt-2 child" in payload["message"], payload
        checks.append("terminal correction lineage and single-child budget")

        target = repo(root, "allowed")
        code, _ = invoke(target, *start_args("allowed", "--allow-dir-root", "work", "--allow-file", "tracked.txt", "--allow-file", "delete.txt"))
        assert code == 0
        (target / "work").mkdir()
        (target / "work" / "new.txt").write_text("new\n", encoding="utf-8")
        (target / "tracked.txt").write_text("modified\n", encoding="utf-8")
        (target / "delete.txt").unlink()
        code, payload = invoke(target, "verify", "--lease-id", "allowed")
        assert code == 0 and payload["changes"]["created"] == ["work/new.txt"]
        assert payload["changes"]["modified"] == ["tracked.txt"] and payload["changes"]["deleted"] == ["delete.txt"]
        checks.append("allowed create/modify/delete")

        target = repo(root, "forbidden")
        code, _ = invoke(target, *start_args("forbidden", "--allow-file", "tracked.txt", "--forbid-file", "tracked.txt"))
        assert code == 0
        (target / "tracked.txt").write_text("forbidden\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "forbidden")
        assert code == 1 and payload["changes"]["forbidden"][0]["path"] == "tracked.txt"
        checks.append("forbidden overrides allowed")

        target = repo(root, "unleased")
        code, _ = invoke(target, *start_args("unleased", "--allow-file", "tracked.txt"))
        assert code == 0
        (target / "other.txt").write_text("outside\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "unleased")
        assert code == 1 and payload["changes"]["unleased"][0]["path"] == "other.txt"
        checks.append("unleased change")

        target = repo(root, "pins-and-index")
        code, _ = invoke(target, *start_args("pin-index", "--allow-file", "tracked.txt"))
        assert code == 0
        wrong_pin = "0" * 64 if pins[(target, "pin-index")] != "0" * 64 else "1" * 64
        code, payload = invoke(
            target, "verify", "--lease-id", "pin-index", "--contract-digest", wrong_pin
        )
        assert code == 3 and "does not match" in payload["message"]
        git(target, "status", "--short")
        code, payload = invoke(target, "verify", "--lease-id", "pin-index")
        assert code == 0 and not payload["index_changed"]
        (target / "tracked.txt").write_text("staged only\n", encoding="utf-8")
        git(target, "add", "tracked.txt")
        (target / "tracked.txt").write_text("baseline\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "pin-index")
        assert code == 1 and payload["index_changed"]
        checks.append("wrong contract pin, harmless status refresh, and index-only change")

        target = repo(root, "index-flags")
        code, _ = invoke(target, *start_args("index-flags", "--allow-file", "tracked.txt"))
        assert code == 0
        git(target, "update-index", "--skip-worktree", "tracked.txt")
        code, payload = invoke(target, "verify", "--lease-id", "index-flags")
        assert code == 1 and payload["index_changed"]
        checks.append("logical index flag seal")

        target = repo(root, "head-ref")
        code, _ = invoke(target, *start_args("head-ref", "--allow-file", "tracked.txt"))
        assert code == 0
        git(target, "switch", "--quiet", "-c", "same-tip")
        code, payload = invoke(target, "verify", "--lease-id", "head-ref")
        assert code == 1 and payload["head_changed"] and payload["head_ref_changed"]
        assert not payload["head_oid_changed"]
        checks.append("symbolic HEAD seal at the same commit")

        target = repo(root, "ignore-controls")
        code, _ = invoke(target, *start_args("ignore-controls", "--allow-file", ".gitignore"))
        assert code == 0
        (target / ".gitignore").write_text("logs/\nsecret/\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "ignore-controls")
        assert code == 1 and payload["ignore_controls_changed"]
        checks.append("ignore-control tampering")

        target = repo(root, "ignored-control")
        (target / ".gitignore").write_text("logs/\ndist/\n", encoding="utf-8")
        (target / "dist" / "pkg").mkdir(parents=True)
        ignored_control = target / "dist" / "pkg" / ".gitignore"
        ignored_control.write_text("*.tmp\n", encoding="utf-8")
        code, _ = invoke(target, *start_args("ignored-control", "--allow-file", "tracked.txt"))
        assert code == 0
        ignored_control.write_text("*.tmp\n*.cache\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "ignored-control")
        assert code == 0 and not payload["ignore_controls_changed"]
        checks.append("ignored nested ignore controls remain outside proof")

        target = repo(root, "self-hidden-control")
        (target / "evil").mkdir()
        self_hidden = target / "evil" / ".gitignore"
        self_hidden.write_text("/.gitignore\n/secret.txt\n", encoding="utf-8")
        (target / "evil" / "secret.txt").write_text("hidden\n", encoding="utf-8")
        code, _ = invoke(target, *start_args("self-hidden", "--allow-file", "tracked.txt"))
        assert code == 0
        self_hidden.write_text("/.gitignore\n/secret.txt\n/other.txt\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "self-hidden")
        assert code == 1 and payload["ignore_controls_changed"]
        checks.append("self-hidden applicable ignore-control tampering")

        target = repo(root, "implicit-global-excludes")
        xdg_home = root / "xdg-config"
        global_ignore = xdg_home / "git" / "ignore"
        global_ignore.parent.mkdir(parents=True)
        environment = os.environ.copy()
        environment["XDG_CONFIG_HOME"] = str(xdg_home)
        code, payload = invoke(
            target,
            *start_args("implicit-global", "--allow-file", "tracked.txt"),
            environment=environment,
        )
        assert code == 0, payload
        (target / "secret.tmp").write_text("unleased\n", encoding="utf-8")
        global_ignore.write_text("*.tmp\n", encoding="utf-8")
        code, payload = invoke(
            target, "verify", "--lease-id", "implicit-global", environment=environment
        )
        assert code == 1 and payload["ignore_controls_changed"]
        target = repo(root, "implicit-home-excludes")
        git_home = root / "git-home"
        home_ignore = git_home / ".config" / "git" / "ignore"
        home_ignore.parent.mkdir(parents=True)
        environment = os.environ.copy()
        environment.pop("XDG_CONFIG_HOME", None)
        environment["HOME"] = str(git_home)
        code, payload = invoke(
            target,
            *start_args("implicit-home", "--allow-file", "tracked.txt"),
            environment=environment,
        )
        assert code == 0, payload
        (target / "private.cache").write_text("unleased\n", encoding="utf-8")
        home_ignore.write_text("*.cache\n", encoding="utf-8")
        code, payload = invoke(
            target, "verify", "--lease-id", "implicit-home", environment=environment
        )
        assert code == 1 and payload["ignore_controls_changed"]
        checks.append("implicit XDG and HOME global excludes tampering")

        target = repo(root, "ignored-scope")
        (target / ".gitignore").write_text("logs/\ndist/\n", encoding="utf-8")
        (target / "dist").mkdir()
        (target / "dist" / "output.txt").write_text("ignored\n", encoding="utf-8")
        for option, scope in (
            ("--allow-file", "dist/output.txt"),
            ("--allow-dir-root", "dist"),
            ("--forbid-file", "dist/output.txt"),
            ("--forbid-dir-root", "dist"),
        ):
            lease = "ignored-scope-" + option.removeprefix("--")
            scope_args = (
                ("--allow-file", "tracked.txt", option, scope)
                if option.startswith("--forbid")
                else (option, scope)
            )
            code, payload = invoke(target, *start_args(lease, *scope_args))
            assert code == 2 and "ignored by Git" in payload["message"], payload
        checks.append("ignored lease scopes fail closed")

        target = repo(root, "scope-types")
        code, payload = invoke(
            target, *start_args("file-as-root", "--allow-dir-root", "tracked.txt")
        )
        assert code == 2 and "must be an ordinary directory" in payload["message"], payload
        code, payload = invoke(
            target, *start_args("root-becomes-file", "--allow-dir-root", "future-root")
        )
        assert code == 0, payload
        (target / "future-root").write_text("wrong endpoint type\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "root-becomes-file")
        assert code == 3 and "must be an ordinary directory" in payload["message"], payload
        checks.append("file and directory scope type enforcement")

        if os.name != "nt":
            target = repo(root, "executable-mode")
            git(target, "config", "core.filemode", "true")
            code, _ = invoke(target, *start_args("executable-mode", "--allow-file", "tracked.txt"))
            assert code == 0
            (target / "tracked.txt").chmod(0o755)
            code, payload = invoke(target, "verify", "--lease-id", "executable-mode")
            assert code == 0 and payload["changes"]["modified"] == ["tracked.txt"]
            assert not payload["index_changed"]
            checks.append("unstaged executable-mode change")

        target = repo(root, "dirty")
        (target / "tracked.txt").write_text("dirty before start\n", encoding="utf-8")
        (target / "dirty-untracked.txt").write_text("dirty before start\n", encoding="utf-8")
        code, _ = invoke(target, *start_args("dirty-allowed", "--allow-file", "tracked.txt", "--allow-file", "dirty-untracked.txt"))
        assert code == 0
        (target / "tracked.txt").write_text("dirty changed again\n", encoding="utf-8")
        (target / "dirty-untracked.txt").write_text("dirty changed again\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "dirty-allowed")
        assert code == 0 and payload["changes"]["modified"] == ["dirty-untracked.txt", "tracked.txt"]
        code, closed = invoke(target, "close", "--lease-id", "dirty-allowed")
        assert code == 0 and closed["status"] == "closed-compliant"
        code, _ = invoke(target, *start_args("dirty-unleased", "--allow-file", "delete.txt"))
        assert code == 0
        (target / "tracked.txt").write_text("third dirty value\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "dirty-unleased")
        assert code == 1 and any(item["path"] == "tracked.txt" for item in payload["changes"]["unleased"])
        checks.append("already-dirty allowed and unleased modifications")

        target = repo(root, "ignored")
        code, _ = invoke(target, *start_args("ignored", "--allow-file", "tracked.txt"))
        assert code == 0
        state_file = target / STATE_RELATIVE_ROOT / "ignored" / "noise.tmp"
        state_file.write_text("ignored runtime\n", encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "ignored")
        assert code == 0 and not payload["changes"]["created"]
        checks.append("ignored runtime state")

        code, _ = invoke(target, "close", "--lease-id", "ignored")
        assert code == 0
        code, _ = invoke(target, *start_args("ignored", "--allow-file", "tracked.txt"))
        assert code == 2
        checks.append("duplicate lease ID")

        target = repo(root, "concurrent-start")
        commands = [
            [sys.executable, "-B", str(script), *start_args(lease, "--allow-file", "tracked.txt")]
            for lease in ("concurrent-a", "concurrent-b")
        ]
        processes = [subprocess.Popen(command, cwd=target, stdout=subprocess.PIPE, stderr=subprocess.PIPE) for command in commands]
        completed = [process.communicate() + (process.returncode,) for process in processes]
        assert sorted(item[2] for item in completed) == [0, 3]
        winner_payload = json.loads(next(item[0] for item in completed if item[2] == 0).decode("utf-8"))
        loser_payload = json.loads(next(item[0] for item in completed if item[2] != 0).decode("utf-8"))
        winner = winner_payload["lease_id"]
        loser = "concurrent-b" if winner == "concurrent-a" else "concurrent-a"
        assert loser_payload["status"] == "error"
        assert not (target / STATE_RELATIVE_ROOT / loser).exists()
        pins[(target, winner)] = winner_payload["contract_digest"]
        code, _ = invoke(target, "close", "--lease-id", winner)
        assert code == 0
        checks.append("atomic concurrent start rejection")

        target = repo(root, "failed-start-recovery")
        environment = os.environ.copy()
        environment["LEASE_GUARD_INTERNAL_FAIL_START_AFTER_DIRECTORY"] = "1"
        failed = subprocess.run(
            [sys.executable, "-B", str(script), *start_args("failed-start", "--allow-file", "tracked.txt")],
            cwd=target, capture_output=True, shell=False, env=environment,
        )
        assert failed.returncode == 3
        assert not (target / STATE_RELATIVE_ROOT / "failed-start").exists()
        assert not (target / STATE_RELATIVE_ROOT / ACTIVE_FILE).exists()
        environment["LEASE_GUARD_INTERNAL_FAIL_START_AFTER_DIRECTORY"] = "0"
        environment["LEASE_GUARD_INTERNAL_FAIL_START_AFTER_CLAIM"] = "1"
        failed = subprocess.run(
            [sys.executable, "-B", str(script), *start_args("failed-after-claim", "--allow-file", "tracked.txt")],
            cwd=target, capture_output=True, shell=False, env=environment,
        )
        assert failed.returncode == 3
        assert not (target / STATE_RELATIVE_ROOT / "failed-after-claim").exists()
        assert not (target / STATE_RELATIVE_ROOT / ACTIVE_FILE).exists()
        replacement_lease = "replacement-after-failed-start"
        code, _ = invoke(target, *start_args(replacement_lease, "--allow-file", "tracked.txt"))
        assert code == 0
        code, _ = invoke(target, "close", "--lease-id", replacement_lease)
        assert code == 0
        checks.append("pre-contract and post-claim start rollback")

        bad_paths = [
            "../escape.txt", "nested//file.txt", "nested/./file.txt", "nested/file.txt/",
            str((target / "absolute.txt").resolve()), ".git/config",
        ]
        if os.name == "nt":
            bad_paths.extend(("CON.txt", "trailing-dot.", "trailing-space ", "stream:name"))
        for bad in bad_paths:
            code, _ = invoke(target, *start_args("bad-" + hashlib.sha256(bad.encode()).hexdigest()[:8], "--allow-file", bad))
            assert code == 2
        checks.append("lexical traversal, ambiguous component, absolute, and .git rejection")

        target = repo(root, "submodule")
        module = target / "module"
        module.mkdir()
        git(module, "init", "--quiet")
        git(module, "config", "user.email", "lease-guard@example.invalid")
        git(module, "config", "user.name", "Lease Guard Test")
        (module / "inner.txt").write_text("baseline\n", encoding="utf-8")
        git(module, "add", "inner.txt")
        git(module, "commit", "--quiet", "-m", "nested baseline")
        git(target, "add", "module")
        git(target, "commit", "--quiet", "-m", "gitlink")
        (module / "inner.txt").write_text("dirty nested state\n", encoding="utf-8")
        code, payload = invoke(target, *start_args("submodule", "--allow-file", "tracked.txt"))
        assert code == 3 and "submodules are unsupported" in payload["message"]
        checks.append("dirty submodule fails closed")

        unborn = root / "unborn"
        unborn.mkdir()
        git(unborn, "init", "--quiet")
        git(unborn, "config", "user.email", "lease-guard@example.invalid")
        git(unborn, "config", "user.name", "Lease Guard Test")
        (unborn / ".gitignore").write_text("logs/\n", encoding="utf-8")
        (unborn / "tracked.txt").write_text("unborn\n", encoding="utf-8")
        code, payload = invoke(unborn, *start_args("unborn", "--allow-file", "tracked.txt"))
        assert code == 0, payload
        code, payload = invoke(unborn, "close", "--lease-id", "unborn")
        assert code == 0 and payload["status"] == "closed-compliant"
        checks.append("unborn symbolic HEAD baseline")

        target = repo(root, "linked-scope")
        linked_target = target / "real"
        linked_target.mkdir()
        linked_created = make_directory_link(target / "linked", linked_target)
        if linked_created:
            code, payload = invoke(target, *start_args("linked-scope", "--allow-dir-root", "linked"))
            assert code == 3 and "reparse points are unsupported" in payload["message"], payload
            runtime_target = repo(root, "linked-runtime")
            runtime_destination = runtime_target / "runtime-destination"
            runtime_destination.mkdir()
            assert make_directory_link(runtime_target / "logs", runtime_destination)
            code, payload = invoke(
                runtime_target, *start_args("linked-runtime", "--allow-file", "tracked.txt")
            )
            assert code == 3 and "reparse points are unsupported" in payload["message"]

            lease_link_target = repo(root, "linked-lease-directory")
            code, payload = invoke(
                lease_link_target,
                *start_args("linked-lease", "--allow-file", "tracked.txt"),
            )
            assert code == 0, payload
            lease_directory = lease_link_target / STATE_RELATIVE_ROOT / "linked-lease"
            contract_path = lease_directory / CONTRACT_FILE
            external_lease_directory = root / "external-lease-state"
            external_lease_directory.mkdir()
            (external_lease_directory / CONTRACT_FILE).write_bytes(contract_path.read_bytes())
            contract_path.chmod(stat.S_IREAD | stat.S_IWRITE)
            contract_path.unlink()
            lease_directory.rmdir()
            assert make_directory_link(lease_directory, external_lease_directory)
            code, payload = invoke(lease_link_target, "verify", "--lease-id", "linked-lease")
            assert code == 3 and "reparse points are unsupported" in payload["message"], payload

            git_info_target = repo(root, "linked-git-info")
            code, payload = invoke(
                git_info_target,
                *start_args("linked-git-info", "--allow-file", "tracked.txt"),
            )
            assert code == 0, payload
            info_directory = git_info_target / ".git" / "info"
            external_info_directory = root / "external-git-info"
            shutil.copytree(info_directory, external_info_directory)
            shutil.rmtree(info_directory)
            assert make_directory_link(info_directory, external_info_directory)
            code, payload = invoke(
                git_info_target, "verify", "--lease-id", "linked-git-info"
            )
            assert code == 1 and payload["ignore_controls_changed"], payload
            checks.append(
                "symbolic-link scope, runtime-root, lease-state, and linked Git-info ignore-control topology rejection"
            )
        else:
            checks.append(
                "symbolic-link scope, runtime-root, lease-state, and linked Git-info ignore-control topology rejection explicitly unsupported by host"
            )

        target = repo(root, "tamper")
        code, _ = invoke(target, *start_args("tamper", "--allow-file", "tracked.txt"))
        assert code == 0
        contract_path = target / STATE_RELATIVE_ROOT / "tamper" / CONTRACT_FILE
        contract_path.chmod(stat.S_IWRITE | stat.S_IREAD)
        contract = json.loads(contract_path.read_text(encoding="utf-8"))
        contract["owner"] = "attacker"
        contract_path.write_text(json.dumps(contract), encoding="utf-8")
        code, payload = invoke(target, "verify", "--lease-id", "tamper")
        assert code == 3 and "tamper-evident" in payload["message"]
        checks.append("contract tamper detection")

        target = repo(root, "close")
        code, _ = invoke(target, *start_args("close", "--allow-file", "tracked.txt"))
        assert code == 0
        (target / "outside.txt").write_text("violation\n", encoding="utf-8")
        code, payload = invoke(target, "close", "--lease-id", "close")
        assert code == 1 and payload["status"] == "closed-violated"
        assert (target / STATE_RELATIVE_ROOT / "close" / RECEIPT_FILE).exists()
        (target / "outside.txt").unlink()
        code, payload = invoke(target, "close", "--lease-id", "close")
        assert code == 3 and payload["already_closed"] and not payload["recovered_active_pointer"]
        assert payload["requires_status_check"]
        code, _ = invoke(target, *start_args("correction", "--allow-file", "tracked.txt"))
        assert code == 0
        (target / "tracked.txt").write_text("accepted terminal value\n", encoding="utf-8")
        code, payload = invoke(target, "close", "--lease-id", "correction")
        assert code == 0 and payload["status"] == "closed-compliant"
        (target / "tracked.txt").write_text("baseline\n", encoding="utf-8")
        code, payload = invoke(target, "status", "--lease-id", "correction")
        assert code == 1 and payload["closed"] and payload["post_close_drift"]
        assert payload["current_changes_from_baseline"]["created"] == []
        assert payload["terminal_receipt"]["changes"]["modified"] == ["tracked.txt"]
        checks.append("terminal receipts, state-safe close replay, and allowed-path post-close drift")

        target = repo(root, "release-recovery")
        code, _ = invoke(target, *start_args("release-recovery", "--allow-file", "tracked.txt"))
        assert code == 0
        environment = os.environ.copy()
        environment["LEASE_GUARD_INTERNAL_FAIL_RELEASE_ACTIVE"] = "1"
        failed = subprocess.run(
            [
                sys.executable, "-B", str(script), "close", "--lease-id", "release-recovery",
                "--contract-digest", pins[(target, "release-recovery")],
            ],
            cwd=target, capture_output=True, shell=False, env=environment,
        )
        assert failed.returncode == 3
        assert (target / STATE_RELATIVE_ROOT / "release-recovery" / RECEIPT_FILE).exists()
        assert (target / STATE_RELATIVE_ROOT / ACTIVE_FILE).exists()
        code, payload = invoke(target, "close", "--lease-id", "release-recovery")
        assert code == 3 and payload["already_closed"] and payload["recovered_active_pointer"]
        assert payload["requires_status_check"]
        assert not (target / STATE_RELATIVE_ROOT / ACTIVE_FILE).exists()
        code, payload = invoke(target, "status", "--lease-id", "release-recovery")
        assert code == 0 and payload["status"] == "closed-compliant"
        assert not payload["post_close_drift"]
        checks.append("terminal receipt active-pointer recovery")

        target = repo(root, "external")
        code, _ = invoke(target, *start_args("external", "--allow-file", "tracked.txt"))
        assert code == 0
        external = subprocess.run(
            [sys.executable, "-c", "from pathlib import Path; Path('external.txt').write_text('external\\n')"],
            cwd=target, capture_output=True, shell=False,
        )
        assert external.returncode == 0
        code, payload = invoke(target, "verify", "--lease-id", "external")
        assert code == 1 and payload["changes"]["unleased"][0]["path"] == "external.txt"
        checks.append("concurrent external-process change")

    return 0, {"ok": True, "status": "self-test-passed", "checks": checks, "check_count": len(checks)}


def main(argv: list[str] | None = None) -> int:
    try:
        arguments = _build_parser().parse_args(argv)
        if arguments.command == "start":
            code, payload = _start(arguments)
        elif arguments.command == "verify":
            code, payload = _verify(arguments)
        elif arguments.command == "close":
            code, payload = _close(arguments)
        elif arguments.command == "status":
            code, payload = _status(arguments)
        else:
            code, payload = _self_test()
        _emit(payload)
        return code
    except GuardError as error:
        _emit({"ok": False, "status": "error", "message": str(error), "exit_code": error.code})
        return error.code
    except (AssertionError, OSError) as error:
        _emit({"ok": False, "status": "self-test-failed", "message": str(error), "exit_code": 3})
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
