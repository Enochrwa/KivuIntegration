import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

describe("Container: Remote loading", () => {
  PORTAL_USER_KEYS.forEach((userKey) => {
    it(`inventory and orders routes reachable (${userKey})`, () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.inventory);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
      cy.url().should("include", "inventory");

      cy.visitMfe(ROUTES.orders);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
      cy.url().should("include", "orders");
    });
  });

  it("membership MFE loads on plans route", () => {
    cy.visit(buildLocalizedPath(ROUTES.membershipPlans));
    cy.get("body").should("be.visible");
    cy.url().should("include", "membership");
    cy.get(SELECTORS.planListArea, { timeout: 15000 }).first().should("be.visible");
  });
});
