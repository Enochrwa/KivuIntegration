/**
 * Admin portal E2E.
 * Run with CYPRESS_ADMIN_URL set to the admin app base URL (e.g. https://admin-staging.example.com)
 * or run against the same baseUrl if admin is under a path.
 */
import { SELECTORS } from "../../support/selectors";

describe("Admin: User management", () => {
  const adminBaseForSmoke = (
    Cypress.env("adminUrl") ||
    Cypress.config().baseUrl ||
    ""
  ).replace(/\/$/, "");
  /** Dedicated admin app URL from CI (not the container baseUrl). */
  const dedicatedAdminUrl = Cypress.env("adminUrl");

  it("admin app loads", () => {
    cy.visit(adminBaseForSmoke || "/");
    cy.get("body").should("be.visible");
  });

  it("admin users list route renders shell (table or auth redirect)", () => {
    if (!dedicatedAdminUrl) {
      cy.log("Skipping: set CYPRESS_ADMIN_URL to the admin portal origin (not the container URL)");
      return;
    }
    const base = String(dedicatedAdminUrl).replace(/\/$/, "");
    cy.visit(`${base}/dashboard/admin-users`);
    cy.get("body").should("be.visible");
    cy.url({ timeout: 15000 }).should((href) => {
      expect(
        href.includes("/login") ||
          href.includes("admin-users") ||
          href.includes("/dashboard"),
        href
      ).to.be.true;
    });
    cy.get(
      `${SELECTORS.admin.usersPage}, ${SELECTORS.admin.usersTable}, [data-testid='login-form'], input[name='email']`,
      { timeout: 15000 }
    ).should("exist");
  });
});
