/**
 * Container: Full navigation flow
 *
 * Runs per portal user (admin, store admin, clerk, analyst).
 * One login + sequential nav checks per user to avoid staging session/token churn
 * across many tests (was causing mid-suite redirects to login).
 */

import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS, PORTAL_USER_NAV } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.forEach((userKey) => {
  describe(`Container: Full navigation flow (${userKey})`, () => {
    const nav = PORTAL_USER_NAV[userKey];

    beforeEach(() => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portalDashboard);
      cy.assertOnPortal();
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
    });

    it("ends at portal after login (not membership)", () => {
      cy.url().should("include", "portal");
      cy.url().should("not.include", "membership");
      cy.get(SELECTORS.sidebar, { timeout: 10000 }).should("exist");
    });

    it("sidebar navigation: expected MFE routes load in one session", () => {
      cy.dismissFirstVisitDownloadModal();

      const assertMfeLoaded = (urlSegment: string) => {
        cy.url({ timeout: 45000 }).should("include", urlSegment);
        // Remote MFEs + shell layout: allow longer settle after heavy routes (e.g. orders).
        cy.get(SELECTORS.mainContent, { timeout: 60000 })
          .filter(":visible")
          .first()
          .should("be.visible");
      };

      if (nav.dashboard) {
        cy.get(SELECTORS.sidebarNav.dashboard).click({ force: true });
        assertMfeLoaded("portal");
      }

      if (nav.products) {
        cy.get(SELECTORS.sidebarNav.inventoryProducts).click({ force: true });
        assertMfeLoaded("inventory/products");
      }

      if (nav.categories) {
        cy.get(SELECTORS.sidebarNav.inventoryCategories).click({ force: true });
        assertMfeLoaded("inventory/categories");
      }

      if (nav.orders) {
        cy.clickSidebarOrders();
        assertMfeLoaded("orders/sales");
      }

      if (nav.finance) {
        cy.dismissFirstVisitDownloadModal();
        cy.url().should("not.include", "/login");
        cy.clickSidebarSubItem(
          SELECTORS.sidebarNav.finance,
          SELECTORS.sidebarNav.financePayments
        );
        assertMfeLoaded("finance/payments");

        cy.clickSidebarSubItem(
          SELECTORS.sidebarNav.finance,
          SELECTORS.sidebarNav.financeInvoices
        );
        assertMfeLoaded("finance/invoices");

        cy.clickSidebarSubItem(
          SELECTORS.sidebarNav.finance,
          SELECTORS.sidebarNav.financeReceipts
        );
        assertMfeLoaded("finance/receipts");
      }

      cy.get(SELECTORS.sidebarNav.profile).click({ force: true });
      assertMfeLoaded("profile");

      if (nav.stores) {
        cy.get(SELECTORS.sidebarNav.stores).click({ force: true });
        assertMfeLoaded("company/stores");
      }

      if (nav.company) {
        cy.get(SELECTORS.sidebarNav.company).click({ force: true });
        assertMfeLoaded("company");
      }

      if (nav.store) {
        cy.get(SELECTORS.sidebarNav.store).click({ force: true });
        assertMfeLoaded("store");
      }
    });
  });
});
