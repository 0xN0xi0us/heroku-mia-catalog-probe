const mode = process.env.JXCI_STATUS_RACE_MODE;
const delayMs = Number(process.env.JXCI_STATUS_RACE_DELAY_MS || "0");

if (!['pass', 'fail'].includes(mode)) {
  console.error(
    JSON.stringify({
      probe: "jx-ci-status-order-invalid-config",
      modePresent: Boolean(mode),
      delayMs,
    }),
  );
  process.exit(64);
}

console.log(
  JSON.stringify({
    probe: "jx-ci-status-order-start",
    mode,
    delayMs,
    outboundRequests: 0,
  }),
);

setTimeout(() => {
  console.log(
    JSON.stringify({
      probe: "jx-ci-status-order-finish",
      mode,
      expectedStatus: mode === "pass" ? "succeeded" : "failed",
      outboundRequests: 0,
    }),
  );
  process.exit(mode === "pass" ? 0 : 23);
}, delayMs);
