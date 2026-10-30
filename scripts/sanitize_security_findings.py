#!/usr/bin/env python3

import argparse
import json
import os
import re
import sys
from pathlib import Path

MAX_FILE_SIZE = 20 * 1024 * 1024
MAX_FINDINGS = 300
MAX_FIELD_LENGTH = 200

ALLOWED_SEVERITIES = {
    "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO", "UNKNOWN"
}

SAFE_VALUE_PATTERN = re.compile(r"^[A-Za-z0-9_.:/@+-]+$")


def safe_value(value):
    """Accept bounded scalar metadata with a conservative character set."""
    if not isinstance(value, (str, int, float)):
        return None

    text = str(value).strip()[:MAX_FIELD_LENGTH]

    if not text or not SAFE_VALUE_PATTERN.fullmatch(text):
        return None

    return text


def read_json(path):
    path = Path(path)

    if not path.is_file():
        raise ValueError(f"Input file not found: {path}")

    if path.stat().st_size > MAX_FILE_SIZE:
        raise ValueError(f"Input exceeds size limit: {path}")

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def normalize_severity(value):
    if not isinstance(value, str):
        return "UNKNOWN"

    severity = value.upper().strip()

    return severity if severity in ALLOWED_SEVERITIES else "UNKNOWN"


def sanitize_trivy(data):
    findings = []

    if not isinstance(data, dict):
        raise ValueError("Trivy JSON must be an object")

    results = data.get("Results", [])

    if not isinstance(results, list):
        return findings

    for result in results:
        if not isinstance(result, dict):
            continue

        target = safe_value(result.get("Target")) or "not-provided"

        vulnerabilities = result.get("Vulnerabilities", [])

        if not isinstance(vulnerabilities, list):
            continue

        for item in vulnerabilities:
            if not isinstance(item, dict):
                continue

            finding = {
                "scanner": "Trivy",
                "rule_id": (
                    safe_value(item.get("VulnerabilityID"))
                    or "not-provided"
                ),
                "severity": normalize_severity(item.get("Severity")),
                "location": target,
            }

            optional_fields = {
                "package": item.get("PkgName"),
                "installed_version": item.get("InstalledVersion"),
                "fixed_version": item.get("FixedVersion"),
            }

            for key, value in optional_fields.items():
                clean = safe_value(value)
                if clean:
                    finding[key] = clean

            findings.append(finding)

            if len(findings) >= MAX_FINDINGS:
                return findings

    return findings


def sanitize_gitleaks(data):
    findings = []

    if not isinstance(data, list):
        raise ValueError("Gitleaks JSON must be an array")

    for item in data:
        if not isinstance(item, dict):
            continue

        rule_id = safe_value(item.get("RuleID")) or "not-provided"
        file_path = safe_value(item.get("File")) or "not-provided"

        line = item.get("StartLine")

        if isinstance(line, int) and not isinstance(line, bool) and line > 0:
            location = f"{file_path}:{line}"
        else:
            location = file_path

        findings.append({
            "scanner": "Gitleaks",
            "rule_id": rule_id,
            "severity": "NOT PROVIDED",
            "location": location,
        })

        if len(findings) >= MAX_FINDINGS:
            break

    return findings


def main():
    parser = argparse.ArgumentParser(
        description="Sanitize Trivy and Gitleaks JSON findings."
    )

    parser.add_argument("--trivy", help="Path to Trivy JSON output")
    parser.add_argument("--gitleaks", help="Path to Gitleaks JSON output")
    parser.add_argument(
        "--output",
        required=True,
        help="Destination sanitized JSON file",
    )

    args = parser.parse_args()

    if not args.trivy and not args.gitleaks:
        parser.error("Provide at least one scanner input")

    findings = []

    if args.trivy:
        findings.extend(sanitize_trivy(read_json(args.trivy)))

    if args.gitleaks:
        findings.extend(sanitize_gitleaks(read_json(args.gitleaks)))

    findings = findings[:MAX_FINDINGS]

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)

    temporary = output.with_name(output.name + ".tmp")

    with temporary.open("w", encoding="utf-8") as file:
        json.dump(
            {"findings": findings},
            file,
            indent=2,
            ensure_ascii=True,
        )
        file.write("\n")

    os.chmod(temporary, 0o600)
    temporary.replace(output)
    os.chmod(output, 0o600)

    print(f"Accepted findings: {len(findings)}")
    print(f"Sanitized JSON written to: {output}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"Sanitization failed: {exc}", file=sys.stderr)
        sys.exit(1)
