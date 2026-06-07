import { ROUTES, buildLocalizedPath } from "../../support/commands";
import {
  buildE2ERegistrationIdentity,
  completeRegistrationAsNewUser,
} from "../../support/registrationFlowHelpers";
import { SELECTORS } from "../../support/selectors";

describe("Container: Registration flow", () => {
  beforeEach(() => {
    cy.visit(buildLocalizedPath(ROUTES.registration));
    cy.get("body").should("be.visible");
  });

  it("loads registration page and shows form", () => {
    cy.get(SELECTORS.registration.form, { timeout: 15000 }).should(
      "be.visible"
    );
  });

  it("first step shows next and to-login link, back button not present", () => {
    cy.get(SELECTORS.registration.form, { timeout: 15000 }).should(
      "be.visible"
    );
    cy.get(SELECTORS.registration.next, { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible");
    cy.get(SELECTORS.registration.toLogin, { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible");
    cy.get("body").then(($body) => {
      if ($body.find(SELECTORS.registration.back).length) {
        cy.get(SELECTORS.registration.back).should("not.be.visible");
      }
    });
  });

  it("to-login link navigates to login", () => {
    cy.get(SELECTORS.registration.toLogin, { timeout: 10000 })
      .scrollIntoView()
      .click();
    cy.url().should("include", ROUTES.login);
  });

  /**
   * Full multi-step registration against real GraphQL (staging/local).
   * Uses random email, password, TIN (registration number), and E2E*-prefixed person / company names.
   */
  it("registers a new account end-to-end and lands on login", () => {
    const identity = buildE2ERegistrationIdentity();
    expect(identity.firstName.startsWith("E2E")).to.be.true;
    expect(identity.lastName.startsWith("E2E")).to.be.true;
    expect(identity.companyName.startsWith("E2E")).to.be.true;
    expect(identity.registrationNumber.startsWith("E2E")).to.be.true;
    expect(identity.password.length).to.be.at.least(8);

    completeRegistrationAsNewUser(identity);
  });
});
