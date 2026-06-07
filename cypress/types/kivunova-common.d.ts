/**
 * Type declaration stub for @kivunova/kivufrontendcommon
 * Route constants and shared utilities for Kivu IMS frontend apps.
 */
declare module "@kivunova/kivufrontendcommon" {
  // Public routes
  export const PAGE_ROUTE_HOMEPAGE: string;
  export const PAGE_ROUTE_LOGIN: string;
  export const PAGE_ROUTE_REGISTRATION: string;
  export const PAGE_ROUTE_FORGOT_PASSWORD: string;
  export const PAGE_ROUTE_DOWNLOAD_APPS: string;
  export const PAGE_ROUTE_ABOUT: string;
  export const PAGE_ROUTE_FAQ: string;
  export const PAGE_ROUTE_CONTACT: string;
  export const PAGE_ROUTE_USER_GUIDE: string;

  // Membership routes
  export const PAGE_ROUTE_MEMBERSHIP: string;
  export const PAGE_ROUTE_MEMBERSHIP_PLANS: string;
  export const PAGE_ROUTE_MEMBERSHIP_SUBSCRIPTIONS: string;

  // Portal prefix
  export const PORTAL_PREFIX: string;

  // Portal routes
  export const PAGE_PORTAL_DASHBOARD: string;
  export const PAGE_PORTAL_PROFILE: string;
  export const PAGE_PORTAL_COMPANY: string;
  export const PAGE_PORTAL_STORE: string;
  export const PAGE_PORTAL_STORES: string;

  // Inventory routes
  export const PAGE_PORTAL_INVENTORY: string;
  export const PAGE_PORTAL_INVENTORY_PRODUCT: string;
  export const PAGE_PORTAL_INVENTORY_CATEGORIES: string;
  export const PAGE_PORTAL_INVENTORY_PRODUCT_DETAIL: string;

  // Orders routes
  export const PAGE_PORTAL_ORDERS: string;
  export const PAGE_PORTAL_ORDERS_SALES_LIST: string;
  export const PAGE_PORTAL_ORDERS_PURCHASE_LIST: string;
  export const PAGE_PORTAL_ORDERS_SALES_DETAIL: string;
  export const PAGE_PORTAL_ORDERS_PURCHASE_DETAIL: string;
  export const PAGE_PORTAL_ORDERS_INVOICE_DETAIL: string;
  export const PAGE_PORTAL_ORDERS_INVOICES_LIST: string;
  export const PAGE_PORTAL_ORDERS_PAYMENTS_LIST: string;
  export const PAGE_PORTAL_ORDERS_PAYMENT_DETAIL: string;

  // Finance routes
  export const PAGE_PORTAL_FINANCE: string;
  export const PAGE_PORTAL_FINANCE_PAYMENTS: string;
  export const PAGE_PORTAL_FINANCE_INVOICES: string;
  export const PAGE_PORTAL_FINANCE_RECEIPTS_LIST: string;
  export const PAGE_PORTAL_FINANCE_RECEIPT_DETAIL: string;

  // People/employee routes
  export const PAGE_PORTAL_PEOPLE_EMPLOYEES: string;

  // Utilities
  export function isProd(): boolean;
  export const RemoteTenantConfig: Array<{
    appName: string;
    remoteUrl: string;
    isDevOnly?: boolean;
    routes: Array<{ path: string; scope: string; module: string }>;
  }>;
  export const TenantId: { MEMBERSHIP_MFE: string; [key: string]: string };
}

/**
 * Augment Cypress Chainable to accept the standard browser ScrollIntoViewOptions
 * (block, inline, behavior) which the default Cypress types do not include.
 */
declare namespace Cypress {
  interface ScrollIntoViewOptions {
    block?: "start" | "center" | "end" | "nearest";
    inline?: "start" | "center" | "end" | "nearest";
    behavior?: "auto" | "smooth";
    easing?: "linear" | "swing";
    duration?: number;
    offset?: { top: number; left: number };
  }
}
