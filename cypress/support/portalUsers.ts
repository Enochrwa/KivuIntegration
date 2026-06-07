/**
 * Portal test users and expected sidebar visibility (mirrors SidebarConfig.tsx).
 */

export const PORTAL_USER_KEYS = ["admin", "storeAdmin", "clerk", "analyst"] as const;
export type PortalUserKey = (typeof PORTAL_USER_KEYS)[number];

/** Expected nav item presence per role (data-testid targets in SELECTORS.sidebarNav). */
export const PORTAL_USER_NAV: Record<
  PortalUserKey,
  {
    dashboard: boolean;
    finance: boolean;
    stores: boolean;
    company: boolean;
    store: boolean;
    products: boolean;
    categories: boolean;
    orders: boolean;
  }
> = {
  admin: {
    dashboard: true,
    finance: false,
    stores: true,
    company: true,
    store: false,
    products: true,
    categories: true,
    orders: true
  },
  storeAdmin: {
    dashboard: true,
    finance: true,
    stores: false,
    company: false,
    store: true,
    products: true,
    categories: true,
    orders: true
  },
  clerk: {
    dashboard: false,
    finance: true,
    stores: false,
    company: false,
    store: false,
    products: true,
    /** `CategoryController` list-by-company includes INVENTORY_CLERK. */
    categories: true,
    orders: true
  },
  analyst: {
    dashboard: false,
    finance: true,
    stores: false,
    company: false,
    store: false,
    /** `ProductController` list/detail — ANALYST not allowed. */
    products: false,
    categories: false,
    /** Same role set as product catalog / order-reservation controllers. */
    orders: false
  },
};

export type LoginRole = PortalUserKey | "user";

export function getPortalCredentials(
  role: LoginRole,
  email?: string,
  password?: string
): { email: string; password: string } {
  if (email && password) {
    return { email, password };
  }
  if (role === "admin" || role === "user") {
    const e = Cypress.env("adminEmail");
    const p = Cypress.env("adminPassword");
    if (!e || !p) {
      throw new Error(
        "Set CYPRESS_ADMIN_EMAIL and CYPRESS_ADMIN_PASSWORD (or pass credentials to loginAs)."
      );
    }
    return { email: e, password: p };
  }
  const pw = (Cypress.env("userPassword") as string) || "";
  const envMap: Record<Exclude<PortalUserKey, "admin">, string> = {
    storeAdmin: "storeAdminEmail",
    clerk: "clerkEmail",
    analyst: "analystEmail",
  };
  const e = Cypress.env(envMap[role]) as string | undefined;
  if (!e || !pw) {
    throw new Error(
      `Missing credentials for "${role}". Set CYPRESS_STORE_ADMIN_EMAIL / CYPRESS_STORE_CLERK_EMAIL / CYPRESS_STORE_ANALYST_EMAIL and CYPRESS_USER_PASSWORD (see .env.example).`
    );
  }
  return { email: e, password: pw };
}
