# Bounded MCP catalog-schema probe

This fixture exposes exactly two MCP process types with 100 tools each. Every
tool has a one-byte description and a deterministic valid JSON Schema containing
480 fixed-width enum values. Each individual schema remains below Heroku's
observed 51,200-byte per-tool limit. It exists to determine whether Managed
Inference enforces an aggregate bound across registered MCP servers before
returning all schemas through the unpaginated `GET /v1/mcp/servers` response.

Safety properties:

- One initial `tools/list` page and 100 tools per process, with no pagination.
- No networking, filesystem access, child processes, timers, or retries.
- Every `tools/call` returns one short fixed marker.
- The generated schemas are hard-coded and cannot be enlarged by input or
  environment variables.
- Live catalog clients must enforce a 12 MiB response cap and a 10-second
  timeout.
