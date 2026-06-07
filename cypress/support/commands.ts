/// <reference types="cypress" />

import {
  PAGE_ROUTE_HOMEPAGE,
  PAGE_ROUTE_LOGIN,
  PAGE_ROUTE_REGISTRATION,
  PAGE_ROUTE_FORGOT_PASSWORD,
  PAGE_ROUTE_MEMBERSHIP,
  PAGE_ROUTE_MEMBERSHIP_PLANS,
  PAGE_PORTAL_DASHBOARD,
  PAGE_PORTAL_FINANCE,
  PAGE_PORTAL_FINANCE_INVOICES,
  PAGE_PORTAL_FINANCE_PAYMENTS,
  PAGE_PORTAL_FINANCE_RECEIPTS_LIST,
  PAGE_PORTAL_INVENTORY,
  PAGE_PORTAL_INVENTORY_CATEGORIES,
  PAGE_PORTAL_INVENTORY_PRODUCT,
  PAGE_PORTAL_ORDERS,
  PAGE_PORTAL_ORDERS_SALES_LIST,
  PAGE_PORTAL_PROFILE,
  PAGE_PORTAL_STORE,
  PORTAL_PREFIX,
} from "@kivunova/kivufrontendcommon";
import {
  getPortalCredentials,
  PORTAL_USER_NAV,
  type LoginRole,
  type PortalUserKey,
} from "./portalUsers";
import { SELECTORS } from "./selectors";

/**
 * Route paths built from @kivunova/kivufrontendcommon.
 * Use these in tests so paths stay in sync with the apps.
 */
