import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

describe("Container: Forgot password flow", () => {
  it("loads form, fields, and client-side validation", () => {
    cy.visit(buildLocalizedPath(ROUTES.forgotPassword));
    cy.get("body").should("be.visible");
    cy.get(SELECTORS.forgotPassword.form, { timeout: 15000 }).should(
      "be.visible"
    );
    cy.get(SELECTORS.forgotPassword.email, { timeout: 15000 }).should(
      "be.visible"
    );
    cy.get(SELECTORS.forgotPassword.submit, { timeout: 15000 }).should(
      "be.visible"
    );

    cy.get(SELECTORS.forgotPassword.submit).click();
    cy.get(SELECTORS.forgotPassword.form).within(() => {
      cy.get(SELECTORS.forgotPassword.validationError).should("exist");
    });

    cy.get(SELECTORS.forgotPassword.email).should("be.enabled").click().clear();
    cy.get(SELECTORS.forgotPassword.email).should("be.enabled").type("notanemail");
    cy.get(SELECTORS.forgotPassword.submit).click();
    cy.get(SELECTORS.forgotPassword.validationError, { timeout: 10000 }).should(
      "exist"
    );
  });

  it("to-login link navigates to login", () => {
    cy.visit(buildLocalizedPath(ROUTES.forgotPassword));
    cy.get("body").should("be.visible");
    cy.get(SELECTORS.forgotPassword.toLogin, { timeout: 15000 })
      .should("be.visible")
      .click();
    cy.url().should("include", ROUTES.login);
  });
});
