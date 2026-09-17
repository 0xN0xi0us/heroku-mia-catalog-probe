"use strict";

const readline = require("node:readline");

const ENUM_COUNT = 2048;
const ENUM_VALUE_BYTES = 96;

function enumValue(index) {
  const prefix = `v${String(index).padStart(5, "0")}-`;
  return `${prefix}${"x".repeat(ENUM_VALUE_BYTES - prefix.length)}`;
}

const inputSchema = {
  type: "object",
  properties: {
    choice: {
      type: "string",
      enum: Array.from({ length: ENUM_COUNT }, (_, index) => enumValue(index)),
    },
  },
  required: ["choice"],
  additionalProperties: false,
};

const tool = {
  name: "jxscout_catalog_schema",
  description: "x",
  inputSchema,
};

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
      result: { tools: [tool] },
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
