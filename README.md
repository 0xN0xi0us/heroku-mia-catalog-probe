# Bounded MCP catalog-schema probe

This fixture exposes exactly one MCP process and one tool. The tool has a
one-byte description and a deterministic valid JSON Schema containing 2,048
fixed-width enum values. It exists to determine whether Managed Inference
stores and returns complete `input_schema` values through
`GET /v1/mcp/servers` independently of tool descriptions.

Safety properties:

- One initial `tools/list` page, one tool, and no pagination.
- No networking, filesystem access, child processes, timers, or retries.
- Every `tools/call` returns one short fixed marker.
- The generated schema is hard-coded and cannot be enlarged by input or
  environment variables.
- Live catalog clients must enforce a 768 KiB response cap and a 10-second
  timeout.
