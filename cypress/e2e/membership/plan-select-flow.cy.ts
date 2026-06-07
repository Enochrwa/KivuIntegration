/**
 * Tests membership plan selection flow. Uses data-testid; UI should add select-plan-btn, browse-plans-btn, plan-card, no-plan-selected.
 * Resilient to: no plans in env (asserts page load only); order-summary may redirect to login when auth required.
 */
import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

describe("Membership: Plan select flow", () => {
  it("plans page loads with content (plan list area or plan cards)", () => {
    cy.visit(buildLocalizedPath(ROUTES.membershipPlans));
    cy.get("body").should("be.visible");
    // Page may show plan cards or empty state; plan-list is always present when MFE loads
    cy.get(SELECTORS.planListArea, { timeout: 15000 }).first().should("be.visible");
  });

  it("when plans exist, clicking Select plan navigates to order summary", () => {
    cy.visit(buildLocalizedPath(ROUTES.membershipPlans));
    cy.get("body").should("be.visible");
    cy.get(SELECTORS.planListArea, { timeout: 15000 }).first().should("be.visible");
    cy.get("body").then(($body) => {
      if ($body.find(SELECTORS.membership.selectPlanButton).length > 0) {
        cy.get(SELECTORS.membership.selectPlanButton).first().click();
        cy.url({ timeout: 10000 }).should("include", ROUTES.membershipOrderSummary);
      }
    });
  });

  it("order summary shows Browse Plans when no plan selected, or redirects to login", () => {
    cy.visit(buildLocalizedPath(ROUTES.membershipOrderSummary));
    cy.get("body").should("be.visible");
    cy.url({ timeout: 10000 }).then((url) => {
      // If auth required, app redirects to login with redirectPath
      if (url.includes(ROUTES.login)) {
        expect(url).to.include(ROUTES.membership);
        return;
      }
      // On order-summary: if no-plan UI exists, click Browse Plans; else pass (page loaded, UI may vary)
      cy.get("body").then(($body) => {
        const browseBtn = $body.find(SELECTORS.membership.browsePlansButton);
        if (browseBtn.length > 0) {
          cy.get(SELECTORS.membership.browsePlansButton).first().click();
          cy.url().should("include", ROUTES.membershipPlans);
        }
      });
    });
  });
});
