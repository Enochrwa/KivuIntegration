import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

describe("Membership: Full membership flow", () => {
  it("visit membership → plans page loads", () => {
    cy.visit(buildLocalizedPath(ROUTES.membership));
    cy.get("body").should("be.visible");
    cy.url().should("include", ROUTES.membership);
  });

  it("visit membership/plans → page has content", () => {
    cy.visit(buildLocalizedPath(ROUTES.membershipPlans));
    cy.get("body").should("be.visible");
    // Plans page loads async (remote MFE + API); wait for content (heading, cards, or container)
    cy.get(SELECTORS.planListArea, { timeout: 15000 }).first().should("be.visible");
  });
});
