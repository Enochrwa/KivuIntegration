/**
 * Stable selectors for E2E: data-testid, id, and stable classes.
 * Do not rely on text content (i18n can change). UI apps should add these attributes.
 */
export const SELECTORS = {
  // Login (Container)
  login: {
    form: "[data-testid='login-form']",
    rightPanel: "[data-testid='login-right-panel']",
    email: "[data-testid='login-email']",
    password: "[data-testid='login-password']",
    submit: "[data-testid='login-submit']",
    validationError: "[data-testid='login-validation-error'], .MuiFormHelperText-root[role='alert'], p.MuiFormHelperText-root",
  },

  // Registration (Container)
  registration: {
    form: "[data-testid='registration-form']",
    back: "[data-testid='registration-back']",
    next: "[data-testid='registration-next'], button:contains('Next')",
    submit: "[data-testid='registration-submit']",
    toLogin:
      "[data-testid='registration-to-login'], button:contains('Login'), [aria-label='Return to login page']",
    firstName: "[data-testid='registration-firstName']",
    lastName: "[data-testid='registration-lastName']",
    email: "[data-testid='registration-email']",
    phone: "[data-testid='registration-phone']",
    password: "[data-testid='registration-password']",
    companyName: "#registration-company-name-input",
    registrationNumber: "[data-testid='registration-registrationNumber']",
    description: "[data-testid='registration-description']",
    streetAddress: "[data-testid='registration-street-address']",
    companyForm: "#company-info-form",
  },

  // Forgot password (Container)
  forgotPassword: {
    form: "[data-testid='forgot-password-form']",
    email: "[data-testid='forgot-password-email'], input[name='email']",
    /** Scoped to test id only — generic form submit matches login after wrongful redirect */
    submit: "[data-testid='forgot-password-submit']",
    toLogin:
      "[data-testid='forgot-password-to-login'], [aria-label='Return to login page'], button:contains('Login')",
    resetPasswordForm: "[data-testid='reset-password-form']",
    validationError: ".MuiFormHelperText-root[role='alert'], .MuiFormHelperText-root",
  },

  // Welcome / home
  welcome: {
    loginLink:
      "[data-testid='login-link'], a[href*='login'], button:contains('Get Started')",
    /** Present when `REACT_APP_SHOW_FIRST_VISIT_DIALOG=true` (same flag as first-visit sheet). */
    downloadAppsLink: "[data-testid='welcome-download-apps-link']",
  },

  /** First-visit download bottom sheet (KivuIMSUIContainerApp FirstVisitDownloadDialog) */
  firstVisitDownload: {
    notNow: "[data-testid='first-visit-download-not-now']",
    viewMore: "[data-testid='first-visit-download-view-more']",
  },

  /** Public info pages (About, FAQ, Contact, User guide) and floating actions */
  publicInfo: {
    fabFaq: "[data-testid='public-info-fab-faq']",
    fabContact: "[data-testid='public-info-fab-contact']",
    fabAbout: "[data-testid='public-info-fab-about']",
    fabUserGuide: "[data-testid='public-info-fab-user-guide']",
    /** Prefer data-testid when deployed; fall back to visible h1 on public marketing pages. */
    pageTitle: (testId: string) => `[data-testid='${testId}'], h1`,
    faqIngressUserGuide:
      "[data-testid='faq-ingress-user-guide'], a[href*='user-guide']",
    faqIngressAbout:
      "[data-testid='faq-ingress-about'], #faq-what-is-fms-content a[href*='about']",
    faqWhatIsFmsHeader: "#faq-what-is-fms-header",
  },

  /** Public /download-apps page (desktop installer cards) */
  downloadApps: {
    windowsLink: "[data-testid='download-apps-windows-link']",
    macLink: "[data-testid='download-apps-mac-link']",
    /** Store URLs when listed; until then cards show “coming soon” copy only. */
    androidLink: "[data-testid='download-apps-android-link']",
    iosLink: "[data-testid='download-apps-ios-link']",
    androidCard: "[data-testid='download-apps-android-card']",
    iosCard: "[data-testid='download-apps-ios-card']",
  },

  // App shell / layout
  appShell: "[data-testid='app-shell']",
  sidebar:
    "[data-testid='sidebar-drawer'], [data-testid='app-sidebar'], .MuiDrawer-root",

  // Sidebar nav items (data-testid from SidebarConfig)
  sidebarNav: {
    dashboard: "[data-testid='sidebar-nav-dashboard']",
    inventoryProducts: "[data-testid='sidebar-nav-inventory-products']",
    inventoryCategories: "[data-testid='sidebar-nav-inventory-categories']",
    /** Sidebar label "Orders"; links to sales order list (`/orders/sales`). */
    orders: "[data-testid='sidebar-nav-orders-sales']",
    finance: "[data-testid='sidebar-nav-finance']",
    financePayments: "[data-testid='sidebar-nav-finance-payments']",
    financeInvoices: "[data-testid='sidebar-nav-finance-invoices']",
    financeReceipts: "[data-testid='sidebar-nav-finance-receipts']",
    profile: "[data-testid='sidebar-nav-profile']",
    /** Company admin: store list + detail routes */
    stores: "[data-testid='sidebar-nav-stores']",
    company: "[data-testid='sidebar-nav-company']",
    store: "[data-testid='sidebar-nav-store']",
  },

  // Inventory / Product MFE
  product: {
    addButton:
      "[data-testid='add-product-btn'], button:contains('Add New Product'), button:contains('Add Product')",
    addModal: "[data-testid='add-product-modal'], [role='dialog']",
    addForm: "#add-product-form",
    productNameInput: "[data-testid='product-name-input']",
    addSubmit: "[data-testid='add-product-submit']",
    listToolbar: "[data-testid='product-list-toolbar']",
    /** Filters popover: product name partial match (server-side, resets to page 0). */
    listFilterNameInput: "[data-testid='product-list-filter-name']",
    listTable: "[data-testid='product-list-table']",
    /** Company-admin catalog filter on product list (not rendered for store-scoped roles). */
    companyAdminStoreSelect:
      "[data-testid='company-admin-inventory-store-select']",
    listViewBtn: "[data-testid='product-list-view-btn']",
    /** ProductView: delete slot; contains a button only after useHasActiveProductItems finishes. */
    detailDeleteSlot: "[data-testid='product-detail-delete-slot']",
    /** ProductView root `Tabs`; falls back to `aria-label` if MFE not rebuilt yet. */
    tabList:
      "[data-testid='product-view-tabs'], [aria-label='Product tabs']",
    tabDetails: "[data-testid='product-tab-details']",
    tabItems: "[data-testid='product-tab-items']",
    /** ProductView: Product Items tabpanel (mounts only when that tab is selected). */
    tabItemsPanel: "#product-tabpanel-1",
    itemListAddBtn: "[data-testid='product-item-list-add-btn']",
    addItemModal: "[data-testid='add-product-item-modal']",
    addItemSubmit: "[data-testid='add-product-item-submit']",
    addItemForm: "#add-product-item-form",
    validationError: "[data-testid='add-product-validation-error'], .MuiFormHelperText-root",
  },

  // Orders MFE
  salesOrder: {
    createButton:
      "[data-testid='sales-order-toolbar-create-btn'], [data-testid='create-sales-order-btn'], button:contains('New Order'), button:contains('Create Sales Order')",
    modal: "[data-testid='create-sales-order-modal']",
    modalTitle: "[data-testid='create-sales-order-modal-title']",
    modalClose: "[data-testid='create-sales-order-modal-close']",
    modalSubmit: "[data-testid='create-sales-order-submit']",
    modalCancel: "[data-testid='create-sales-order-cancel']",
    listTable: "[data-testid='sales-order-list-table']",
    openDetailButton: "[data-testid='sales-order-open-detail']",
    detailRoot: "[data-testid='sales-order-detail']",
    detailOrderNumber: "[data-testid='sales-order-detail-order-number']",
    detailStatus: "[data-testid='sales-order-detail-status']",
    detailEditOrder:
      "[data-testid='sales-order-btn-edit-order'], button:contains('Edit Order')",
    detailIssueInvoice:
      "[data-testid='sales-order-btn-issue-invoice'], button:contains('Issue Invoice')",
    detailRecordPayment:
      "[data-testid='sales-order-btn-record-payment'], button:contains('Record Payment')",
    detailConfirmOrder:
      "[data-testid='sales-order-btn-confirm-order'], button:contains('Confirm Order')",
    detailCompleteOrder:
      "[data-testid='sales-order-btn-complete-order'], button:contains('Complete Order')",
    detailCancelOrder:
      "[data-testid='sales-order-btn-cancel-order'], button:contains('Cancel Order')",
    detailAddItems:
      "[data-testid='sales-order-btn-add-items'], button:contains('Add items')",
    detailDelete:
      "[data-testid='sales-order-btn-delete'], button:contains('Delete')",
    detailPrintOrder:
      "[data-testid='sales-order-btn-print-order'], button:contains('Print Order')",
    detailBarcodeInput: "[data-testid='sales-order-barcode-input']",
    detailBarcodeAddItem:
      "[data-testid='sales-order-btn-barcode-add-item'], button:contains('Add Item')",
    lineEditQuantity: "[data-testid='sales-order-line-btn-edit-quantity']",
    lineRemove: "[data-testid='sales-order-line-btn-remove']",
    linkViewInvoice:
      "[data-testid='sales-order-link-view-invoice'], a:contains('View Invoice')",
    linkViewReceipt: "[data-testid='sales-order-link-view-receipt']",
    /** AddSalesOrderModal: ListStores finished — store Select is mounted (not loading placeholder). */
    addModalStoresLoading: "[data-testid='add-sales-order-stores-loading']",
    addModalStoreSelect: "[data-testid='add-sales-order-store-select']",
  },

  // Admin portal (separate base URL; paths under /dashboard)
  admin: {
    usersPage: "[data-testid='admin-users-page']",
    usersTable: "[data-testid='admin-users-table']",
    userDetailPage: "[data-testid='admin-user-detail-page']",
  },

  // Membership MFE
  membership: {
    selectPlanButton:
      "[data-testid='select-plan-btn'], button:contains('Select plan')",
    planCard: "[data-testid='plan-card'], .MuiCard-root",
    browsePlansButton:
      "[data-testid='browse-plans-btn'], button:contains('Browse Plans')",
    orderSummary: "[data-testid='order-summary']",
    noPlanSelected:
      "[data-testid='no-plan-selected'], [data-testid='browse-plans-btn'], button:contains('Browse Plans')",
  },

  // Dialogs (MUI)
  dialog: "[role='dialog']",
  dialogClose: "[data-testid='dialog-close'], button[aria-label='close']",

  // Content areas (stable structure)
  mainContent: "main, [role='main'], .MuiContainer-root",
  productListArea: "[data-testid='product-list'], main, [role='main'], .MuiContainer-root",
  orderListArea: "[data-testid='order-list'], main, [role='main'], .MuiContainer-root",
  planListArea:
    "[data-testid='plan-list'], [data-testid='plan-card'], .MuiContainer-root, .MuiCard-root, .MuiGrid-root, .MuiPaper-root, main, [role='main'], article, section",

  // Profile page (Container) — scope tabs under profile-tabs (same ids exist on Company route)
  profile: {
    tabs: "[data-testid='profile-tabs']",
    tab: (index: number) =>
      `[data-testid='profile-tabs'] #profile-tab-${index}`,
    tabPanel: (index: number) => `#profile-tabpanel-${index}`,
    viewCard: "[data-testid='profile-view-card']",
    editButton: "[data-testid='profile-edit-button']",
    editModal: "[data-testid='profile-edit-modal']",
    passwordCard: "[data-testid='profile-password-card']",
    passwordForm: "[data-testid='profile-password-form']",
    passwordSubmit: "[data-testid='profile-password-submit']",
    passwordInputCurrent: "input[name='currentPassword']",
    passwordInputNew: "input[name='newPassword']",
    passwordInputConfirm: "input[name='confirmPassword']",
  },

  // Company page (Container) — CompanyProfile uses profile-tab-N / profile-tabpanel-N (see CompanyProfile.tsx).
  // Prefer these over data-testid on <Tab>: staging may lag deploys, and MUI Tab may not surface test ids as expected.
  company: {
    tabs: "[data-testid='company-tabs']",
    /** Tabs live inside company-tabs; scope avoids matching profile-tab ids on other routes. */
    tab: (index: number) => `[data-testid='company-tabs'] #profile-tab-${index}`,
    tabPanel: (index: number) => `#profile-tabpanel-${index}`,
    viewCard: "[data-testid='company-view-card']",
    editButton: "[data-testid='company-edit-button']",
    editModalContent: "[data-testid='company-edit-modal-content']",
    editForm: "[data-testid='company-edit-form']",
    employeeList: "[data-testid='company-employee-list']",
    storeList: "[data-testid='company-store-list']",
    subscriptions: "[data-testid='company-subscriptions']",
    subscriptionsViewButton: "[data-testid='company-subscriptions-view-button']",
  },
} as const;
