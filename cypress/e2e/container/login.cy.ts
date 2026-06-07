/**
 * Container: Login
 *
 * Login page load, validation, and successful login with env credentials.
 */
import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

describe("Container: Login", () => {
  beforeEach(() => {
    cy.visit(buildLocalizedPath(ROUTES.login));
  });

  it("loads the login page", () => {
    cy.get("body").should("be.visible");
    cy.get(`${SELECTORS.login.email}, input[name='email']`).should("exist");
    cy.get(`${SELECTORS.login.password}, input[name='password']`).should(
      "exist"
    );
    cy.get(`${SELECTORS.login.submit}, button[type='submit']`).should("exist");
  });

  it("shows validation when submitting empty form", () => {
    cy.get(`${SELECTORS.login.submit}, button[type='submit']`).first().click();
    cy.get("body").should("be.visible");
    cy.get(SELECTORS.login.validationError).should("exist");
  });

  it("shows validation when submit with empty email and password", () => {
    cy.get(`${SELECTORS.login.submit}, button[type='submit']`).first().click();
    cy.get(SELECTORS.login.validationError).should("exist");
  });

  it("shows validation for invalid email format", () => {
    cy.get(`${SELECTORS.login.email}, input[name='email']`)
      .first()
      .type("notanemail");
    cy.get(`${SELECTORS.login.password}, input[name='password']`)
      .first()
      .type("password123");
    cy.get(`${SELECTORS.login.submit}, button[type='submit']`).first().click();
    cy.get(SELECTORS.login.validationError).should("exist");
  });

  it("shows validation for password too short", () => {
    cy.get(`${SELECTORS.login.email}, input[name='email']`)
      .first()
      .type("user@example.com");
    cy.get(`${SELECTORS.login.password}, input[name='password']`)
      .first()
      .type("short");
    cy.get(`${SELECTORS.login.submit}, button[type='submit']`).first().click();
    cy.get(SELECTORS.login.validationError).should("exist");
  });

  it("can log in with credentials from env", () => {
    const email = Cypress.env("adminEmail");
    const password = Cypress.env("adminPassword");
    if (!email || !password) {
      cy.log("Skipping: CYPRESS_ADMIN_EMAIL / CYPRESS_ADMIN_PASSWORD not set");
      return;
    }
    cy.get(`${SELECTORS.login.email}, input[name='email']`)
      .first()
      .clear()
      .type(email);
    cy.get(`${SELECTORS.login.password}, input[name='password']`)
      .first()
      .clear()
      .type(password);
    cy.get(`${SELECTORS.login.submit}, button[type='submit']`).first().click();
    cy.url({ timeout: 15000 }).should("not.include", ROUTES.login);
  });
});
