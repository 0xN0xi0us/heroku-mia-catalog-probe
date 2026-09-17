# Bounded MCP catalog-schema probe

This fixture exposes exactly one MCP process and 64 tools. Every tool has a
one-byte description and a deterministic valid JSON Schema containing 480
fixed-width enum values. Each individual schema remains below Heroku's observed
51,200-byte per-tool limit. It exists to determine whether Managed Inference
enforces an aggregate bound before returning all schemas through the
unpaginated `GET /v1/mcp/servers` response.

Safety properties:

- One initial `tools/list` page, 64 tools, and no pagination.
- No networking, filesystem access, child processes, timers, or retries.
- Every `tools/call` returns one short fixed marker.
- The generated schemas are hard-coded and cannot be enlarged by input or
  environment variables.
- Live catalog clients must enforce a 768 KiB response cap and a 10-second
  timeout.
