# Kivu IMS E2E

Standalone Cypress E2E tests for all Kivu IMS UI apps (Container, Product MFE, Order MFE, Membership MFE, Admin Portal). Tests run against a **staging/deployed** base URL (no checkout of UI repos).

- **TypeScript**
- **Cypress** with env-based config for GitHub Actions
- **Routes** from `@kivunova/kivufrontendcommon` so E2E paths stay in sync with the apps

## Quick start (local)

If `@kivunova/kivufrontendcommon` is private (e.g. GitHub Packages), ensure `.npmrc` or repo secrets are set so `npm install` can resolve it.

```bash
npm install
cp .env.example .env
# Edit .env with CYPRESS_BASE_URL and test user credentials
npm run cy:open
# or
npm run cy:run
```

## Repository structure

```
cypress/
  e2e/
    container/            # login, shell load + home navigation, remote loading, full navigation flow
    inventory/            # product list, full product flow
    orders/               # sales orders, CSV-aligned + full order flow
    membership/           # plans, checkout, full membership flow
  support/                # commands, e2e.ts
  fixtures/
cypress.config.ts
```

**Flow coverage:** Each area has a `full-*-flow.cy.ts` (or equivalent) that covers login (where applicable) through that area. `container/full-navigation-flow.cy.ts` covers login → portal and sidebar navigation to all MFEs (dashboard, inventory, orders, finance, profile, company).

**Functional tests (component logic, not just page load):**
- **container/download-apps-flow.cy.ts** – From home (installer localStorage cleared), reaches `/download-apps` via optional welcome **Download apps** link or direct URL if the build hides that CTA. First-visit sheet is suppressed like other specs (`kivu_sd` on `window:before:load`). Asserts Windows and Mac installer links (`href` URLs).
- **container/download-mobile-apps-flow.cy.ts** – Same optional routing as `download-apps-flow` on a mobile viewport (storage cleared; first-visit sheet may appear). Asserts Android and iOS section titles (store URLs when present), using visible copy or `data-testid` where available.
- **container/login.cy.ts** – Login page load, validation (empty, invalid email, short password), and login with env credentials.
- **inventory/product-add-flow.cy.ts** – Add Product modal open, validation on empty submit, fill required fields and submit.
- **orders/sales-order-create-flow.cy.ts** – Open New Order / Create Sales Order modal.
- **membership/plan-select-flow.cy.ts** – Plans page, click Select plan → order summary; order summary "Browse Plans" → back to plans.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CYPRESS_BASE_URL` | Yes | Base URL of the container app (e.g. `https://staging.your-app.com`). |
| `CYPRESS_ADMIN_EMAIL` | For login specs | Test user email for `cy.loginAs()`. Must have **ACTIVE membership** and **admin** role for portal flows (`container/company-flow`, `container/profile-flow`, `container/full-navigation-flow`, etc.). If the account has no active plan, the app redirects to membership and tests that call `assertOnPortal()` or expect the sidebar shell will fail with a clear timeout / error. |
| `CYPRESS_ADMIN_PASSWORD` | For login specs | Test user password. |
| `CYPRESS_USER_PASSWORD` | Multi-role specs | Shared password for store admin, clerk, and analyst when using `cy.loginAs()` with those roles. |
| `CYPRESS_STORE_ADMIN_EMAIL` | Multi-role specs | Email for store-admin portal user. |
| `CYPRESS_STORE_CLERK_EMAIL` | Multi-role specs | Email for clerk portal user. |
| `CYPRESS_STORE_ANALYST_EMAIL` | Multi-role specs | Email for analyst portal user. |
| `CYPRESS_ADMIN_URL` | Optional | Admin app URL if different from container. |
| `CYPRESS_DEFAULT_LANG` | Optional | Default language (e.g. `en`). Routes use `/:lang/...`. |
| `CYPRESS_USER_AGENT` | Optional | Custom User-Agent string for Cypress (CI / WAF bypass). |

## What you need for GitHub Actions

1. **Repository variables** (Settings → Secrets and variables → Actions → Variables):
   - `CYPRESS_BASE_URL` – staging container URL (e.g. `https://staging.your-app.com`)
   - `CYPRESS_ADMIN_URL` (optional) – admin app URL if separate
   - `CYPRESS_DEFAULT_LANG` (optional) – e.g. `en`

2. **Repository secrets** (Settings → Secrets and variables → Actions → Secrets):
   - `CYPRESS_ADMIN_EMAIL` – company admin test user (active membership)
   - `CYPRESS_ADMIN_PASSWORD` – password for admin user
   - `CYPRESS_USER_PASSWORD` – shared password for store-scoped test users
   - `CYPRESS_STORE_ADMIN_EMAIL`, `CYPRESS_STORE_CLERK_EMAIL`, `CYPRESS_STORE_ANALYST_EMAIL` – required for specs that iterate `PORTAL_USER_KEYS` (orders, sidebar-by-role, order-flow CSV, etc.)

