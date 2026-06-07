import { ROUTES, buildLocalizedPath } from "../../support/commands";

describe("Membership: Plans and checkout", () => {
  it("loads membership plans page (standalone route)", () => {
    cy.visit(buildLocalizedPath(ROUTES.membershipPlans));
    cy.get("body").should("be.visible");
  });

  it("membership route is reachable", () => {
    cy.visit(buildLocalizedPath(ROUTES.membership));
    cy.get("body").should("be.visible");
    cy.url().should("include", ROUTES.membership);
  });
});
