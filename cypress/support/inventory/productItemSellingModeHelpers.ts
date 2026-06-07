import { ROUTES } from "../commands";
import { SELECTORS } from "../selectors";

/** Mirrors `MEASURED_UNITS` in Product MFE `sellingModeUtils.ts` (wire = GraphQL enum name). */
export const MEASURED_BASE_UNITS = [
  "G",
  "KG",
  "ML",
  "L",
  "CM",
  "M",
  "MM",
  "SQCM",
  "OZ",
  "LB",
  "BOTTLE",
] as const;

const ADD_FORM = SELECTORS.product.addForm;

/**
 * MUI TextField `select`: open the visible control — same pattern as category in
 * `product-add-flow.cy.ts` (`input[name=…].siblings('[role="combobox"]')`).
 * Clicking `.MuiInputBase-root` often does not open the menu (no listbox).
 */
export function pickSelectByInputName(fieldName: string, dataValue: string) {
  cy.get(`${ADD_FORM} input[name="${fieldName}"]`, { timeout: 20000 })
    .should("exist")
    .then(($input) => {
      const $sib = $input.siblings('[role="combobox"]');
      if ($sib.length > 0) {
        cy.wrap($sib.first())
          .scrollIntoView()
          .should("be.visible")
          .click({ force: true });
      } else {
        cy.wrap($input)
          .closest(".MuiInputBase-root")
          .find('[role="combobox"]')
          .first()
          .scrollIntoView()
          .should("be.visible")
          .click({ force: true });
      }
    });
  cy.get("[role='listbox']", { timeout: 20000 }).should("be.visible");
  cy.get(`[role="option"][data-value="${dataValue}"]`)
    .should("be.visible")
    .click();
  cy.get("[role='listbox']").should("not.exist");
}

export function pickSupplierAndCategory() {
  cy.get('[data-testid="add-product-supplier-select"]')
    .find('[role="combobox"]', { timeout: 20000 })
    .should("not.have.attr", "aria-disabled", "true")
    .click({ force: true });
  cy.get("[role='listbox']", { timeout: 15000 }).should("be.visible");
  cy.get("[role='listbox'] [role='option']:not([aria-disabled='true'])")
    .should("have.length.at.least", 1)
    .then(($opts) => {
      const i = $opts.length > 1 ? 1 : 0;
      cy.wrap($opts.eq(i)).click({ force: true });
    });
  cy.get("[role='listbox']").should("not.exist");

  cy.get("input[name='categoryId']")
    .siblings('[role="combobox"]')
    .should("not.have.attr", "aria-disabled", "true")
    .click({ force: true });
  cy.get("[role='listbox']", { timeout: 15000 }).should("be.visible");
  cy.get("[role='listbox'] [role='option']:not([aria-disabled='true'])")
    .should("have.length.at.least", 1)
    .then(($opts) => {
      const i = $opts.length > 1 ? 1 : 0;
      cy.wrap($opts.eq(i)).click({ force: true });
    });
  cy.get("[role='listbox']").should("not.exist");
}

export function visitProductsAsStoreAdmin() {
  cy.loginAs("storeAdmin");
  cy.visitMfe(ROUTES.portal);
  cy.waitForAppReady();
  cy.assertSidebarNavForPortalUser("storeAdmin");
  cy.clickSidebarProducts();
}

/**
 * Create catalog product; for MEASURED pass `baseUnit` (must match `MEASURED_BASE_UNITS`).
 */
export function createProductViaModal(opts: {
  name: string;
  sellingMode: "SINGLE_ITEM" | "UNIT_BASED" | "MEASURED";
  baseUnit?: string;
}) {
  cy.get(SELECTORS.product.addButton, { timeout: 20000 }).first().click();
  cy.get(SELECTORS.product.addModal, { timeout: 15000 }).should("be.visible");
  cy.get(SELECTORS.product.addForm).should("exist");

  cy.get(SELECTORS.product.productNameInput, { timeout: 10000 })
    .should("be.visible")
    .should("be.enabled");
  cy.get(SELECTORS.product.productNameInput).click({ force: true });
  cy.get(SELECTORS.product.productNameInput).should("be.enabled").clear();
  cy.get(SELECTORS.product.productNameInput)
    .should("be.enabled")
    .type(opts.name);
  pickSelectByInputName("sellingMode", opts.sellingMode);
  cy.get(`${ADD_FORM} input[name="sellingMode"]`, { timeout: 10000 }).should(
    "have.value",
    opts.sellingMode
  );

  if (opts.sellingMode === "MEASURED" && opts.baseUnit) {
    cy.get(`${ADD_FORM} input[name="baseUnit"]`, { timeout: 15000 })
      .closest(".MuiInputBase-root")
      .should("not.have.class", "Mui-disabled");
    pickSelectByInputName("baseUnit", opts.baseUnit);
    cy.get(`${ADD_FORM} input[name="baseUnit"]`, { timeout: 10000 }).should(
      "have.value",
      opts.baseUnit
    );
  }

  pickSupplierAndCategory();

  cy.get("input[name='brandName']", { timeout: 10000 })
    .should("be.visible")
    .should("be.enabled");
  cy.get("input[name='brandName']").click({ force: true });
  cy.get("input[name='brandName']").should("be.enabled").clear();
  cy.get("input[name='brandName']")
    .should("be.enabled")
    .type("E2E SellingMode Brand");
  
  cy.get("textarea[name='description']", { timeout: 10000 })
    .should("be.visible")
    .should("be.enabled");
  cy.get("textarea[name='description']").click({ force: true });
  cy.get("textarea[name='description']").should("be.enabled").clear();
  cy.get("textarea[name='description']")
    .should("be.enabled")
    .type(
      `E2E selling-mode matrix — ${opts.sellingMode}${opts.baseUnit ? ` / ${opts.baseUnit}` : ""}.`
    );

  cy.get(SELECTORS.product.addSubmit).should("be.enabled").click();
  cy.get(SELECTORS.product.addModal, { timeout: 60000 }).should("not.exist");
}