3. **Staging environment**: The container (and MFEs) must be deployed and reachable at `CYPRESS_BASE_URL`. Ensure the test user exists and can log in (and, if your app uses it, that OTP is disabled for this user or handled in tests).

4. **Staging workflow**: `Cypress E2E` runs on `push`, `pull_request`, schedule (every 6 hours), and `workflow_dispatch` (manual with optional suite: container, inventory, orders, membership). Set the variables and secrets above so the job can reach staging and log in.

## Production workflow (separate env + separate schedule)

`Cypress E2E Prod` is a dedicated production flow and runs **only on schedule every 3 hours**.

Use these production-specific GitHub Actions values:

1. **Repository variables**:
   - `CYPRESS_PROD_BASE_URL` (required)
   - `CYPRESS_PROD_ADMIN_URL` (optional)
   - `CYPRESS_DEFAULT_LANG` (optional, shared with non-prod)

2. **Repository secrets**:
   - `CYPRESS_PROD_ADMIN_EMAIL`
   - `CYPRESS_PROD_ADMIN_PASSWORD`
   - `CYPRESS_PROD_USER_PASSWORD`
   - `CYPRESS_PROD_STORE_ADMIN_EMAIL`
   - `CYPRESS_PROD_STORE_CLERK_EMAIL`
   - `CYPRESS_PROD_STORE_ANALYST_EMAIL`
   - `CYPRESS_USER_AGENT` (optional, shared with non-prod)
   - `SLACK_WEBHOOK_URL` (optional, failure-only notifications)

The prod workflow maps these `*_PROD` values to Cypress runtime vars (`CYPRESS_BASE_URL`, etc.) so test code remains unchanged.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run cy:open` | Open Cypress UI |
| `npm run cy:run` | Run all E2E tests |
| `npm run cy:run:container` | Container specs only |
| `npm run cy:run:inventory` | Inventory specs only |
| `npm run cy:run:orders` | Orders specs only |
| `npm run cy:run:membership` | Membership specs only |

## Notes

- **Sidebar navigation:** Products, Categories, and **Orders** (sales list) are top-level items. After `visitMfe(ROUTES.portal)` and `cy.assertSidebarNavForPortalUser(...)`, use `cy.clickSidebarProducts()` or `cy.clickSidebarOrders()` to open those MFE routes (see `cypress/support/commands.ts`). `SELECTORS.sidebarNav.orders` targets `sidebar-nav-orders-sales` (label “Orders” in the shell).
- Tests use **data-testid**, **id**, and **stable classes** only; they do not rely on visible text (i18n-safe). Each UI app should add the following attributes so E2E can find elements without flaky text selectors.

**Required data-testid (and id/class) by app**

| App | Element | data-testid (or id/class) |
|-----|--------|---------------------------|
| Container | Login email input | `login-email` |
| Container | Login password input | `login-password` |
| Container | Login submit button | `login-submit` |
| Container | Welcome login link | `login-link` |
| Container | App shell / layout | `sidebar-drawer`, `.MuiDrawer-root` |
| Container | Sidebar nav items | `sidebar-nav-dashboard`, `sidebar-nav-inventory-products`, `sidebar-nav-inventory-categories`, `sidebar-nav-orders-sales`, `sidebar-nav-finance`, etc. (from SidebarConfig) |
| Product MFE | Add product button | `add-product-btn` |
| Product MFE | Add product modal | `add-product-modal` (or role="dialog") |
| Product MFE | Product name input | `product-name-input` |
| Product MFE | Add product submit | `add-product-submit` |
| Product MFE | Product list area | `product-list` |
| Order MFE | Create purchase order button | `create-purchase-order-btn` |
| Order MFE | Create purchase order modal | `create-purchase-order-modal` |
| Order MFE | Create sales order button | `create-sales-order-btn` (toolbar **New Order** and empty state) |
| Order MFE | Create sales order modal | `create-sales-order-modal` |
| Order MFE | Order list area | `order-list` |
| Admin portal | Admin users list page | `admin-users-page` |
| Admin portal | Admin users table | `admin-users-table` |
| Admin portal | Admin user detail page | `admin-user-detail-page` |
| Membership MFE | Select plan button | `select-plan-btn` |
| Membership MFE | Plan card | `plan-card` |
| Membership MFE | Browse plans button | `browse-plans-btn` |
| Membership MFE | No plan selected block | `no-plan-selected` |

Full list and fallbacks: see `cypress/support/selectors.ts`.

- `cy.loginAs('admin')` (and `'user'`) needs `CYPRESS_ADMIN_EMAIL` and `CYPRESS_ADMIN_PASSWORD`. Other roles need the three store emails plus `CYPRESS_USER_PASSWORD`; missing values throw when those tests run (see `cypress/support/portalUsers.ts`).
