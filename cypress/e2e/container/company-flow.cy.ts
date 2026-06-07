/**
 * Container: Company flow
 *
 * Single login + sequential tab checks to avoid staging session churn between tests.
 * Stores management lives under sidebar Stores (company admin), not Company tabs.
 */

import { ROUTES } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

describe("Container: Company flow", () => {

  const goToCompanyAsAdmin = () => {
    cy.loginAs("admin");
    cy.visitMfe(ROUTES.portalDashboard);
    cy.assertOnPortal();
    cy.waitForAppReady();
    cy.assertSidebarNavForPortalUser("admin");
    cy.visitMfe(`${ROUTES.portal}/company`);
    cy.url().should("include", "company");
    cy.waitForAppReady();
    cy.get(SELECTORS.company.tabs, { timeout: 25000 }).should("be.visible");
  };

  const selectCompanyTab = (index: number) => {
    cy.get(SELECTORS.company.tab(index), { timeout: 20000 })
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get(SELECTORS.company.tab(index)).should(
      "have.attr",
      "aria-selected",
      "true"
    );
    cy.get(SELECTORS.company.tabPanel(index), { timeout: 20000 }).should(
      "be.visible"
    );
  };

  it("renders all main company tabs (Details, Employees, Subscriptions)", () => {
    goToCompanyAsAdmin();
    cy.get(SELECTORS.company.tab(0)).should("exist");
    cy.get(SELECTORS.company.tab(1)).should("exist");
    cy.get(SELECTORS.company.tab(2)).should("exist");
  });

  it("exercises Details through Subscriptions in one session", () => {
    goToCompanyAsAdmin();

    // Tab 0: Details
    selectCompanyTab(0);
    cy.get(SELECTORS.company.tabPanel(0)).should("exist").and("be.visible");
    cy.get(SELECTORS.company.viewCard, { timeout: 35000 })
      .should("exist")
      .and("be.visible");
    cy.get(SELECTORS.company.editButton).should("exist").and("be.visible");
    cy.get(SELECTORS.company.editButton).click();
    cy.get(SELECTORS.company.editModalContent, { timeout: 5000 }).should(
      "be.visible"
    );
    cy.get(SELECTORS.company.editForm).should("exist").and("be.visible");
    cy.get("body").type("{esc}");

    // Tab 1: Employees
    selectCompanyTab(1);
    cy.get(SELECTORS.company.tabPanel(1)).should("exist").and("be.visible");
    cy.get(SELECTORS.company.tabPanel(1)).within(() => {
      cy.get("div, button", { timeout: 10000 }).first().should("exist");
    });

    // Tab 2: Subscriptions
    selectCompanyTab(2);
    cy.get(SELECTORS.company.tabPanel(2)).should("exist").and("be.visible");
    cy.get(SELECTORS.company.subscriptions).should("exist").and("be.visible");
    cy.get(SELECTORS.company.subscriptionsViewButton)
      .should("exist")
      .and("be.visible");
  });
});
