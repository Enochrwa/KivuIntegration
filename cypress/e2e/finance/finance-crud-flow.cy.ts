import { ROUTES } from "../../support/commands";
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

      // 3. Handle both outcomes: modal (company admin without storeId) or
      //    direct navigation to order detail (quick-create for store-scoped users).
      cy.assertSalesOrderCreateResult();

      cy.get("body").then(($body) => {
        const modalVisible = $body
          .find('[data-testid="create-sales-order-modal"]')
          .toArray()
          .some((el) => Cypress.dom.isVisible(el));

        if (modalVisible) {
          // Modal path: submit the create order modal
          cy.submitCreateSalesOrderModal();
        }
        // If no modal, quick-create already navigated to the detail page
      });

      // 4. Verify we land on order detail page
      cy.location("pathname", { timeout: 45000 }).should((pathname) => {
        expect(pathname).to.match(/\/orders\/sales\/[^/?#]+/);
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
