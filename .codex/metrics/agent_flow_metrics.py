#!/usr/bin/env python3
"""Best-effort, local telemetry for the repository's agent workflows.

The hook entry point deliberately persists only an allowlist of lifecycle fields.
It never records prompts, messages, transcript paths, or working directories.
Runtime events are atomically published: each invocation publishes one unique JSON file and
never edits an existing event.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import io
import json
import os
import re
import sys
import tempfile
import uuid
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable, Mapping, Sequence, TextIO


SCHEMA_VERSION = 1
HOOK_EVENT_TYPES = {
    "SubagentStart": "agent_started",
    "SubagentStop": "agent_stopped",
}
SEMANTIC_EVENT_TYPES = (
    "workflow_started",
    "workflow_completed",
    "lease_started",
    "lease_completed",
    "red_accepted",
    "red_rejected",
    "correction_requested",
    "regression_confirmed",
    "token_usage_reported",
)
ALL_EVENT_TYPES = frozenset(
    (*HOOK_EVENT_TYPES.values(), "hook_capture_failed", *SEMANTIC_EVENT_TYPES)
)
TOKEN_FIELDS = (
    "input_tokens",
    "cached_input_tokens",
    "output_tokens",
    "reasoning_tokens",
)
FALSE_RED_REASONS = frozenset(
    {
        "infrastructure_failure",
        "pre_existing_failure",
        "requirement_mismatch",
        "setup_failure",
        "unrelated_failure",
        "wrong_failure",
    }
)
HOOK_PERSISTED_FIELDS = (
    "session_id",
    "turn_id",
    "agent_id",
    "agent_type",
    "model",
    "permission_mode",
)
EVENT_FIELDS = frozenset(
    {
        "schema_version",
        "event_id",
        "recorded_at",
        "source",
        "event_type",
        *HOOK_PERSISTED_FIELDS,
        "workflow_id",
        "task_id",
        "cycle_id",
        "lease_id",
        "phase",
        "attempt",
        "reason_code",
        "check_id",
        "token_usage",
    }
)
IDENTIFIER_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$")


def _utc_now() -> str:
    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )


def _parse_timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _default_events_dir() -> Path:
    repository_root = Path(__file__).resolve().parents[2]
    return repository_root / "logs" / "agent-flow-metrics" / "v1" / "events"


def _bounded_string(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    stripped = value.strip()
    if not stripped:
        return None
    return stripped[:256]


def _base_event(source: str, event_type: str, recorded_at: str | None = None) -> dict[str, Any]:
    return {
        "schema_version": SCHEMA_VERSION,
        "event_id": str(uuid.uuid4()),
        "recorded_at": recorded_at or _utc_now(),
        "source": source,
        "event_type": event_type,
    }


def _event_filename(event: Mapping[str, Any]) -> str:
    timestamp = re.sub(r"[^0-9A-Za-z]", "", str(event["recorded_at"]))
    return f"{timestamp}-{event['event_id']}.json"


def _write_event(event: Mapping[str, Any], events_dir: Path) -> Path:
    """Atomically publish one event without reopening or replacing it later."""

    events_dir.mkdir(parents=True, exist_ok=True)
    final_path = events_dir / _event_filename(event)
    temporary_path = events_dir / f".{event['event_id']}.tmp"
    payload = (json.dumps(event, sort_keys=True, separators=(",", ":")) + "\n").encode(
        "utf-8"
    )

    descriptor = os.open(temporary_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
        if final_path.exists():
            raise FileExistsError(f"Event already exists: {final_path.name}")
        os.replace(temporary_path, final_path)
    except BaseException:
        try:
            temporary_path.unlink(missing_ok=True)
        except OSError:
            pass
        raise
    return final_path


def _build_hook_event(payload: Mapping[str, Any]) -> dict[str, Any]:
    hook_name = payload.get("hook_event_name")
    event_type = HOOK_EVENT_TYPES.get(hook_name)
    if event_type is None:
        raise ValueError("Unsupported hook event")

    required_identity_fields = ("session_id", "turn_id", "agent_id", "agent_type")
    if any(_bounded_string(payload.get(field)) is None for field in required_identity_fields):
        raise ValueError("Hook lifecycle payload is missing required identity fields")

    event = _base_event("codex_hook", event_type)
    for field in HOOK_PERSISTED_FIELDS:
        value = _bounded_string(payload.get(field))
        if value is not None:
            event[field] = value
    return event


def _run_hook(
    stdin: TextIO,
    stdout: TextIO,
    events_dir: Path | None = None,
) -> int:
    """Capture a lifecycle event, but never change Codex continuation behavior."""

    destination = events_dir or _default_events_dir()
    try:
        payload = json.load(stdin)
        if not isinstance(payload, Mapping):
            raise ValueError("Hook input must be an object")
        event = _build_hook_event(payload)
    except BaseException:
        event = _base_event("codex_hook", "hook_capture_failed")

    try:
        _write_event(event, destination)
    except BaseException:
        # Telemetry is observational. A storage failure must not affect the agent.
        pass

    try:
        stdout.write("{}\n")
        stdout.flush()
    except BaseException:
        pass
    return 0


def _identifier(value: str) -> str:
    if not IDENTIFIER_PATTERN.fullmatch(value):
        raise argparse.ArgumentTypeError(
            "must start with an alphanumeric character and contain only "
            "letters, digits, '.', '_', ':', '/', or '-' (maximum 128 characters)"
        )
    return value


def _nonnegative_integer(value: str) -> int:
    try:
        parsed = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("must be an integer") from error
    if parsed < 0:
        raise argparse.ArgumentTypeError("must be nonnegative")
    return parsed


def _positive_integer(value: str) -> int:
    parsed = _nonnegative_integer(value)
    if parsed == 0:
        raise argparse.ArgumentTypeError("must be greater than zero")
    return parsed


def _require(arguments: argparse.Namespace, *names: str) -> None:
    missing = [name.replace("_", "-") for name in names if getattr(arguments, name) is None]
    if missing:
        raise ValueError(f"{arguments.event} requires: " + ", ".join(f"--{n}" for n in missing))


def _record_event(arguments: argparse.Namespace) -> dict[str, Any]:
    _require(arguments, "workflow_id", "task_id")
    if arguments.event in {"lease_started", "lease_completed"}:
        _require(
            arguments,
            "cycle_id",
            "lease_id",
            "phase",
            "attempt",
            "agent_id",
            "agent_type",
        )
    elif arguments.event in {"red_accepted", "red_rejected"}:
        _require(arguments, "cycle_id", "attempt")
    elif arguments.event == "correction_requested":
        _require(
            arguments,
            "cycle_id",
            "lease_id",
            "phase",
            "attempt",
            "agent_id",
            "agent_type",
            "reason_code",
        )
        if arguments.attempt != 2:
            raise ValueError("correction_requested requires --attempt 2")
    elif arguments.event == "regression_confirmed":
        _require(arguments, "cycle_id", "check_id", "reason_code")
    elif arguments.event == "token_usage_reported":
        _require(arguments, "agent_id", "agent_type")

    if arguments.event == "red_rejected":
        _require(arguments, "reason_code")
        if arguments.reason_code not in FALSE_RED_REASONS:
            raise ValueError(
                "red_rejected reason_code must be one of: "
                + ", ".join(sorted(FALSE_RED_REASONS))
            )

    token_values = {field: getattr(arguments, field) for field in TOKEN_FIELDS}
    if arguments.event == "token_usage_reported" and all(
        value is None for value in token_values.values()
    ):
        raise ValueError("token_usage_reported requires at least one exact token counter")
    if arguments.event != "token_usage_reported" and any(
        value is not None for value in token_values.values()
    ):
        raise ValueError("token counters are valid only for token_usage_reported")

    event = _base_event("coordinator", arguments.event)
    for field in (
        "workflow_id",
        "task_id",
        "cycle_id",
        "lease_id",
        "phase",
        "attempt",
        "agent_id",
        "agent_type",
        "reason_code",
        "check_id",
    ):
        value = getattr(arguments, field)
        if value is not None:
            event[field] = value
    if arguments.event == "token_usage_reported":
        event["token_usage"] = token_values
    return event


def _load_event_files(
    events_dir: Path,
) -> tuple[list[dict[str, Any]], list[str], int]:
    events: list[dict[str, Any]] = []
    errors: list[str] = []
    if not events_dir.exists():
        return events, errors, 0

    for path in sorted(events_dir.glob("*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            errors.append(f"{path.name}: invalid JSON")
            continue
        if not isinstance(payload, dict):
            errors.append(f"{path.name}: event must be a JSON object")
            continue
        event_errors = _validate_event(payload)
        if event_errors:
            errors.append(f"{path.name}: " + "; ".join(event_errors))
            continue
        events.append(payload)
    normalized, dataset_errors, replay_count = _normalize_event_set(events)
    return normalized, [*errors, *dataset_errors], replay_count


def _validate_identifier_field(event: Mapping[str, Any], field: str, errors: list[str]) -> None:
    value = event.get(field)
    if value is not None and (
        not isinstance(value, str) or not IDENTIFIER_PATTERN.fullmatch(value)
    ):
        errors.append(f"{field} is not a valid identifier")


def _validate_event(event: Mapping[str, Any]) -> list[str]:
    errors: list[str] = []
    unexpected = sorted(set(event) - EVENT_FIELDS)
    if unexpected:
        errors.append("unexpected fields: " + ", ".join(unexpected))
    if event.get("schema_version") != SCHEMA_VERSION:
        errors.append(f"schema_version must be {SCHEMA_VERSION}")
    try:
        uuid.UUID(str(event.get("event_id")))
    except (ValueError, TypeError, AttributeError):
        errors.append("event_id must be a UUID")
    try:
        timestamp = _parse_timestamp(str(event.get("recorded_at")))
        if timestamp.tzinfo is None:
            raise ValueError
    except ValueError:
        errors.append("recorded_at must be an ISO-8601 timestamp with a timezone")

    source = event.get("source")
    event_type = event.get("event_type")
    if source not in {"codex_hook", "coordinator"}:
        errors.append("source is invalid")
    if event_type not in ALL_EVENT_TYPES:
        errors.append("event_type is invalid")
        return errors
    if event_type in {*HOOK_EVENT_TYPES.values(), "hook_capture_failed"}:
        if source != "codex_hook":
            errors.append("hook lifecycle events require source=codex_hook")
    elif source != "coordinator":
        errors.append("semantic events require source=coordinator")

    if event_type in HOOK_EVENT_TYPES.values():
        for field in ("session_id", "turn_id", "agent_id", "agent_type"):
            if event.get(field) is None:
                errors.append(f"{event_type} requires {field}")

    for field in (
        "session_id",
        "turn_id",
        "agent_id",
        "agent_type",
        "model",
        "permission_mode",
        "workflow_id",
        "task_id",
        "cycle_id",
        "lease_id",
        "phase",
        "reason_code",
        "check_id",
    ):
        _validate_identifier_field(event, field, errors)
    attempt = event.get("attempt")
    if attempt is not None and (
        not isinstance(attempt, int) or isinstance(attempt, bool) or attempt <= 0
    ):
        errors.append("attempt must be a positive integer")

    if event_type in SEMANTIC_EVENT_TYPES:
        for field in ("workflow_id", "task_id"):
            if event.get(field) is None:
                errors.append(f"semantic events require {field}")
    if event_type in {"lease_started", "lease_completed"}:
        for field in (
            "cycle_id",
            "lease_id",
            "phase",
            "attempt",
            "agent_id",
            "agent_type",
        ):
            if event.get(field) is None:
                errors.append(f"{event_type} requires {field}")
    if event_type in {"red_accepted", "red_rejected"}:
        for field in ("cycle_id", "attempt"):
            if event.get(field) is None:
                errors.append(f"{event_type} requires {field}")
    if event_type == "red_rejected" and event.get("reason_code") is None:
        errors.append("red_rejected requires reason_code")
    if event_type == "red_rejected" and event.get("reason_code") not in FALSE_RED_REASONS:
        errors.append(
            "red_rejected reason_code must be one of: "
            + ", ".join(sorted(FALSE_RED_REASONS))
        )
    if event_type == "correction_requested":
        for field in (
            "cycle_id",
            "lease_id",
            "phase",
            "attempt",
            "agent_id",
            "agent_type",
            "reason_code",
        ):
            if event.get(field) is None:
                errors.append(f"correction_requested requires {field}")
        if isinstance(attempt, int) and not isinstance(attempt, bool) and attempt != 2:
            errors.append("correction_requested requires attempt 2")
    if event_type == "regression_confirmed":
        for field in ("cycle_id", "check_id", "reason_code"):
            if event.get(field) is None:
                errors.append(f"regression_confirmed requires {field}")

    token_usage = event.get("token_usage")
    if event_type == "token_usage_reported":
        for field in ("agent_id", "agent_type"):
            if event.get(field) is None:
                errors.append(f"token_usage_reported requires {field}")
        if not isinstance(token_usage, dict):
            errors.append("token_usage_reported requires token_usage")
        else:
            unexpected_tokens = sorted(set(token_usage) - set(TOKEN_FIELDS))
            if unexpected_tokens:
                errors.append("unexpected token fields: " + ", ".join(unexpected_tokens))
            exact_count = 0
            for field in TOKEN_FIELDS:
                value = token_usage.get(field)
                if value is None:
                    continue
                if not isinstance(value, int) or isinstance(value, bool) or value < 0:
                    errors.append(f"{field} must be null or a nonnegative integer")
                else:
                    exact_count += 1
            if exact_count == 0:
                errors.append("token_usage must contain at least one exact counter")
    elif token_usage is not None:
        errors.append("token_usage is valid only for token_usage_reported")
    return errors


def _canonical_payload(event: Mapping[str, Any]) -> str:
    payload = {
        key: value
        for key, value in event.items()
        if key not in {"event_id", "recorded_at"}
    }
    return json.dumps(payload, sort_keys=True, separators=(",", ":"))


def _event_id_payload(event: Mapping[str, Any]) -> str:
    return json.dumps(event, sort_keys=True, separators=(",", ":"))


def _logical_key(event: Mapping[str, Any]) -> tuple[Any, ...]:
    event_type = event["event_type"]
    if event_type in {"workflow_started", "workflow_completed"}:
        return ("workflow", event_type, event.get("workflow_id"))
    if event_type in {"lease_started", "lease_completed"}:
        return (
            "lease",
            event_type,
            event.get("lease_id"),
        )
    if event_type in {"red_accepted", "red_rejected"}:
        return (
            "red_decision",
            event.get("workflow_id"),
            event.get("cycle_id"),
            event.get("attempt"),
        )
    if event_type == "correction_requested":
        return (
            "correction",
            event.get("lease_id"),
        )
    if event_type == "regression_confirmed":
        return (
            "regression",
            event.get("workflow_id"),
            event.get("check_id"),
        )
    if event_type == "token_usage_reported":
        return ("token_usage", event.get("workflow_id"), event.get("agent_id"))
    if event_type in {"agent_started", "agent_stopped"}:
        return (
            "agent_lifecycle",
            event_type,
            event.get("session_id"),
            event.get("agent_id"),
        )
    return ("event", event.get("event_id"))


def _group_conflicts(
    events: Sequence[dict[str, Any]],
    key_function: Any,
    payload_function: Any,
    label: str,
) -> tuple[list[dict[str, Any]], list[str], int]:
    groups: dict[tuple[Any, ...], list[dict[str, Any]]] = defaultdict(list)
    for event in events:
        key = key_function(event)
        if not isinstance(key, tuple):
            key = (key,)
        groups[key].append(event)

    retained: list[dict[str, Any]] = []
    errors: list[str] = []
    replay_count = 0
    for key, group in groups.items():
        payloads = {payload_function(event) for event in group}
        if len(payloads) > 1:
            event_ids = ", ".join(sorted(str(event["event_id"]) for event in group))
            errors.append(f"conflicting {label} {key!r}: {event_ids}")
            continue
        retained.append(min(group, key=_event_time))
        replay_count += len(group) - 1
    return retained, errors, replay_count


def _association_errors(
    events: Sequence[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[str]]:
    """Reject valid-looking events whose cross-event identities disagree."""

    quarantined_ids: set[str] = set()
    errors: list[str] = []
    semantic_events = [event for event in events if event["source"] == "coordinator"]

    workflow_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for event in semantic_events:
        workflow_groups[str(event["workflow_id"])].append(event)
    for workflow_id, group in workflow_groups.items():
        task_ids = {str(event["task_id"]) for event in group}
        if len(task_ids) > 1:
            errors.append(
                f"workflow {workflow_id!r} has conflicting task identities: "
                + ", ".join(sorted(task_ids))
            )
            quarantined_ids.update(str(event["event_id"]) for event in group)

    cycle_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for event in semantic_events:
        if event.get("cycle_id") is not None:
            cycle_groups[str(event["cycle_id"])].append(event)
    for cycle_id, group in cycle_groups.items():
        owners = {
            (str(event["workflow_id"]), str(event["task_id"])) for event in group
        }
        if len(owners) > 1:
            errors.append(f"cycle {cycle_id!r} has conflicting workflow/task ownership")
            quarantined_ids.update(str(event["event_id"]) for event in group)

    lease_event_types = {"lease_started", "lease_completed", "correction_requested"}
    lease_identity_fields = (
        "workflow_id",
        "task_id",
        "cycle_id",
        "lease_id",
        "phase",
        "attempt",
        "agent_id",
        "agent_type",
    )
    lease_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for event in semantic_events:
        if event["event_type"] in lease_event_types:
            lease_groups[str(event["lease_id"])].append(event)
    for lease_id, group in lease_groups.items():
        identities = {
            tuple(event[field] for field in lease_identity_fields) for event in group
        }
        if len(identities) > 1:
            errors.append(f"lease {lease_id!r} has conflicting assignment identities")
            quarantined_ids.update(str(event["event_id"]) for event in group)

    linked_groups: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for event in semantic_events:
        if event["event_type"] in {"lease_started", "lease_completed"}:
            key = (str(event["workflow_id"]), str(event["agent_id"]))
            linked_groups[key].append(event)
    for key, group in linked_groups.items():
        linked_identities = {
            (str(event["task_id"]), str(event["agent_type"])) for event in group
        }
        if len(linked_identities) > 1:
            errors.append(f"lease-linked agent {key!r} has conflicting task/role identity")
            quarantined_ids.update(str(event["event_id"]) for event in group)

    for event in semantic_events:
        if event["event_type"] != "token_usage_reported":
            continue
        key = (str(event["workflow_id"]), str(event["agent_id"]))
        linked = linked_groups.get(key, [])
        expected = {
            (str(linked_event["task_id"]), str(linked_event["agent_type"]))
            for linked_event in linked
        }
        actual = (str(event["task_id"]), str(event["agent_type"]))
        if expected and (len(expected) != 1 or actual not in expected):
            errors.append(f"token report for lease-linked agent {key!r} has wrong task/role")
            quarantined_ids.add(str(event["event_id"]))

    lifecycle_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for event in events:
        if event["event_type"] in {"agent_started", "agent_stopped"}:
            lifecycle_groups[str(event["agent_id"])].append(event)
    for agent_id, group in lifecycle_groups.items():
        identities = {
            (
                str(event["session_id"]),
                str(event["turn_id"]),
                str(event["agent_type"]),
            )
            for event in group
        }
        if len(identities) > 1:
            errors.append(f"agent {agent_id!r} has conflicting lifecycle identity")
            quarantined_ids.update(str(event["event_id"]) for event in group)

    retained = [
        event for event in events if str(event["event_id"]) not in quarantined_ids
    ]
    return retained, errors


def _transition_errors(
    events: Sequence[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[str]]:
    specifications = (
        (
            "workflow",
            "workflow_id",
            "workflow_started",
            "workflow_completed",
            ("workflow_id", "task_id"),
        ),
        (
            "lease",
            "lease_id",
            "lease_started",
            "lease_completed",
            (
                "workflow_id",
                "task_id",
                "cycle_id",
                "lease_id",
                "phase",
                "attempt",
                "agent_id",
                "agent_type",
            ),
        ),
    )
    quarantined_ids: set[str] = set()
    errors: list[str] = []

    for label, key_field, start_type, stop_type, identity_fields in specifications:
        grouped: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
        for event in events:
            key = event.get(key_field)
            if isinstance(key, str) and event["event_type"] in {start_type, stop_type}:
                grouped[key][str(event["event_type"])] = event
        for key, pair in grouped.items():
            start = pair.get(start_type)
            stop = pair.get(stop_type)
            if start is None or stop is None:
                continue
            mismatches = [
                field
                for field in identity_fields
                if start.get(field) is not None
                and stop.get(field) is not None
                and start.get(field) != stop.get(field)
            ]
            if mismatches:
                errors.append(
                    f"{label} {key!r} start/completion identity mismatch: "
                    + ", ".join(mismatches)
                )
                quarantined_ids.update((str(start["event_id"]), str(stop["event_id"])))
                continue
            if _event_time(stop) < _event_time(start):
                errors.append(f"{label} {key!r} completes before it starts")
                quarantined_ids.update((str(start["event_id"]), str(stop["event_id"])))

    lifecycle_groups: dict[tuple[str, str], dict[str, dict[str, Any]]] = defaultdict(dict)
    for event in events:
        if event["event_type"] not in {"agent_started", "agent_stopped"}:
            continue
        key = (str(event["session_id"]), str(event["agent_id"]))
        lifecycle_groups[key][str(event["event_type"])] = event
    for key, pair in lifecycle_groups.items():
        start = pair.get("agent_started")
        stop = pair.get("agent_stopped")
        if start is None or stop is None:
            continue
        mismatches = [
            field
            for field in ("session_id", "turn_id", "agent_id", "agent_type")
            if start.get(field) != stop.get(field)
        ]
        if mismatches:
            errors.append(
                f"agent lifecycle {key!r} identity mismatch: " + ", ".join(mismatches)
            )
            quarantined_ids.update((str(start["event_id"]), str(stop["event_id"])))
            continue
        if _event_time(stop) < _event_time(start):
            errors.append(f"agent lifecycle {key!r} stops before it starts")
            quarantined_ids.update((str(start["event_id"]), str(stop["event_id"])))

    retained = [
        event for event in events if str(event["event_id"]) not in quarantined_ids
    ]
    return retained, errors


def _normalize_event_set(
    events: Sequence[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[str], int]:
    by_event_id, id_errors, id_replays = _group_conflicts(
        events,
        lambda event: (event["event_id"],),
        _event_id_payload,
        "event_id",
    )
    by_logical_key, logical_errors, logical_replays = _group_conflicts(
        by_event_id,
        _logical_key,
        _canonical_payload,
        "logical event",
    )
    associated, association_errors = _association_errors(by_logical_key)
    transitioned, transition_errors = _transition_errors(associated)
    return (
        sorted(transitioned, key=_event_time),
        [*id_errors, *logical_errors, *association_errors, *transition_errors],
        id_replays + logical_replays,
    )


def _event_time(event: Mapping[str, Any]) -> datetime:
    return _parse_timestamp(str(event["recorded_at"]))


def _pair_events(
    events: Iterable[Mapping[str, Any]],
    key_field: str,
    start_type: str,
    stop_type: str,
) -> dict[str, Any]:
    grouped: dict[str, list[Mapping[str, Any]]] = defaultdict(list)
    for event in events:
        key = event.get(key_field)
        if isinstance(key, str) and event.get("event_type") in {start_type, stop_type}:
            grouped[key].append(event)

    items: list[dict[str, Any]] = []
    unmatched_started = 0
    unmatched_completed = 0
    started_count = 0
    completed_count = 0
    for key in sorted(grouped):
        keyed = grouped[key]
        starts = [event for event in keyed if event["event_type"] == start_type]
        stops = [event for event in keyed if event["event_type"] == stop_type]
        started_count += len(starts)
        completed_count += len(stops)
        key_pairs = list(zip(starts, stops))
        key_unmatched_started = max(0, len(starts) - len(stops))
        key_unmatched_completed = max(0, len(stops) - len(starts))
        unmatched_started += key_unmatched_started
        unmatched_completed += key_unmatched_completed

        durations = [
            round((_event_time(stop) - _event_time(start)).total_seconds() * 1000)
            for start, stop in key_pairs
        ]
        if any(duration < 0 for duration in durations):
            raise ValueError(f"Unvalidated negative duration for {key_field}={key!r}")
        exemplar = key_pairs[0][0] if key_pairs else keyed[0]
        item: dict[str, Any] = {
            key_field: key,
            "pair_count": len(key_pairs),
            "duration_ms": sum(durations) if durations else None,
            "complete": key_unmatched_started == 0 and key_unmatched_completed == 0,
            "unmatched_started": key_unmatched_started,
            "unmatched_completed": key_unmatched_completed,
        }
        for field in ("agent_id", "agent_type", "phase"):
            if field != key_field and exemplar.get(field) is not None:
                item[field] = exemplar[field]
        items.append(item)

    pair_count = sum(item["pair_count"] for item in items)
    durations = [item["duration_ms"] for item in items if item["duration_ms"] is not None]
    return {
        "started_count": started_count,
        "completed_count": completed_count,
        "pair_count": pair_count,
        "unmatched_started": unmatched_started,
        "unmatched_completed": unmatched_completed,
        "complete": bool(items) and unmatched_started == 0 and unmatched_completed == 0,
        "total_duration_ms": sum(durations) if durations else None,
        "items": items,
    }


def _roll_up_pairs(
    pair_section: Mapping[str, Any], group_field: str
) -> dict[str, dict[str, Any]]:
    rollup: dict[str, dict[str, Any]] = {}
    for item in pair_section["items"]:
        group = item.get(group_field)
        if not isinstance(group, str):
            continue
        bucket = rollup.setdefault(
            group,
            {
                "pair_count": 0,
                "duration_ms": 0,
                "duration_known": False,
                "incomplete_key_count": 0,
            },
        )
        bucket["pair_count"] += item["pair_count"]
        if item["duration_ms"] is not None:
            bucket["duration_ms"] += item["duration_ms"]
            bucket["duration_known"] = True
        if not item["complete"]:
            bucket["incomplete_key_count"] += 1
    for bucket in rollup.values():
        if not bucket.pop("duration_known"):
            bucket["duration_ms"] = None
    return dict(sorted(rollup.items()))


def _summary(
    events: Sequence[dict[str, Any]],
    load_errors: Sequence[str],
    replay_count: int,
    workflow_id: str | None,
) -> dict[str, Any]:
    semantic_events = [
        event
        for event in events
        if event["source"] == "coordinator"
        and (workflow_id is None or event.get("workflow_id") == workflow_id)
    ]
    linked_agent_ids = {
        str(event["agent_id"])
        for event in semantic_events
        if event["event_type"] in {"lease_started", "lease_completed"}
        and event.get("agent_id") is not None
    }
    if workflow_id is None:
        hook_events = [event for event in events if event["source"] == "codex_hook"]
    else:
        hook_events = [
            event
            for event in events
            if event["source"] == "codex_hook" and event.get("agent_id") in linked_agent_ids
        ]
    selected_events = [*semantic_events, *hook_events]

    correction_count = sum(
        event["event_type"] == "correction_requested" for event in semantic_events
    )
    accepted_reds = sum(event["event_type"] == "red_accepted" for event in semantic_events)
    rejected_red_events = [
        event for event in semantic_events if event["event_type"] == "red_rejected"
    ]
    rejected_reds = len(rejected_red_events)
    decided_reds = accepted_reds + rejected_reds
    reason_counts = Counter(
        str(event["reason_code"]) for event in rejected_red_events if event.get("reason_code")
    )
    regressions = sum(
        event["event_type"] == "regression_confirmed" for event in semantic_events
    )

    token_events = [
        event for event in semantic_events if event["event_type"] == "token_usage_reported"
    ]
    token_fields: dict[str, dict[str, Any]] = {}
    for field in TOKEN_FIELDS:
        values = [
            event["token_usage"][field]
            for event in token_events
            if event["token_usage"].get(field) is not None
        ]
        token_fields[field] = {
            "total": sum(values) if values else None,
            "reported_values": len(values),
            "missing_reports": len(token_events) - len(values),
        }
    reported_agent_ids = {
        str(event["agent_id"]) for event in token_events if event.get("agent_id") is not None
    }
    missing_linked_agent_ids = sorted(linked_agent_ids - reported_agent_ids)
    unlinked_reported_agent_ids = sorted(reported_agent_ids - linked_agent_ids)

    tokens_by_agent: dict[str, dict[str, Any]] = {}
    for event in token_events:
        agent_id = str(event.get("agent_id") or "unattributed")
        bucket = tokens_by_agent.setdefault(
            agent_id,
            {
                "agent_type": event.get("agent_type"),
                "report_count": 0,
                "fields": {field: None for field in TOKEN_FIELDS},
            },
        )
        bucket["report_count"] += 1
        if bucket["agent_type"] is None and event.get("agent_type") is not None:
            bucket["agent_type"] = event["agent_type"]
        for field in TOKEN_FIELDS:
            value = event["token_usage"].get(field)
            if value is not None:
                current = bucket["fields"][field]
                bucket["fields"][field] = value if current is None else current + value

    workflow_pairs = _pair_events(
        semantic_events, "workflow_id", "workflow_started", "workflow_completed"
    )
    lease_pairs = _pair_events(
        semantic_events, "lease_id", "lease_started", "lease_completed"
    )
    agent_pairs = _pair_events(hook_events, "agent_id", "agent_started", "agent_stopped")

    return {
        "schema_version": SCHEMA_VERSION,
        "workflow_id": workflow_id,
        "event_count": len(selected_events),
        "semantic_event_count": len(semantic_events),
        "linked_hook_event_count": len(hook_events),
        "dataset_replayed_event_count": replay_count,
        "dataset_error_count": len(load_errors),
        "dataset_errors": list(load_errors),
        "corrections": {"count": correction_count},
        "false_reds": {
            "accepted_count": accepted_reds,
            "rejected_count": rejected_reds,
            "decided_count": decided_reds,
            "rate": rejected_reds / decided_reds if decided_reds else None,
            "reasons": dict(sorted(reason_counts.items())),
        },
        "confirmed_regressions": {"count": regressions},
        "elapsed": {
            "workflows": workflow_pairs,
            "leases": lease_pairs,
            "agents": agent_pairs,
            "by_phase": _roll_up_pairs(lease_pairs, "phase"),
            "by_agent_type": _roll_up_pairs(agent_pairs, "agent_type"),
        },
        "token_usage": {
            "exact_only": True,
            "report_count": len(token_events),
            "fields": token_fields,
            "linked_agent_count": len(linked_agent_ids),
            "linked_reported_agent_count": len(linked_agent_ids & reported_agent_ids),
            "missing_linked_agent_count": len(missing_linked_agent_ids),
            "missing_linked_agent_ids": missing_linked_agent_ids,
            "unlinked_reported_agent_count": len(unlinked_reported_agent_ids),
            "unlinked_reported_agent_ids": unlinked_reported_agent_ids,
            "by_agent": dict(sorted(tokens_by_agent.items())),
        },
    }


def _format_duration(value: int | None) -> str:
    if value is None:
        return "unknown"
    if value < 1000:
        return f"{value} ms"
    return f"{value / 1000:.3f} s"


def _pairing_status(section: Mapping[str, Any]) -> str:
    return (
        f"{section['pair_count']} paired; "
        f"{section['unmatched_started']} open starts; "
        f"{section['unmatched_completed']} orphan completions"
    )


def _format_markdown(summary: Mapping[str, Any]) -> str:
    workflow = summary["workflow_id"] or "all workflows"
    false_reds = summary["false_reds"]
    rate = false_reds["rate"]
    rate_text = "unknown" if rate is None else f"{rate:.2%}"
    elapsed = summary["elapsed"]
    tokens = summary["token_usage"]
    lines = [
        "# Agent-flow metrics summary",
        "",
        f"- Workflow: `{workflow}`",
        f"- Valid selected events: {summary['event_count']}",
        f"- Dataset-wide exact logical replays counted once: {summary['dataset_replayed_event_count']}",
        f"- Dataset errors excluded: {summary['dataset_error_count']}",
        "",
        "## Quality signals",
        "",
        "| Metric | Value |",
        "|---|---:|",
        f"| Corrections requested | {summary['corrections']['count']} |",
        f"| False Reds | {false_reds['rejected_count']} |",
        f"| Accepted Reds | {false_reds['accepted_count']} |",
        f"| False Red rate | {rate_text} |",
        f"| Confirmed regressions | {summary['confirmed_regressions']['count']} |",
        "",
        "False Red reasons: "
        + (
            ", ".join(f"`{key}`={value}" for key, value in false_reds["reasons"].items())
            if false_reds["reasons"]
            else "none reported"
        )
        + ".",
        "",
        "## Elapsed time",
        "",
        "| Scope | Total | Completeness |",
        "|---|---:|---|",
        f"| Workflow | {_format_duration(elapsed['workflows']['total_duration_ms'])} | {_pairing_status(elapsed['workflows'])} |",
        f"| Write leases | {_format_duration(elapsed['leases']['total_duration_ms'])} | {_pairing_status(elapsed['leases'])} |",
        f"| Linked agents | {_format_duration(elapsed['agents']['total_duration_ms'])} | {_pairing_status(elapsed['agents'])} |",
        "",
        "## Exact token usage",
        "",
        "Token values are never estimated. `unknown` means the runtime did not report an exact counter.",
        "",
        "| Counter | Exact total | Reports with value | Missing report values |",
        "|---|---:|---:|---:|",
    ]
    for field in TOKEN_FIELDS:
        data = tokens["fields"][field]
        total = "unknown" if data["total"] is None else str(data["total"])
        lines.append(
            f"| `{field}` | {total} | {data['reported_values']} | {data['missing_reports']} |"
        )
    lines.extend(
        [
            "",
            f"Linked-agent token coverage: {tokens['linked_reported_agent_count']}/{tokens['linked_agent_count']}; "
            f"{tokens['missing_linked_agent_count']} missing; "
            f"{tokens['unlinked_reported_agent_count']} identified unlinked reports.",
        ]
    )
    if elapsed["by_phase"]:
        lines.extend(
            [
                "",
                "### Lease time by phase",
                "",
                "| Phase | Paired leases | Total | Incomplete lease IDs |",
                "|---|---:|---:|---:|",
            ]
        )
        for phase, data in elapsed["by_phase"].items():
            lines.append(
                f"| `{phase}` | {data['pair_count']} | "
                f"{_format_duration(data['duration_ms'])} | "
                f"{data['incomplete_key_count']} |"
            )
    if elapsed["by_agent_type"]:
        lines.extend(
            [
                "",
                "### Lifecycle time by agent type",
                "",
                "| Agent type | Paired agents | Total | Incomplete agent IDs |",
                "|---|---:|---:|---:|",
            ]
        )
        for agent_type, data in elapsed["by_agent_type"].items():
            lines.append(
                f"| `{agent_type}` | {data['pair_count']} | "
                f"{_format_duration(data['duration_ms'])} | "
                f"{data['incomplete_key_count']} |"
            )
    if tokens["missing_linked_agent_ids"]:
        lines.append(
            "Missing linked agent IDs: "
            + ", ".join(f"`{value}`" for value in tokens["missing_linked_agent_ids"])
            + "."
        )
    if tokens["unlinked_reported_agent_ids"]:
        lines.append(
            "Identified unlinked report IDs: "
            + ", ".join(
                f"`{value}`" for value in tokens["unlinked_reported_agent_ids"]
            )
            + "."
        )
    if tokens["by_agent"]:
        lines.extend(
            [
                "",
                "### Exact tokens by agent",
                "",
                "| Agent | Type | Reports | Input | Cached input | Output | Reasoning |",
                "|---|---|---:|---:|---:|---:|---:|",
            ]
        )
        for agent_id, data in tokens["by_agent"].items():
            values = [
                "unknown" if data["fields"][field] is None else str(data["fields"][field])
                for field in TOKEN_FIELDS
            ]
            lines.append(
                f"| `{agent_id}` | `{data['agent_type'] or 'unknown'}` | "
                f"{data['report_count']} | " + " | ".join(values) + " |"
            )
    if summary["dataset_errors"]:
        lines.extend(
            [
                "",
                "## Dataset errors",
                "",
                *[f"- {error}" for error in summary["dataset_errors"]],
            ]
        )
    return "\n".join(lines) + "\n"


def _controlled_event(
    source: str,
    event_type: str,
    recorded_at: datetime,
    **fields: Any,
) -> dict[str, Any]:
    event = _base_event(
        source,
        event_type,
        recorded_at.isoformat(timespec="milliseconds").replace("+00:00", "Z"),
    )
    event.update({key: value for key, value in fields.items() if value is not None})
    return event


def _run_self_test() -> tuple[bool, dict[str, Any]]:
    checks: list[str] = []
    try:
        with tempfile.TemporaryDirectory(prefix="agent-flow-metrics-") as temporary:
            root = Path(temporary)
            hook_dir = root / "hook"
            hook_input = {
                "hook_event_name": "SubagentStart",
                "session_id": "session-1",
                "turn_id": "turn-1",
                "agent_id": "agent-a",
                "agent_type": "test_worker",
                "model": "gpt-5.6-sol",
                "permission_mode": "workspace-write",
                "cwd": "SECRET_CWD",
                "transcript_path": "SECRET_TRANSCRIPT",
                "last_assistant_message": "SECRET_MESSAGE",
                "prompt": "SECRET_PROMPT",
            }
            hook_output = io.StringIO()
            assert _run_hook(io.StringIO(json.dumps(hook_input)), hook_output, hook_dir) == 0
            assert hook_output.getvalue() == "{}\n"
            hook_files = list(hook_dir.glob("*.json"))
            assert len(hook_files) == 1
            persisted_text = hook_files[0].read_text(encoding="utf-8")
            for secret in ("SECRET_CWD", "SECRET_TRANSCRIPT", "SECRET_MESSAGE", "SECRET_PROMPT"):
                assert secret not in persisted_text
            persisted_hook = json.loads(persisted_text)
            assert set(persisted_hook) <= EVENT_FIELDS
            checks.append("hook sanitizer and continuation output")

            failed_hook_dir = root / "failed-hook"
            failed_output = io.StringIO()
            assert _run_hook(io.StringIO("not-json"), failed_output, failed_hook_dir) == 0
            assert failed_output.getvalue() == "{}\n"
            failed_events = [json.loads(path.read_text(encoding="utf-8")) for path in failed_hook_dir.glob("*.json")]
            assert len(failed_events) == 1
            assert failed_events[0]["event_type"] == "hook_capture_failed"
            checks.append("malformed hook input remains non-blocking")

            blocked_destination = root / "not-a-directory"
            blocked_destination.write_text("occupied", encoding="utf-8")
            blocked_output = io.StringIO()
            assert _run_hook(
                io.StringIO(json.dumps(hook_input)), blocked_output, blocked_destination
            ) == 0
            assert blocked_output.getvalue() == "{}\n"
            checks.append("storage failure remains non-blocking")

            try:
                _nonnegative_integer("-1")
                raise AssertionError("negative token counter was accepted")
            except argparse.ArgumentTypeError:
                pass
            assert _nonnegative_integer("0") == 0
            checks.append("exact token counters reject negative values")

            event_dir = root / "out-of-order"
            start = datetime(2026, 8, 11, 12, 0, tzinfo=timezone.utc)
            controlled = [
                _controlled_event("coordinator", "workflow_completed", start + timedelta(seconds=20), workflow_id="wf-test"),
                _controlled_event("coordinator", "lease_completed", start + timedelta(seconds=7), workflow_id="wf-test", cycle_id="cycle-0", lease_id="lease-a", phase="red", attempt=1, agent_id="agent-a", agent_type="test_worker"),
                _controlled_event("codex_hook", "agent_stopped", start + timedelta(seconds=6), session_id="session-1", turn_id="turn-1", agent_id="agent-a", agent_type="test_worker"),
                _controlled_event("coordinator", "workflow_started", start, workflow_id="wf-test", task_id="TASK-TEST"),
                _controlled_event("coordinator", "lease_started", start + timedelta(seconds=2), workflow_id="wf-test", cycle_id="cycle-0", lease_id="lease-a", phase="red", attempt=1, agent_id="agent-a", agent_type="test_worker"),
                _controlled_event("codex_hook", "agent_started", start + timedelta(seconds=1), session_id="session-1", turn_id="turn-1", agent_id="agent-a", agent_type="test_worker"),
                _controlled_event("coordinator", "lease_completed", start + timedelta(seconds=12), workflow_id="wf-test", cycle_id="cycle-1", lease_id="lease-b", phase="green", attempt=1, agent_id="agent-b", agent_type="code_worker"),
                _controlled_event("coordinator", "lease_started", start + timedelta(seconds=8), workflow_id="wf-test", cycle_id="cycle-1", lease_id="lease-b", phase="green", attempt=1, agent_id="agent-b", agent_type="code_worker"),
                _controlled_event("codex_hook", "agent_started", start + timedelta(seconds=8), session_id="session-1", turn_id="turn-2", agent_id="agent-b", agent_type="code_worker"),
                _controlled_event("coordinator", "red_accepted", start + timedelta(seconds=7), workflow_id="wf-test", cycle_id="cycle-1", attempt=1),
                _controlled_event("coordinator", "red_rejected", start + timedelta(seconds=4), workflow_id="wf-test", cycle_id="cycle-0", attempt=1, reason_code="wrong_failure"),
                _controlled_event("coordinator", "correction_requested", start + timedelta(seconds=5), workflow_id="wf-test", cycle_id="cycle-0", lease_id="lease-correction-a", phase="red", attempt=2, agent_id="agent-a", agent_type="test_worker", reason_code="wrong_failure"),
                _controlled_event("coordinator", "correction_requested", start + timedelta(seconds=13), workflow_id="wf-test", cycle_id="cycle-1", lease_id="lease-correction-b", phase="green", attempt=2, agent_id="agent-b", agent_type="code_worker", reason_code="review_finding"),
                _controlled_event("coordinator", "regression_confirmed", start + timedelta(seconds=15), workflow_id="wf-test", cycle_id="cycle-1", check_id="check-build", reason_code="current_change"),
                _controlled_event("coordinator", "token_usage_reported", start + timedelta(seconds=7), workflow_id="wf-test", agent_id="agent-a", agent_type="test_worker", token_usage={"input_tokens": 100, "cached_input_tokens": None, "output_tokens": 20, "reasoning_tokens": None}),
                _controlled_event("coordinator", "token_usage_reported", start + timedelta(seconds=18), workflow_id="wf-test", agent_id="primary", agent_type="primary", token_usage={"input_tokens": 50, "cached_input_tokens": None, "output_tokens": 10, "reasoning_tokens": None}),
            ]
            for event in controlled:
                if event["source"] == "coordinator":
                    event.setdefault("task_id", "TASK-TEST")
                _write_event(event, event_dir)
            loaded, errors, replay_count = _load_event_files(event_dir)
            assert not errors
            assert replay_count == 0
            result = _summary(loaded, errors, replay_count, "wf-test")
            assert result["corrections"]["count"] == 2
            assert result["false_reds"]["rejected_count"] == 1
            assert result["false_reds"]["reasons"] == {"wrong_failure": 1}
            assert result["false_reds"]["rate"] == 0.5
            assert result["confirmed_regressions"]["count"] == 1
            assert result["elapsed"]["workflows"]["total_duration_ms"] == 20_000
            assert result["elapsed"]["leases"]["pair_count"] == 2
            assert result["elapsed"]["agents"]["pair_count"] == 1
            assert result["elapsed"]["agents"]["unmatched_started"] == 1
            assert result["elapsed"]["by_phase"]["red"]["duration_ms"] == 5_000
            assert result["elapsed"]["by_agent_type"]["test_worker"]["duration_ms"] == 5_000
            assert result["token_usage"]["fields"]["input_tokens"]["total"] == 150
            assert result["token_usage"]["fields"]["cached_input_tokens"]["total"] is None
            assert result["token_usage"]["missing_linked_agent_count"] == 1
            assert result["token_usage"]["missing_linked_agent_ids"] == ["agent-b"]
            assert result["token_usage"]["unlinked_reported_agent_count"] == 1
            assert result["token_usage"]["unlinked_reported_agent_ids"] == ["primary"]
            assert result["token_usage"]["by_agent"]["agent-a"]["fields"]["input_tokens"] == 100
            checks.append("out-of-order pairing, quality counts, and incomplete exact tokens")

            replay_dir = root / "replay"
            correction = _controlled_event(
                "coordinator",
                "correction_requested",
                start,
                workflow_id="wf-replay",
                task_id="TASK-TEST",
                cycle_id="cycle-1",
                lease_id="lease-correction-2",
                phase="red",
                attempt=2,
                agent_id="agent-a",
                agent_type="test_worker",
                reason_code="wrong_failure",
            )
            replay = dict(correction)
            replay["event_id"] = str(uuid.uuid4())
            replay["recorded_at"] = (start + timedelta(seconds=1)).isoformat().replace(
                "+00:00", "Z"
            )
            _write_event(correction, replay_dir)
            _write_event(replay, replay_dir)
            replayed, replay_errors, replay_total = _load_event_files(replay_dir)
            assert not replay_errors
            assert replay_total == 1
            replay_summary = _summary(replayed, replay_errors, replay_total, "wf-replay")
            assert replay_summary["corrections"]["count"] == 1
            assert replay_summary["dataset_replayed_event_count"] == 1

            contradictory_red_dir = root / "contradictory-red"
            for event_type in ("red_accepted", "red_rejected"):
                fields: dict[str, Any] = {
                    "workflow_id": "wf-red-conflict",
                    "task_id": "TASK-TEST",
                    "cycle_id": "cycle-1",
                    "attempt": 1,
                }
                if event_type == "red_rejected":
                    fields["reason_code"] = "wrong_failure"
                _write_event(
                    _controlled_event("coordinator", event_type, start, **fields),
                    contradictory_red_dir,
                )
            conflict_events, conflict_errors, conflict_replays = _load_event_files(
                contradictory_red_dir
            )
            assert conflict_errors
            assert conflict_replays == 0
            conflict_summary = _summary(
                conflict_events,
                conflict_errors,
                conflict_replays,
                "wf-red-conflict",
            )
            assert conflict_summary["false_reds"]["decided_count"] == 0

            duplicate_id_dir = root / "duplicate-id"
            duplicate_id_a = _controlled_event(
                "coordinator",
                "workflow_started",
                start,
                workflow_id="wf-duplicate-a",
                task_id="TASK-TEST",
            )
            duplicate_id_b = dict(duplicate_id_a)
            duplicate_id_b["recorded_at"] = (start + timedelta(seconds=1)).isoformat().replace(
                "+00:00", "Z"
            )
            duplicate_id_b["workflow_id"] = "wf-duplicate-b"
            _write_event(duplicate_id_a, duplicate_id_dir)
            _write_event(duplicate_id_b, duplicate_id_dir)
            duplicate_id_events, duplicate_id_errors, _ = _load_event_files(
                duplicate_id_dir
            )
            assert duplicate_id_errors
            assert not duplicate_id_events

            clock_dir = root / "clock-inversion"
            _write_event(
                _controlled_event(
                    "coordinator",
                    "workflow_started",
                    start + timedelta(seconds=10),
                    workflow_id="wf-clock",
                    task_id="TASK-TEST",
                ),
                clock_dir,
            )
            _write_event(
                _controlled_event(
                    "coordinator",
                    "workflow_completed",
                    start + timedelta(seconds=5),
                    workflow_id="wf-clock",
                    task_id="TASK-TEST",
                ),
                clock_dir,
            )
            clock_events, clock_errors, _ = _load_event_files(clock_dir)
            assert any("completes before" in error for error in clock_errors)
            assert not clock_events

            mismatch_dir = root / "identity-mismatch"
            for event_type, agent_id in (
                ("lease_started", "agent-a"),
                ("lease_completed", "agent-b"),
            ):
                _write_event(
                    _controlled_event(
                        "coordinator",
                        event_type,
                        start + timedelta(seconds=event_type == "lease_completed"),
                        workflow_id="wf-mismatch",
                        task_id="TASK-TEST",
                        cycle_id="cycle-1",
                        lease_id="lease-1",
                        phase="green",
                        attempt=1,
                        agent_id=agent_id,
                        agent_type="code_worker",
                    ),
                    mismatch_dir,
                )
            mismatch_events, mismatch_errors, _ = _load_event_files(mismatch_dir)
            assert any("conflicting assignment identities" in error for error in mismatch_errors)
            assert not mismatch_events

            orphan_dir = root / "orphan"
            _write_event(
                _controlled_event(
                    "codex_hook",
                    "agent_started",
                    start,
                    session_id="session-orphan",
                    turn_id="turn-orphan",
                    agent_id="agent-orphan",
                    agent_type="test_worker",
                ),
                orphan_dir,
            )
            orphan_events, orphan_errors, orphan_replays = _load_event_files(orphan_dir)
            assert not orphan_errors
            orphan_pairs = _pair_events(
                orphan_events, "agent_id", "agent_started", "agent_stopped"
            )
            assert orphan_replays == 0
            assert orphan_pairs["unmatched_started"] == 1

            invalid_correction = _controlled_event(
                "coordinator",
                "correction_requested",
                start,
                workflow_id="wf-invalid",
                task_id="TASK-TEST",
                cycle_id="cycle-1",
                lease_id="lease-invalid",
                phase="red",
                attempt=3,
                agent_id="agent-a",
                agent_type="test_worker",
                reason_code="wrong_failure",
            )
            assert any(
                "attempt 2" in error for error in _validate_event(invalid_correction)
            )
            invalid_regression = _controlled_event(
                "coordinator",
                "regression_confirmed",
                start,
                workflow_id="wf-invalid",
                task_id="TASK-TEST",
                cycle_id="cycle-1",
                reason_code="current_change",
            )
            assert any(
                "check_id" in error for error in _validate_event(invalid_regression)
            )

            token_conflict_dir = root / "token-conflict"
            for input_tokens in (100, 101):
                _write_event(
                    _controlled_event(
                        "coordinator",
                        "token_usage_reported",
                        start + timedelta(milliseconds=input_tokens),
                        workflow_id="wf-token-conflict",
                        task_id="TASK-TEST",
                        agent_id="agent-token",
                        agent_type="code_worker",
                        token_usage={
                            "input_tokens": input_tokens,
                            "cached_input_tokens": None,
                            "output_tokens": 10,
                            "reasoning_tokens": None,
                        },
                    ),
                    token_conflict_dir,
                )
            token_events, token_errors, _ = _load_event_files(token_conflict_dir)
            assert token_errors
            assert not token_events
            checks.append(
                "replay idempotency, conflicts, transitions, orphans, and semantic identities"
            )

            workflow_task_dir = root / "workflow-task-conflict"
            for task_id, event_type in (
                ("TASK-003", "workflow_started"),
                ("TASK-004", "red_accepted"),
            ):
                fields = {"workflow_id": "wf-association", "task_id": task_id}
                if event_type == "red_accepted":
                    fields.update({"cycle_id": "cycle-association", "attempt": 1})
                _write_event(
                    _controlled_event("coordinator", event_type, start, **fields),
                    workflow_task_dir,
                )
            workflow_task_events, workflow_task_errors, _ = _load_event_files(
                workflow_task_dir
            )
            assert any("conflicting task identities" in error for error in workflow_task_errors)
            assert not workflow_task_events

            correction_lease_dir = root / "correction-lease-conflict"
            correction_lease_events = [
                _controlled_event(
                    "coordinator",
                    "correction_requested",
                    start,
                    workflow_id="wf-correction",
                    task_id="TASK-003",
                    cycle_id="cycle-a",
                    lease_id="lease-x",
                    phase="red",
                    attempt=2,
                    agent_id="agent-a",
                    agent_type="test_worker",
                    reason_code="wrong_failure",
                ),
                _controlled_event(
                    "coordinator",
                    "lease_started",
                    start + timedelta(seconds=1),
                    workflow_id="wf-correction",
                    task_id="TASK-003",
                    cycle_id="cycle-b",
                    lease_id="lease-x",
                    phase="green",
                    attempt=1,
                    agent_id="agent-b",
                    agent_type="code_worker",
                ),
                _controlled_event(
                    "coordinator",
                    "lease_completed",
                    start + timedelta(seconds=2),
                    workflow_id="wf-correction",
                    task_id="TASK-003",
                    cycle_id="cycle-b",
                    lease_id="lease-x",
                    phase="green",
                    attempt=1,
                    agent_id="agent-b",
                    agent_type="code_worker",
                ),
            ]
            for event in correction_lease_events:
                _write_event(event, correction_lease_dir)
            corrected_events, corrected_errors, _ = _load_event_files(correction_lease_dir)
            assert any("conflicting assignment identities" in error for error in corrected_errors)
            assert not corrected_events

            linked_token_dir = root / "linked-token-conflict"
            linked_token_events = [
                _controlled_event(
                    "coordinator",
                    "workflow_started",
                    start,
                    workflow_id="wf-token-role",
                    task_id="TASK-003",
                ),
                _controlled_event(
                    "coordinator",
                    "lease_started",
                    start + timedelta(seconds=1),
                    workflow_id="wf-token-role",
                    task_id="TASK-003",
                    cycle_id="cycle-token",
                    lease_id="lease-token",
                    phase="green",
                    attempt=1,
                    agent_id="agent-token-linked",
                    agent_type="code_worker",
                ),
                _controlled_event(
                    "coordinator",
                    "lease_completed",
                    start + timedelta(seconds=2),
                    workflow_id="wf-token-role",
                    task_id="TASK-003",
                    cycle_id="cycle-token",
                    lease_id="lease-token",
                    phase="green",
                    attempt=1,
                    agent_id="agent-token-linked",
                    agent_type="code_worker",
                ),
                _controlled_event(
                    "coordinator",
                    "token_usage_reported",
                    start + timedelta(seconds=2),
                    workflow_id="wf-token-role",
                    task_id="TASK-003",
                    agent_id="agent-token-linked",
                    agent_type="primary",
                    token_usage={
                        "input_tokens": 20,
                        "cached_input_tokens": None,
                        "output_tokens": 5,
                        "reasoning_tokens": None,
                    },
                ),
            ]
            for event in linked_token_events:
                _write_event(event, linked_token_dir)
            linked_events, linked_errors, linked_replays = _load_event_files(
                linked_token_dir
            )
            assert any("wrong task/role" in error for error in linked_errors)
            linked_summary = _summary(
                linked_events, linked_errors, linked_replays, "wf-token-role"
            )
            assert linked_summary["token_usage"]["report_count"] == 0
            assert linked_summary["token_usage"]["missing_linked_agent_count"] == 1

            regression_identity_dir = root / "regression-identity-conflict"
            for cycle_id in ("cycle-1", "cycle-2"):
                _write_event(
                    _controlled_event(
                        "coordinator",
                        "regression_confirmed",
                        start,
                        workflow_id="wf-regression",
                        task_id="TASK-003",
                        cycle_id=cycle_id,
                        check_id="check-build",
                        reason_code="current_change",
                    ),
                    regression_identity_dir,
                )
            regression_events, regression_errors, regression_replays = _load_event_files(
                regression_identity_dir
            )
            assert regression_errors
            regression_summary = _summary(
                regression_events,
                regression_errors,
                regression_replays,
                "wf-regression",
            )
            assert regression_summary["confirmed_regressions"]["count"] == 0

            lifecycle_identity_dir = root / "lifecycle-identity-conflict"
            for event_type, turn_id in (
                ("agent_started", "turn-a"),
                ("agent_stopped", "turn-b"),
            ):
                _write_event(
                    _controlled_event(
                        "codex_hook",
                        event_type,
                        start,
                        session_id="session-lifecycle",
                        turn_id=turn_id,
                        agent_id="agent-lifecycle",
                        agent_type="test_worker",
                    ),
                    lifecycle_identity_dir,
                )
            lifecycle_events, lifecycle_errors, _ = _load_event_files(
                lifecycle_identity_dir
            )
            assert any("conflicting lifecycle identity" in error for error in lifecycle_errors)
            assert not lifecycle_events

            incomplete_lease = _controlled_event(
                "coordinator",
                "lease_started",
                start,
                workflow_id="wf-incomplete",
                task_id="TASK-003",
                lease_id="lease-incomplete",
                phase="red",
                agent_id="agent-incomplete",
                agent_type="test_worker",
            )
            incomplete_errors = _validate_event(incomplete_lease)
            assert any("requires cycle_id" in error for error in incomplete_errors)
            assert any("requires attempt" in error for error in incomplete_errors)
            checks.append(
                "cross-event workflow, lease, token, regression, and lifecycle identity"
            )

            concurrent_dir = root / "concurrent"
            concurrent_events = [
                _controlled_event(
                    "coordinator",
                    "workflow_started",
                    start + timedelta(milliseconds=index),
                    workflow_id=f"wf-{index}",
                    task_id="TASK-TEST",
                )
                for index in range(40)
            ]
            with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
                paths = list(
                    executor.map(lambda event: _write_event(event, concurrent_dir), concurrent_events)
                )
            assert len(paths) == 40
            assert len(list(concurrent_dir.glob("*.json"))) == 40
            assert not list(concurrent_dir.glob("*.tmp"))
            concurrent_loaded, concurrent_errors, concurrent_replays = _load_event_files(concurrent_dir)
            assert not concurrent_errors
            assert concurrent_replays == 0
            assert len(concurrent_loaded) == 40
            assert len({event["event_id"] for event in concurrent_loaded}) == 40
            checks.append("concurrent atomic event publication")

        return True, {"status": "ok", "checks": checks}
    except BaseException as error:
        return False, {
            "status": "failed",
            "checks": checks,
            "error_type": type(error).__name__,
        }


def _add_events_dir(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--events-dir",
        type=Path,
        default=_default_events_dir(),
        help="Event directory (default: repository logs/agent-flow-metrics/v1/events).",
    )


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Record, validate, and summarize local agent-flow metrics."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    record = subparsers.add_parser("record", help="Record one coordinator semantic event.")
    record.add_argument("--event", required=True, choices=SEMANTIC_EVENT_TYPES)
    record.add_argument("--workflow-id", type=_identifier)
    record.add_argument("--task-id", type=_identifier)
    record.add_argument("--cycle-id", type=_identifier)
    record.add_argument("--lease-id", type=_identifier)
    record.add_argument("--phase", type=_identifier)
    record.add_argument("--attempt", type=_positive_integer)
    record.add_argument("--agent-id", type=_identifier)
    record.add_argument("--agent-type", type=_identifier)
    record.add_argument("--reason-code", type=_identifier)
    record.add_argument("--check-id", type=_identifier)
    record.add_argument("--input-tokens", type=_nonnegative_integer)
    record.add_argument("--cached-input-tokens", type=_nonnegative_integer)
    record.add_argument("--output-tokens", type=_nonnegative_integer)
    record.add_argument("--reasoning-tokens", type=_nonnegative_integer)
    _add_events_dir(record)

    summary = subparsers.add_parser("summary", help="Summarize valid events.")
    summary.add_argument("--workflow-id", type=_identifier)
    summary.add_argument("--format", choices=("markdown", "json"), default="markdown")
    _add_events_dir(summary)

    validate = subparsers.add_parser("validate", help="Validate all event files.")
    _add_events_dir(validate)

    subparsers.add_parser("self-test", help="Run isolated built-in tests.")
    return parser


def _run_cli(arguments: argparse.Namespace) -> int:
    if arguments.command == "record":
        try:
            event = _record_event(arguments)
        except ValueError as error:
            print(json.dumps({"status": "invalid", "error": str(error)}), file=sys.stderr)
            return 2
        path = _write_event(event, arguments.events_dir)
        print(
            json.dumps(
                {"status": "recorded", "event_id": event["event_id"], "path": str(path)},
                sort_keys=True,
            )
        )
        return 0

    if arguments.command == "summary":
        events, errors, replay_count = _load_event_files(arguments.events_dir)
        result = _summary(events, errors, replay_count, arguments.workflow_id)
        if arguments.format == "json":
            print(json.dumps(result, indent=2, sort_keys=True))
        else:
            print(_format_markdown(result), end="")
        return 0

    if arguments.command == "validate":
        events, errors, replay_count = _load_event_files(arguments.events_dir)
        result = {
            "status": "valid" if not errors else "invalid",
            "valid_event_count": len(events),
            "replayed_event_count": replay_count,
            "error_count": len(errors),
            "errors": errors,
        }
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if not errors else 1

    if arguments.command == "self-test":
        passed, result = _run_self_test()
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if passed else 1

    raise AssertionError(f"Unhandled command: {arguments.command}")


def main(argv: Sequence[str] | None = None) -> int:
    effective = list(sys.argv[1:] if argv is None else argv)
    if effective == ["hook"]:
        return _run_hook(sys.stdin, sys.stdout)
    parser = _build_parser()
    return _run_cli(parser.parse_args(effective))


if __name__ == "__main__":
    raise SystemExit(main())
