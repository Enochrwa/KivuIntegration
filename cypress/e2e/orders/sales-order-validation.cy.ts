import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS, PORTAL_USER_NAV } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.filter(key => PORTAL_USER_NAV[key].orders).forEach((userKey) => {
  describe(`Orders: Sales Order Stock Validation (${userKey})`, () => {
    it("validates and prevents submitting an order for massive quantity (insufficient stock trigger)", () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);

      // Open new sales order modal
      cy.clickSidebarOrders();
      cy.assertOrdersSalesListReady();
      cy.get(SELECTORS.salesOrder.createButton, { timeout: 30000 })
        .first()
        .click({ force: true });
      cy.get(SELECTORS.salesOrder.modal, { timeout: 25000 }).should("be.visible");

      cy.waitForAddSalesOrderModalStoresLoaded();

      cy.get("body").then(($body) => {
        // Attempt to find line item quantity input. This will rely on generic inputs.
        const qtyInputs = $body.find("input[name*='quantity'], input[aria-label*='quantity'], input[type='number']");
        
        if (qtyInputs.length > 0) {
          // If line items exist or can be inputted, we put an impossibly large quantity
          // Use generic selector to re-query after each operation
          cy.get("input[name*='quantity'], input[aria-label*='quantity'], input[type='number']")
            .first()
            .should("be.enabled")
            .click()
            .clear();
          
          cy.get("input[name*='quantity'], input[aria-label*='quantity'], input[type='number']")
            .first()
            .should("be.enabled")
            .type("999999");
          
          cy.get(SELECTORS.salesOrder.modalSubmit).click();

          // Wait for validation error to block submission
          // Error could be from the form or an alert banner.
          cy.get(".MuiFormHelperText-root.Mui-error, [role='alert'], .MuiAlert-root", { timeout: 10000 })
            .should("be.visible");
          
          // Verify modal did not close successfully
          cy.get(SELECTORS.salesOrder.modal).should("be.visible");
        }
      });
      
    });
  });
});
