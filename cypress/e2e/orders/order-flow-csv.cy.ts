/**
 * Cypress coverage aligned with manual cases in:
 * `IMS Test cases/3_Order_Flow.csv`
 *
 * Automates Sales order rows and Finance route smoke. Purchase rows in the CSV stay manual.
 * Finance: route smoke only; full invoice/payment/receipt flows need seeded data or manual follow-up.
 * Test titles reference the CSV "Test Case" column where applicable.
 */

import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS, PORTAL_USER_NAV } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.filter(key => PORTAL_USER_NAV[key].orders).forEach((userKey) => {
  describe(`Order flow (3_Order_Flow.csv) — Sales Read-Only (${userKey})`, () => {
    it("Sales Orders list loads and views details", () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
      cy.clickSidebarOrders();

      // Assert list/empty state loads
      cy.url().should("include", "orders").and("include", "sales");
      cy.assertOrdersSalesListReady();
      cy.get(`${SELECTORS.salesOrder.listTable}, ${SELECTORS.salesOrder.createButton}`, {
        timeout: 30000,
      })
        .first()
        .should("exist")
        .scrollIntoView({ block: "center" });

      // View details if list is populated
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="sales-order-open-detail"]').length === 0) {
          cy.log("No rows — empty state only (see CSV: Sales Orders - empty state)");
          return;
        }
        cy.get(SELECTORS.salesOrder.openDetailButton).first().click();
        cy.url({ timeout: 20000 }).should("match", /orders\/sales\/.+/);
        cy.get(SELECTORS.salesOrder.detailRoot, { timeout: 25000 }).should("be.visible");
      });
    });
  });
});

const WRITE_ROLES = ["admin", "storeAdmin"] as const;

WRITE_ROLES.forEach((userKey) => {
  describe(`Order flow (3_Order_Flow.csv) — Sales Write Actions (${userKey})`, () => {
    it("Offers create functionality, opens modal, and cancels successfully", () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
      cy.clickSidebarOrders();

      cy.assertOrdersSalesListReady();
      cy.get(SELECTORS.salesOrder.createButton, { timeout: 30000 })
        .first()
        .click({ force: true });

      cy.assertSalesOrderCreateResult();
      
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-sales-order-modal"]:visible').length) {
          cy.waitForAddSalesOrderModalStoresLoaded();
          cy.get(`${SELECTORS.salesOrder.modal} form`).should("exist");
          cy.get(SELECTORS.salesOrder.modalCancel).click();
          cy.get(SELECTORS.salesOrder.modal).should("not.exist");
        } else {
          cy.log("Quick-create navigated to detail — no modal to close");
          cy.url({ timeout: 25000 }).should("match", /\/orders\/sales\/[^/?#]+/);
          cy.get(`${SELECTORS.salesOrder.detailRoot}, ${SELECTORS.mainContent}`, { timeout: 25000 })
            .first()
            .should("be.visible");
        }
      });
    });
  });
});