export const ROUTES = {
  home: PAGE_ROUTE_HOMEPAGE,
  /** Container-only route; see KivuIMSUIContainerApp `PAGE_ROUTE_DOWNLOAD_APPS` */
  downloadApps: "download-apps",
  /** Container public info routes; align with `PAGE_ROUTE_*` in @kivunova/kivufrontendcommon */
  about: "about",
  faq: "faq",
  contact: "contact",
  userGuide: "user-guide",
  login: PAGE_ROUTE_LOGIN,
  registration: PAGE_ROUTE_REGISTRATION,
  forgotPassword: PAGE_ROUTE_FORGOT_PASSWORD,
  portal: PORTAL_PREFIX,
  portalDashboard: `${PORTAL_PREFIX}/${PAGE_PORTAL_DASHBOARD}`.replace(/\/$/, "") || PORTAL_PREFIX,
  inventory: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY}`,
  inventoryProducts: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_PRODUCT}`,
  inventoryCategories: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_CATEGORIES}`,
  orders: `${PORTAL_PREFIX}/${PAGE_PORTAL_ORDERS}`,
  finance: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE}`,
  financePayments: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE_PAYMENTS}`,
  financeInvoices: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE_INVOICES}`,
  financeReceipts: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE_RECEIPTS_LIST}`,
  profile: `${PORTAL_PREFIX}/${PAGE_PORTAL_PROFILE}`,
  ordersSales: `${PORTAL_PREFIX}/${PAGE_PORTAL_ORDERS_SALES_LIST}`,
  membership: PAGE_ROUTE_MEMBERSHIP,
  membershipPlans: PAGE_ROUTE_MEMBERSHIP_PLANS,
  /** From Membership MFE; not in common package */
  membershipOrderSummary: `${PAGE_ROUTE_MEMBERSHIP}/order-summary`,
  portalStore: `${PORTAL_PREFIX}/${PAGE_PORTAL_STORE}`,
} as const;

/**
 * Build path with lang prefix for cy.visit. Uses CYPRESS_DEFAULT_LANG or "en".
 */
export function buildLocalizedPath(route: string): string {
  const lang = Cypress.env("defaultLang") || "en";
  const normalized = route.replace(/^\//, "");
  if (!normalized || normalized === "") return "/";
  return `/${lang}/${normalized}`;
}

/**
 * Product catalog list URL (with optional lang prefix), e.g. `/en/portal/inventory` or
 * `/en/portal/inventory/products`. Used by `clickSidebarProducts` and any spec that must
 * align with the same rules — avoid duplicating stricter `url` checks that break one role.
 */
export function isBrowserPathOnProductCatalog(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || pathname;
  return (
    /\/portal\/inventory\/products\/?$/.test(p) ||
    /\/portal\/inventory\/?$/.test(p)
  );
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Log in via the container login page.
       * Uses CYPRESS_ADMIN_EMAIL and CYPRESS_ADMIN_PASSWORD (or passed args).
       */
      loginAs(role?: LoginRole, email?: string, password?: string): Chainable<void>;

      /**
       * Assert sidebar nav items visible/hidden for a portal user (see SidebarConfig, sidebarRoleAccess, PORTAL_USER_NAV).
       */
      assertSidebarNavForPortalUser(userKey: PortalUserKey): Chainable<void>;

      /**
       * Navigate to a portal/MFE path under baseUrl.
       * @param path - e.g. "portal/inventory" or ROUTES.inventory
       */
      visitMfe(path: string): Chainable<void>;

      /**
       * Product detail (MFE): open the **Product Items** tab. Implemented here (not only in a spec
       * helper) so Cypress always picks up the same code path as `visitMfe` / `loginAs`.
       */
      selectProductViewItemsTab(): Chainable<void>;

      /**
       * Wait for the app shell to be ready (portal layout visible).
       */
      waitForAppReady(): Chainable<void>;

      /**
       * Assert we're on the portal (not membership). Fails with a helpful message
       * if user was redirected to membership (requires ACTIVE membership for portal tests).
       */
      assertOnPortal(): Chainable<void>;

      /**
       * After clicking "New Order" on the sales order list: users **with** a store get
       * quick-create + navigation to detail (no modal). Users **without** storeId (typical
       * company admin) get AddSalesOrderModal. Asserts either outcome.
       */
      assertSalesOrderCreateResult(): Chainable<void>;

      /**
       * After Create Sales Order modal is open: wait until ListStores has finished
       * (store Select visible, or no store picker in this modal).
       */
      waitForAddSalesOrderModalStoresLoaded(): Chainable<void>;

      /**
       * In AddSalesOrderModal: if COMPANY_ADMIN store dropdown is present, pick first store;
       * then click Create Order. Assumes modal is already open.
       */
      submitCreateSalesOrderModal(): Chainable<void>;

      /**
       * Expand parent sidebar item only if child link is not visible, then click child.
       * Parent items with children toggle on each click — a second parent click closes the submenu.
       */
      clickSidebarSubItem(
        parentSelector: string,
        childSelector: string
      ): Chainable<void>;

      /**
       * From an already-loaded portal shell: click sidebar **Orders** (sales list) and wait for route + MFE.
       */
      clickSidebarOrders(): Chainable<void>;

      /**
       * After navigating to sales orders: wait until authorize settles — not on login and list/create UI
       * is present. Call again from `it()` if a late UNAUTHORIZED can fire between hooks and the step
       * that clicks **New Order** (storeAdmin flake).
       */
      assertOrdersSalesListReady(): Chainable<void>;

      /**
       * From an already-loaded portal shell: click sidebar **Products** and wait for route + MFE.
       */
      clickSidebarProducts(): Chainable<void>;

      /**
       * If the first-visit “Get the app” sheet is visible, dismiss it (Not now).
       * No-op when the modal is absent or already dismissed.
       */
      dismissFirstVisitDownloadModal(): Chainable<void>;
    }
  }
}

/** If the first-visit download sheet is open, click **Not now**. No-op if it is not shown. */
Cypress.Commands.add("dismissFirstVisitDownloadModal", () => {
  cy.window({ log: false }).then((win) => {
    try {
      win.sessionStorage.setItem("kivu_sd", "1");
    } catch {
      // ignore cross-origin or quota errors
    }
  });

  const notNow = SELECTORS.firstVisitDownload.notNow;
  cy.get("body", { log: false }).then(($body) => {
    const el = $body
      .find(notNow)
      .toArray()
      .find((node) => Cypress.dom.isVisible(node) || Cypress.$(node).is(':visible'));
    if (el) {
      cy.wrap(el, { log: false }).click({ force: true });
    }
  });
});

Cypress.Commands.add("loginAs", (role: LoginRole = "admin", email?: string, password?: string) => {
  const { email: e, password: p } = getPortalCredentials(role, email, password);
  /** Plus-address emails and passwords with !, {}, etc. must not use Cypress sequences ({enter}, …). */
  const typeOpts = { parseSpecialCharSequences: false } as const;
  cy.visit(buildLocalizedPath(ROUTES.login));
  cy.get("body").should("be.visible");
  cy.get(`${SELECTORS.login.email}, input[name='email']`, { timeout: 15000 })
    .first()
    .should("be.visible")
    .click()
    .clear()
    .type(e, typeOpts);
  cy.get(`${SELECTORS.login.password}, input[name='password']`)
    .first()
    .should("be.visible")
    .click()
    .clear()
    .type(p, typeOpts);
  cy.get(`${SELECTORS.login.submit}, button[type='submit']`).first().should("be.enabled").click();
  // Wait until we leave the login *page* (membership/portal OK). Use last path
  // segment. Use explicit boolean expect — Chai's expect(x, msg).to.not.equal("login")
  // can produce confusing failures when x is e.g. "membership".
  cy.location("pathname", { timeout: 45000 }).should((pathname) => {
    const last = pathname.split("/").filter(Boolean).pop() ?? "";
    expect(
      last !== "login",
      `still on login after submit (pathname=${pathname}). Check CYPRESS_* env, staging GraphQL login/authorize, and super-admin portal rule.`
    ).to.be.true;
  });
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("assertSidebarNavForPortalUser", (userKey: PortalUserKey) => {
  const nav = PORTAL_USER_NAV[userKey];
  cy.dismissFirstVisitDownloadModal();
  cy.get(SELECTORS.sidebar, { timeout: 15000 }).should("exist");

  // Sidebar uses ANALYST until profile hydrates. Wait for any nav item that indicates the real role
  // (dashboard + role-specific can appear in either order on slow networks / repeated logins).
  const roleGateMs =
    userKey === "admin" || userKey === "storeAdmin" ? 90000 : 60000;
  if (userKey === "admin") {
    cy.get(
      `${SELECTORS.sidebarNav.stores}, ${SELECTORS.sidebarNav.company}, ${SELECTORS.sidebarNav.dashboard}`,
      { timeout: roleGateMs }
    ).should("exist");
  } else if (userKey === "storeAdmin") {
    cy.get(
      `${SELECTORS.sidebarNav.store}, ${SELECTORS.sidebarNav.dashboard}`,
      { timeout: roleGateMs }
    ).should("exist");
  } else {
    cy.get(SELECTORS.sidebarNav.finance, { timeout: roleGateMs }).should(
      "exist"
    );
  }

  const assertVisible = (selector: string, shouldExist: boolean) => {
    if (shouldExist) {
      cy.get(selector, { timeout: 20000 }).should("exist");
    } else {
      cy.get("body").should(($body) => {
        expect($body.find(selector).length, selector).to.eq(0);
      });
    }
  };

  assertVisible(SELECTORS.sidebarNav.dashboard, nav.dashboard);
  assertVisible(SELECTORS.sidebarNav.finance, nav.finance);
  assertVisible(SELECTORS.sidebarNav.stores, nav.stores);
  assertVisible(SELECTORS.sidebarNav.company, nav.company);
  assertVisible(SELECTORS.sidebarNav.store, nav.store);
  assertVisible(SELECTORS.sidebarNav.inventoryCategories, nav.categories);
  assertVisible(SELECTORS.sidebarNav.orders, nav.orders);
  assertVisible(SELECTORS.sidebarNav.inventoryProducts, nav.products);

  cy.get(SELECTORS.sidebarNav.profile).should("exist");
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("visitMfe", (path: string) => {
  const localized = buildLocalizedPath(path);
  cy.visit(localized);

  // Full page load to /portal/* runs AuthProvider authorize; transient `Failed to fetch` to GraphQL
  // can redirect to /login once (sometimes after first paint). Dismiss first-visit UI, wait briefly,
  // then retry the same visit if the URL shows login.
  const normalizedPath = path.replace(/^\//, "");
  const isPortalDestination = /(^|\/)portal(\/|$)/i.test(normalizedPath);

  if (!isPortalDestination) {
    return cy.wrap(undefined) as Cypress.Chainable<void>;
  }

  const waitPortalPaint = () => {
    cy.get("body", { timeout: 60000 }).should(($body) => {
      const onLogin = $body.find(SELECTORS.login.form).length > 0;
      const hasPortalChrome =
        $body.find(SELECTORS.appShell).length > 0 ||
        $body.find(SELECTORS.sidebar).length > 0;
      expect(
        onLogin || hasPortalChrome,
        "portal visit: login or portal chrome (authorize finished one way)"
      ).to.be.true;
    });
  };

  const retryIfLoginUrl = () => {
    cy.url().then((href) => {
      if (!href.includes("/login")) {
        return;
      }
      cy.log(
        "visitMfe: bounced to login (transient authorize); retrying same path"
      );
      cy.visit(localized);
      waitPortalPaint();
      cy.dismissFirstVisitDownloadModal();
    });
  };

  waitPortalPaint();
  cy.dismissFirstVisitDownloadModal();
  cy.wait(500, { log: false });
  retryIfLoginUrl();
  // Authorize can flip to login shortly after shell paint (CI / staging).
  cy.wait(800, { log: false });
  retryIfLoginUrl();

  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("selectProductViewItemsTab", () => {
  const panel = SELECTORS.product.tabItemsPanel;
  const tabList = SELECTORS.product.tabList;

  cy.log(
    "selectProductViewItemsTab v7: visit ?e2eTab=items + tab clicks + panel assert"
  );

  cy.location("href").then((href) => {
    const u = new URL(href);
    u.searchParams.set("e2eTab", "items");
    cy.visit(`${u.pathname}${u.search}${u.hash}`);
  });

  cy.waitForAppReady();

  cy.get(tabList, { timeout: 25000 })
    .first()
    .should("exist")
    .scrollIntoView({ block: "center", inline: "center" });
  cy.get(tabList).first().within(() => {
    cy.get('[role="tab"]', { timeout: 15000 }).should("have.length.at.least", 2);
    cy.get('[role="tab"]').eq(0).click({ force: true });
    cy.get('[role="tab"]').eq(1).click({ force: true });
  });

  cy.get(panel, { timeout: 60000 }).should("exist");
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("waitForAppReady", () => {
  cy.get("body").should("be.visible");
  cy.get(`${SELECTORS.appShell}, ${SELECTORS.sidebar}`, { timeout: 15000 }).should("exist");
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("assertOnPortal", () => {
  cy.url().should((url) => {
    if (url.includes(ROUTES.membership)) {
      throw new Error(
        "Test requires a user with ACTIVE membership. Post-login redirect to membership indicates no active plan. Use CYPRESS_ADMIN_EMAIL / CYPRESS_ADMIN_PASSWORD for an account with active membership."
      );
    }
    expect(url, "URL should include portal").to.include(PORTAL_PREFIX);
  });
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("assertSalesOrderCreateResult", () => {
  cy.get("body", { timeout: 25000 }).should(($body) => {
    // Prefer Cypress.dom.isVisible — jQuery :visible often disagrees with MUI Modal
    // (portal, transforms, stacking) even when the dialog is on screen.
    const modalVisible = $body
      .find('[data-testid="create-sales-order-modal"]')
      .toArray()
      .some((el) => Cypress.dom.isVisible(el));
    const detailVisible = $body
      .find('[data-testid="sales-order-detail"]')
      .toArray()
      .some((el) => Cypress.dom.isVisible(el));
    const path = window.location.pathname;
    const navigatedToOrderDetail =
      /\/orders\/sales\/[^/?#]+/.test(path) &&
      !/\/orders\/sales\/?$/.test(path.replace(/\/$/, ""));
    expect(
      modalVisible || detailVisible || navigatedToOrderDetail,
      "Create Sales Order: modal (no store on profile) OR order detail /sales/:id (quick-create)"
    ).to.be.true;
  });
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("waitForAddSalesOrderModalStoresLoaded", () => {
  cy.get('[data-testid="create-sales-order-modal"]', { timeout: 20000 }).should(
    "be.visible"
  );
  // Store picker exists only for COMPANY_ADMIN. Other roles use profile storeId — no #store-select-label.
  cy.get('[data-testid="create-sales-order-modal"]').then(($modal) => {
    if (!$modal.find("#store-select-label").length) {
      return;
    }
    cy.get('[data-testid="add-sales-order-store-select"]', { timeout: 30000 })
      .should("be.visible");
  });
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("submitCreateSalesOrderModal", () => {
  cy.get(SELECTORS.salesOrder.modal, { timeout: 20000 }).should("be.visible");
  cy.waitForAddSalesOrderModalStoresLoaded();
  cy.get(SELECTORS.salesOrder.modal).then(($modal) => {
    if ($modal.find("#store-select-label").length) {
      cy.get(SELECTORS.salesOrder.addModalStoreSelect, { timeout: 30000 })
        .should("be.visible")
        .click();
      cy.get("[role='presentation'] [role='listbox'] [role='option']:not([data-value='']):not([aria-disabled='true'])", { timeout: 15000 })
        .should('have.length.gt', 0)
        .first()
        .click({ force: true });
        
      // Ensure the GraphQL fetch for scoped customers completes and React state settles
      cy.get('body').then(($body) => {
        if ($body.text().includes('Loading customers') || $body.text().includes('Loading...')) {
          cy.contains('Loading customers', { timeout: 15000, matchCase: false }).should('not.exist');
        }
      });
      // Give the Autocomplete unmount/remount prop cycle time to inject the new array
      cy.wait(1500); 
    }
  });

  // Handle Required Customer Selection
  cy.get('[data-testid="add-sales-order-customer-autocomplete"]', { timeout: 30000 }).should('be.visible');
  cy.get('[data-testid="add-sales-order-customer-autocomplete"] input').click();
  
  // Wait explicitly for the options to render and select the first valid one
  cy.get("[role='presentation'] [role='listbox'] li[role='option']:not([aria-disabled='true'])", { timeout: 15000 })
    .should('have.length.gt', 0)
    .first()
    .click({ force: true });

  cy.get(SELECTORS.salesOrder.modalSubmit, { timeout: 20000 })
    .should("be.enabled")
    .click();
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("assertOrdersSalesListReady", () => {
  cy.dismissFirstVisitDownloadModal();
  cy.get("body", { timeout: 120000 }).should(($body) => {
    const loginFormVisible = $body
      .find(SELECTORS.login.form)
      .toArray()
      .some((el) => Cypress.dom.isVisible(el));
    expect(
      loginFormVisible,
      "orders sales: login visible ⇒ authorize UNAUTHORIZED or session lost (check CYPRESS_* / staging GraphQL)"
    ).to.be.false;

    const hasList =
      $body.find("[data-testid='sales-order-list-table']").length > 0;
    const hasCreate =
      $body.find("[data-testid='sales-order-toolbar-create-btn']").length >
        0 ||
      $body.find("[data-testid='create-sales-order-btn']").length > 0;
    expect(
      hasList || hasCreate,
      "orders MFE should render list table or create control"
    ).to.be.true;
  });
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("clickSidebarOrders", () => {
  const openSalesList = () => {
    cy.dismissFirstVisitDownloadModal();
    cy.get(SELECTORS.sidebarNav.orders, { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });
    cy.url({ timeout: 25000 }).should("include", "orders").and("include", "sales");
    cy.waitForAppReady();
  };

  openSalesList();

  // Orders MFE can call authorize after the URL shows /orders/sales; UNAUTHORIZED redirects to
  // login. If we are already on login (immediate redirect), refresh portal once like visitMfe.
  cy.url().then((href) => {
    if (!href.includes("/login")) {
      return;
    }
    cy.log(
      "clickSidebarOrders: on login after nav; visitMfe(portal) + retry orders link once"
    );
    cy.visitMfe(ROUTES.portal);
    cy.waitForAppReady();
    openSalesList();
  });

  cy.dismissFirstVisitDownloadModal();
  cy.wait(600, { log: false });

  cy.assertOrdersSalesListReady();

  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add("clickSidebarProducts", () => {
  cy.dismissFirstVisitDownloadModal();
  cy.get(SELECTORS.sidebarNav.inventoryProducts, { timeout: 20000 })
    .should("be.visible")
    .click({ force: true });
  cy.location("pathname", { timeout: 25000 }).should((pathname) => {
    expect(
      isBrowserPathOnProductCatalog(pathname),
      `expected product catalog path, got ${pathname}`
    ).to.be.true;
  });
  cy.waitForAppReady();
  cy.get("body").then(($body) => {
    if (
      $body.find(SELECTORS.product.companyAdminStoreSelect).length === 0
    ) {
      return;
    }
    cy.get(SELECTORS.product.companyAdminStoreSelect, { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });
    cy.get("[role='listbox']", { timeout: 15000 }).should("be.visible");
    cy.get("[role='listbox'] [role='option']:not([aria-disabled='true'])")
      .should("have.length.at.least", 1)
      .then(($opts) => {
        const i = $opts.length > 1 ? 1 : 0;
        cy.wrap($opts.eq(i)).click({ force: true });
      });
    cy.get("[role='listbox']").should("not.exist");
  });
  cy.waitForAppReady();
  return cy.wrap(undefined) as Cypress.Chainable<void>;
});

Cypress.Commands.add(
  "clickSidebarSubItem",
  (parentSelector: string, childSelector: string) => {
    return cy
      .get("body")
      .then(($body) => {
        const mounted = $body.find(childSelector).length > 0;
        // Only expand when the child is not in the DOM. If it is mounted but not
        // visible yet (motion/layout), clicking the parent *toggles the submenu closed*
        // and unmounts children — then Categories never appears.
        if (!mounted) {
          return cy.get(parentSelector).click({ force: true });
        }
      })
      // Assert on body each retry (fresh DOM), not cy.get(child).should() — sidebar + MFE
      // updates can detach the child between get and should during Cypress retries.
      .then(() => {
        return cy.get("body", { timeout: 20000 }).should(($body) => {
          const el = $body.find(childSelector).get(0);
          expect(el, `sidebar sub-item present: ${childSelector}`).to.exist;
          expect(
            Cypress.dom.isVisible(el),
            `sidebar sub-item visible: ${childSelector}`
          ).to.eq(true);
        });
      })
      .then(() => {
        return cy.get(childSelector).first().click({ force: true });
      });
  }
);

export {};