/**
 * Uses catalog **Filters → Name** (server-side partial match, page 0) so the row is not
 * missed when the list is paginated after many E2E-created products.
 */
export function applyProductListNameFilter(nameQuery: string) {
  cy.get(SELECTORS.product.listTable, { timeout: 30000 }).should("exist");
  cy.contains("button", /filters/i).first().click();
  cy.get(SELECTORS.product.listFilterNameInput, { timeout: 15000 })
    .should("be.visible")
    .closest(".MuiPopover-paper")
    .within(() => {
      cy.get(SELECTORS.product.listFilterNameInput)
        .should("be.enabled")
        .click()
        .clear();
      cy.get(SELECTORS.product.listFilterNameInput)
        .should("be.enabled")
        .type(nameQuery, { parseSpecialCharSequences: false });
      cy.contains("button", /^apply$/i).click();
    });
  // Do not use global `.MuiPopover-paper` not.exist — other MUI layers can keep papers mounted.
  // Field may unmount or stay hidden; require no *visible* filter input.
  cy.get("body", { timeout: 25000 }).should(($body) => {
    const anyVisible = $body
      .find(SELECTORS.product.listFilterNameInput)
      .toArray()
      .some((el) => Cypress.dom.isVisible(el));
    expect(anyVisible, "product list name filter popover closed").to.be.false;
  });
  cy.get(SELECTORS.product.listTable, { timeout: 45000 })
    .should("exist")
    .scrollIntoView({ block: "center", inline: "center" });
}

export function openProductDetailByName(productName: string) {
  applyProductListNameFilter(productName);
  cy.contains("tbody tr", productName, { timeout: 45000 }).within(() => {
    cy.get(SELECTORS.product.listViewBtn).click();
  });
  cy.url({ timeout: 25000 }).should(
    "match",
    /\/inventory\/products\/[^/?#]+/
  );
}

export function openProductItemsTabAndAddItemModal() {
  cy.get(SELECTORS.product.tabDetails, { timeout: 20000 }).should(
    "be.visible"
  );
  cy.get(SELECTORS.product.detailDeleteSlot, { timeout: 30000 })
    .find("button")
    .should("be.visible");
  cy.selectProductViewItemsTab();
  cy.get(SELECTORS.product.tabItemsPanel, { timeout: 30000 }).should("exist");
  cy.get(SELECTORS.product.tabItemsPanel).scrollIntoView({ block: "center" });
  cy.get(SELECTORS.product.tabItemsPanel).within(() => {
    cy.get(SELECTORS.product.itemListAddBtn, { timeout: 25000 })
      .should("be.visible")
      .click({ force: true });
  });
  cy.get(SELECTORS.product.addItemModal, { timeout: 20000 }).should(
    "be.visible"
  );
}

/**
 * Fill pricing; set total quantity only when the field is editable (UNIT_BASED / MEASURED).
 */
export function fillAddProductItemForm(opts: { totalQuantity?: string }) {
  cy.get(SELECTORS.product.addItemForm).within(() => {
    cy.get("input[name='totalQuantity']").then(($input) => {
      const editable =
        $input.length &&
        $input.is(":enabled") &&
        !$input.prop("readOnly");
      if (editable && opts.totalQuantity != null) {
        cy.wrap($input).click({ force: true });
        cy.get("input[name='totalQuantity']").should("be.enabled").clear();
        cy.get("input[name='totalQuantity']").should("be.enabled").type(opts.totalQuantity);
      }
    });
    cy.get("input[name='purchasePrice']").then(($input) => {
      if ($input.length && $input.is(":enabled")) {
        cy.wrap($input).click({ force: true });
        cy.get("input[name='purchasePrice']").should("be.enabled").clear();
        cy.get("input[name='purchasePrice']").should("be.enabled").type("88");
      }
    });
    cy.get("input[name='salesPrice']").then(($input) => {
      if ($input.length && $input.is(":enabled")) {
        cy.wrap($input).click({ force: true });
        cy.get("input[name='salesPrice']").should("be.enabled").clear();
        cy.get("input[name='salesPrice']").should("be.enabled").type("130");
      }
    });
    cy.get("input[name='minSalesPrice']").then(($input) => {
      if ($input.length && $input.is(":enabled")) {
        cy.wrap($input).click({ force: true });
        cy.get("input[name='minSalesPrice']").should("be.enabled").clear();
        cy.get("input[name='minSalesPrice']").should("be.enabled").type("95");
      }
    });
  });
}

export function submitAddProductItemAndAssertClosed() {
  cy.get(SELECTORS.product.addItemSubmit).click();
  cy.get(SELECTORS.product.addItemModal, { timeout: 60000 }).should(
    "not.exist"
  );
}

export function assertItemListShowsContent() {
  cy.get(SELECTORS.product.tabItemsPanel, { timeout: 20000 }).within(() => {
    cy.root().then(($root) => {
      const rows = $root.find("tbody tr").length;
      const svgs = $root.find("svg").length;
      expect(
        rows > 0 || svgs > 0,
        "expected at least one item row or QR graphic in tab panel"
      ).to.be.true;
    });
  });
}
