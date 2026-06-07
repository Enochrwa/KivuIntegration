# Role reference (from backend services)

Use this when running test cases. **Allowed roles** in each test = which user role(s) can perform that action. If you use a different role, the action may be forbidden (403) or the UI may hide it.

**Role table:** See **`0_Role_Reference.csv`** for the full list (Role, Scope, Typical use). You can import it into Excel or Google Sheets.

**Backend rules (summary):**
- **Identity:** Edit company, create store = COMPANY_ADMIN. Employees, customers, suppliers = COMPANY_ADMIN or STORE_ADMIN (scoped). Profile = any authenticated.
- **Products:** Create/update/delete product = COMPANY_ADMIN, STORE_ADMIN. List/get product = all store-level roles. **Categories:** Create/update/delete = COMPANY_ADMIN only. List categories = all store-level roles.
- **Product items:** Create = COMPANY_ADMIN, STORE_ADMIN, WAREHOUSE_MANAGER, INVENTORY_CLERK. Transition, list, get = + SALES_PROCUREMENT.
- **Orders:** List all orders by company = COMPANY_ADMIN only. List by store, create order, add item, scan = any authenticated with store/company. **Invoices/Payments/Receipts:** List all by company = COMPANY_ADMIN only. Issue invoice, record payment, create receipt, view by order/invoice = any authenticated (company scoped).
