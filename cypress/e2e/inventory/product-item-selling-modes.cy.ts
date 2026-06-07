import {
  assertItemListShowsContent,
  createProductViaModal,
  fillAddProductItemForm,
  MEASURED_BASE_UNITS,
  openProductDetailByName,
  openProductItemsTabAndAddItemModal,
  submitAddProductItemAndAssertClosed,
  visitProductsAsStoreAdmin,
} from "../../support/inventory/productItemSellingModeHelpers";

/**
 * Store admin: for each selling mode (and each MEASURED base unit), create a catalog product
 * and add one product item — verifies Add Product + Add Product Item for every allowed combination.
 *
 * SINGLE_ITEM / UNIT_BASED: base unit is fixed to UNIT in the UI (no per-unit matrix).
 * MEASURED: one product per base unit from MEASURED_BASE_UNITS (unit inherited on add-item form).
 */
describe("Inventory: Product items by selling mode (storeAdmin)", () => {
  beforeEach(() => {
    visitProductsAsStoreAdmin();
  });

  it("SINGLE_ITEM: add product item (quantity locked to 1)", () => {
    const name = `E2E SM SINGLE ${Date.now()}`;
    createProductViaModal({ name, sellingMode: "SINGLE_ITEM" });
    openProductDetailByName(name);
    openProductItemsTabAndAddItemModal();
    fillAddProductItemForm({});
    submitAddProductItemAndAssertClosed();
    assertItemListShowsContent();
  });

  it("UNIT_BASED: add product item with countable quantity", () => {
    const name = `E2E SM UNIT ${Date.now()}`;
    createProductViaModal({ name, sellingMode: "UNIT_BASED" });
    openProductDetailByName(name);
    openProductItemsTabAndAddItemModal();
    fillAddProductItemForm({ totalQuantity: "4" });
    submitAddProductItemAndAssertClosed();
    assertItemListShowsContent();
  });

  MEASURED_BASE_UNITS.forEach((baseUnit) => {
    it(`MEASURED + ${baseUnit}: add product item`, () => {
      const name = `E2E SM M ${baseUnit} ${Date.now()}`;
      createProductViaModal({
        name,
        sellingMode: "MEASURED",
        baseUnit,
      });
      openProductDetailByName(name);
      openProductItemsTabAndAddItemModal();
      fillAddProductItemForm({ totalQuantity: "2.5" });
      submitAddProductItemAndAssertClosed();
      assertItemListShowsContent();
    });
  });
});
