/**
 * Create Sales Order E2E: New Order opens AddSalesOrderModal. Only COMPANY_ADMIN sees the
 * store dropdown; other roles submit with profile storeId. Submit navigates to order detail.
 */
import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

const ALLOWED_ROLES = ["admin", "storeAdmin"] as const;

ALLOWED_ROLES.forEach((userKey) => {
  describe(`Orders: Create sales order flow (${userKey})`, () => {
    beforeEach(() => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
      cy.clickSidebarOrders();
      cy.url().then((href) => {
        if (!href.includes("/login")) {
          return;
        }
        cy.log(
          "sales-order-create: on login after orders; visitMfe(portal) + sidebar + orders once"
        );
        cy.visitMfe(ROUTES.portal);
        cy.waitForAppReady();
        cy.assertSidebarNavForPortalUser(userKey);
        cy.clickSidebarOrders();
      });
    });

    it("opens modal from New Order, submits Create Order, lands on order detail", () => {
      // Late Orders-MFE authorize can redirect to login after beforeEach; re-wait before click.
      cy.assertOrdersSalesListReady();
      cy.get(SELECTORS.salesOrder.createButton, { timeout: 45000 })
        .first()
        .click({ force: true });
      cy.get(SELECTORS.salesOrder.modal, { timeout: 25000 }).should("be.visible");
      cy.get(`${SELECTORS.salesOrder.modal} form`).should("exist");
      cy.submitCreateSalesOrderModal();
      cy.location("pathname", { timeout: 45000 }).should((pathname) => {
        const onDetail =
          /\/orders\/sales\/[^/?#]+/.test(pathname) &&
          !/\/orders\/sales\/?$/.test(pathname.replace(/\/$/, ""));
        expect(onDetail, `expected sales order detail URL, got ${pathname}`).to.be.true;
      });
      cy.get(SELECTORS.salesOrder.detailRoot, { timeout: 30000 }).should("be.visible");
    });
  });
});
