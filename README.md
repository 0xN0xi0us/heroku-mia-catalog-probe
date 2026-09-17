# MCP catalog numeric canonicalization probe

This authorized-testing fixture exposes ten MCP process types with ten tools
each. Every tool has a one-byte description and a deterministic input schema
containing 7,296 copies of the JSON number `1e-323`. The source schema is 51,191
bytes, or 51,193 bytes with the empty annotations object, below the observed
51,200-byte per-tool limit.

Heroku storage canonicalizes each six-byte exponent into a much longer decimal
representation. The fixture exists to reproduce the resulting catalog response
amplification and resource-level availability failure.

Safety properties:

- One initial `tools/list` page and ten tools per process, with no pagination.
- No networking, filesystem access, child processes, timers, or retries.
- Every `tools/call` returns one short fixed marker.
- The generated schemas are hard-coded and cannot be enlarged by input or
  environment variables.
- Make only one catalog request at concurrency one with a 260 MiB hard cap and
  a 60-second timeout.
