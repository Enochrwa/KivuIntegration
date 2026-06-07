/**
 * Tests Create Purchase Order flow. Uses data-testid; UI should add create-purchase-order-btn, create-purchase-order-modal.
 * COMMENTED OUT: purchase order flow checks disabled for now.
 */
import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.forEach((userKey) => {
  describe.skip(`Orders: Create purchase order flow (${userKey})`, () => {
    beforeEach(() => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.ordersPurchase);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
    });

    it("opens Create Purchase Order modal from button", () => {
    cy.get(SELECTORS.purchaseOrder.createButton, { timeout: 15000 }).click();
    cy.get(`${SELECTORS.purchaseOrder.modal}, ${SELECTORS.dialog}`).should("be.visible");
    cy.get("form").should("exist");
  });

  it("modal has form and can be closed", () => {
    cy.get(SELECTORS.purchaseOrder.createButton, { timeout: 15000 }).click();
    cy.get(`${SELECTORS.purchaseOrder.modal}, ${SELECTORS.dialog}`).should("be.visible");
    cy.get(`${SELECTORS.purchaseOrder.cancelButton}, ${SELECTORS.dialogClose}`).first().click();
    cy.get(`${SELECTORS.purchaseOrder.modal}, ${SELECTORS.dialog}`).should("not.exist");
  });
  });
});
