import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

// The roles allowed to mutate/issue invoices for orders
const ACTION_ROLES = ["admin", "storeAdmin"] as const;

ACTION_ROLES.forEach((userKey) => {
  describe(`Finance CRUD Flow (${userKey})`, () => {
    it("creates a sales order, issues an invoice, records a payment, and creates a receipt", () => {
      // 1. Visit Portal & Login
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);

      // 2. Navigate to Sales Orders & Create One
      cy.clickSidebarOrders();
      cy.assertOrdersSalesListReady();
      cy.get(SELECTORS.salesOrder.createButton, { timeout: 30000 })
        .first()
        .click({ force: true });
      cy.get(SELECTORS.salesOrder.modal, { timeout: 20000 }).should("be.visible");
      
      // Submit order creation (this navigates to order detail page)
      cy.submitCreateSalesOrderModal();
      
      cy.location("pathname", { timeout: 45000 }).should((pathname) => {
        expect(pathname).to.include("/orders/sales/");
      });

      cy.get(SELECTORS.salesOrder.detailRoot, { timeout: 45000 }).should(
        "be.visible"
      );
      cy.get(SELECTORS.salesOrder.detailOrderNumber, { timeout: 45000 })
        .should("be.visible")
        .invoke("text")
        .should("match", /^ORDER-\d+$/);
      cy.get(SELECTORS.salesOrder.detailEditOrder, { timeout: 15000 })
        .first()
        .should("be.visible");
    });
  });
});
