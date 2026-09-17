"use strict";

const readline = require("node:readline");

const TOOL_COUNT = 128;
const ENUM_COUNT_PER_TOOL = 480;
const ENUM_VALUE_BYTES = 96;

function enumValue(toolIndex, valueIndex) {
  const prefix = `t${String(toolIndex).padStart(2, "0")}-v${String(valueIndex).padStart(4, "0")}-`;
  return `${prefix}${"x".repeat(ENUM_VALUE_BYTES - prefix.length)}`;
}

function inputSchema(toolIndex) {
  return {
    type: "object",
    properties: {
      choice: {
        type: "string",
        enum: Array.from({ length: ENUM_COUNT_PER_TOOL }, (_, valueIndex) =>
          enumValue(toolIndex, valueIndex),
        ),
      },
    },
    required: ["choice"],
    additionalProperties: false,
  };
}

const tools = Array.from({ length: TOOL_COUNT }, (_, toolIndex) => ({
  name: `jxscout_catalog_${String(toolIndex).padStart(3, "0")}`,
  description: "x",
  inputSchema: inputSchema(toolIndex),
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
