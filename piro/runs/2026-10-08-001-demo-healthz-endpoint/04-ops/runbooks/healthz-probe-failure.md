# Runbook — `/healthz` probe failing

1. Confirm the failing instance in the platform console.
2. Fetch `GET /healthz` from inside the network; a non-200 or timeout means the process is hung.
3. Capture a thread dump / logs, then let the platform restart the instance (3 failures = automatic restart).
4. If all instances fail simultaneously, suspect a bad deploy: roll back via the deployment runbook.
