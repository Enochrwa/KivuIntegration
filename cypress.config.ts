import fs from "node:fs";

import { config } from "dotenv";
import { defineConfig } from "cypress";
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";

// Load .env then .env.local (local overrides). CI should set CYPRESS_* in the environment.
config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on) {
      // On failure: print cy command log + console/XHR context (similar to Cypress Open’s command list).
      installLogsPrinter(on, { printLogsToConsole: "onFail" });

      // Cypress records every spec when video is true; remove passing specs’ files so CI artifacts stay small.
      on("after:spec", (_spec, results) => {
        if (!results?.video) return;
        if (results.stats.failures !== 0) return;
        try {
          if (fs.existsSync(results.video)) fs.unlinkSync(results.video);
        } catch {
          // ignore unlink errors (e.g. concurrent access)
        }
      });
    },
    ...(process.env.CYPRESS_USER_AGENT
      ? { userAgent: process.env.CYPRESS_USER_AGENT }
      : {}),
  },

  env: {
    adminUrl: process.env.CYPRESS_ADMIN_URL,
    adminEmail: process.env.CYPRESS_ADMIN_EMAIL,
    adminPassword: process.env.CYPRESS_ADMIN_PASSWORD,
    userPassword: process.env.CYPRESS_USER_PASSWORD,
    storeAdminEmail: process.env.CYPRESS_STORE_ADMIN_EMAIL,
    clerkEmail:
      process.env.CYPRESS_STORE_CLERK_EMAIL ?? process.env.CYPRESS_CLERK_EMAIL,
    analystEmail:
      process.env.CYPRESS_STORE_ANALYST_EMAIL ?? process.env.CYPRESS_ANALYST_EMAIL,
    defaultLang: process.env.CYPRESS_DEFAULT_LANG || "en",
  },

  defaultCommandTimeout: 10000,
  /** Staging can exceed 30s under load; reduces flaky ESOCKETTIMEDOUT on cy.visit. */
  pageLoadTimeout: 90000,
});
