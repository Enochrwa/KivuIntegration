/**
 * Tests Create Purchase Order flow.
 * COMMENTED OUT: purchase order flow checks disabled for now.
 * Using describe.skip to exclude these tests from active suite while
 * keeping the test code for future activation.
 */
import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

// Purchase order selectors — not yet in shared SELECTORS; defined locally until added
const PURCHASE_ORDER_SELECTORS = {
  createButton: "[data-testid='create-purchase-order-btn'], button:contains('New Purchase Order')",
  modal: "[data-testid='create-purchase-order-modal']",
  cancelButton: "[data-testid='create-purchase-order-cancel']",
};

PORTAL_USER_KEYS.forEach((userKey) => {
  describe.skip(`Orders: Create purchase order flow (${userKey})`, () => {
    beforeEach(() => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.ordersPurchase);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
    });

    it("opens Create Purchase Order modal from button", () => {
      cy.get(PURCHASE_ORDER_SELECTORS.createButton, { timeout: 15000 }).click();
      cy.get(`${PURCHASE_ORDER_SELECTORS.modal}, ${SELECTORS.dialog}`).should("be.visible");
      cy.get("form").should("exist");
    });

    it("modal has form and can be closed", () => {
      cy.get(PURCHASE_ORDER_SELECTORS.createButton, { timeout: 15000 }).click();
      cy.get(`${PURCHASE_ORDER_SELECTORS.modal}, ${SELECTORS.dialog}`).should("be.visible");
      cy.get(`${PURCHASE_ORDER_SELECTORS.cancelButton}, ${SELECTORS.dialogClose}`).first().click();
      cy.get(`${PURCHASE_ORDER_SELECTORS.modal}, ${SELECTORS.dialog}`).should("not.exist");
    });
  });
});
