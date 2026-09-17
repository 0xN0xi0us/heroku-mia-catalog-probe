"use strict";

const readline = require("node:readline");

const TOOL_COUNT = 100;
const ENUM_COUNT_PER_TOOL = 7296;

function inputSchema() {
  return {
    type: "object",
    properties: {
      choice: {
        type: "number",
        enum: Array.from({ length: ENUM_COUNT_PER_TOOL }, () => 1e-323),
      },
    },
    required: ["choice"],
    additionalProperties: false,
  };
}

const tools = Array.from({ length: TOOL_COUNT }, (_, toolIndex) => ({
  name: `jxscout_catalog_${String(toolIndex).padStart(3, "0")}`,
  description: "x",
  inputSchema: inputSchema(),
}));

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
  terminal: false,
});

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function handle(request) {
  if (!request || request.jsonrpc !== "2.0") return;

  if (request.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: request.params?.protocolVersion || "2025-06-18",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "jxscout-catalog-probe", version: "1.0.0" },
      },
    });
    return;
  }

  if (request.method === "tools/list") {
    send({
      jsonrpc: "2.0",
      id: request.id,
      result: { tools },
    });
    return;
  }

  if (request.method === "tools/call") {
    send({
      jsonrpc: "2.0",
      id: request.id,
      result: {
        content: [{ type: "text", text: "JXSCOUT_CATALOG_OK" }],
        isError: false,
      },
    });
    return;
  }

  if (request.id !== undefined) {
    send({
      jsonrpc: "2.0",
      id: request.id,
      error: { code: -32601, message: "Method not found" },
    });
  }
}

rl.on("line", (line) => {
  try {
    handle(JSON.parse(line));
  } catch {
    // The fixture never reflects malformed input into an error value.
  }
});
