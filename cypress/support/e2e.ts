// ***********************************************************
// Support file for E2E tests. Loaded before spec files.
// ***********************************************************
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";
import "./commands";

installLogsCollector();

beforeEach(() => {
  // Dismiss first-visit download sheet globally before page load to avoid interfering with tests.
  // `download-mobile-apps-flow` clears session and exercises optional first-visit routing — skip opt-out there only.
  const spec = Cypress.spec.name;
  const skipFirstVisitOptOut = spec.includes("download-mobile-apps-flow");
  if (!skipFirstVisitOptOut) {
    cy.on("window:before:load", (win) => {
      win.sessionStorage.setItem("kivu_sd", "1");
    });
  }
});

// Ignore known app-level errors during Cypress visit (e.g. Sentry/auth redirect
// accessing document on null). Handler may receive CypressError wrapper.
Cypress.on("uncaught:exception", (err) => {
  const e = err as Error & { cause?: unknown; originalError?: unknown };
  const raw = e?.cause ?? e?.originalError ?? err;
  const r = raw as { message?: string; toString?: () => string } | undefined;
  const msg = String(
    r?.message ?? r?.toString?.() ?? err?.message ?? err?.toString?.() ?? ""
  );
  if (msg.includes("null") && msg.includes("document")) {
    return false; // prevent Cypress from failing the test
  }
  return true;
});

// E2E traffic is identified via CYPRESS_USER_AGENT (see cypress.config.ts).
// No before() visit to avoid root "/" redirect that triggers "document" null error.
