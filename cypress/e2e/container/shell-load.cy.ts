import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

describe("Container: Shell load", () => {
  it("loads the container app", () => {
    cy.visit(buildLocalizedPath(ROUTES.home));
    cy.get("body").should("be.visible");
    cy.document().its("readyState").should("eq", "complete");
  });

  it("can open login from home", () => {
    cy.visit(buildLocalizedPath(ROUTES.home));
    cy.get(SELECTORS.welcome.loginLink, { timeout: 20000 })
      .filter(":visible")
      .first()
      .click({ force: true });
    cy.url().should("include", ROUTES.login);
  });

  it("can navigate to registration", () => {
    cy.visit(buildLocalizedPath(ROUTES.registration));
    cy.get("body").should("be.visible");
  });

  it("portal route loads (may require auth)", () => {
    cy.visit(buildLocalizedPath(ROUTES.portal));
    cy.get("body").should("be.visible");
    cy.document().its("readyState").should("eq", "complete");
  });
});
