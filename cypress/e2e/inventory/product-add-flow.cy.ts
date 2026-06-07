/**
 * Tests Add Product flow: open modal, validation, fill required fields and submit.
 * Uses data-testid / id / classes; UI should add add-product-btn, add-product-modal, product-name-input, add-product-submit.
 */
import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

const ALLOWED_ROLES = ["admin", "storeAdmin"] as const;

ALLOWED_ROLES.forEach((userKey) => {
  describe(`Inventory: Add product flow (${userKey})`, () => {
    it("exercises the full Add Product modal flow: open, validate, fill, and submit", () => {
      // Login and Setup sequence
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);
      cy.clickSidebarProducts();

      // 1. Open the Action Modal
      cy.get(SELECTORS.product.addButton, { timeout: 15000 }).first().click();
      cy.get(`${SELECTORS.product.addModal}, ${SELECTORS.dialog}`, { timeout: 15000 }).should("be.visible");
      cy.get(`${SELECTORS.product.addForm}, form`).should("exist");

      // 2. Attempt empty submit to verify required validators trigger
      cy.get(`${SELECTORS.product.addSubmit}, button[type='submit']`).first().click();
      cy.get(SELECTORS.product.validationError).should("exist");

      // 3. Fill basic textual fields
      const productName = `E2E Product ${Date.now()}`;
      cy.get("input[name='name']").first().as('nameInput').clear();
      cy.get('@nameInput').type(productName);
      cy.get("input[name='brandName']").as('brandInput').clear();
      cy.get('@brandInput').type("Kivu E2E Automation Brand");
      cy.get("textarea[name='description']").as('descInput').clear();
      cy.get('@descInput').type("Automated layout validation payload description.");

      // 4. Select Store (Required for Company Admin only)
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="add-product-store-select"]').length > 0) {
          cy.get('[data-testid="add-product-store-select"]')
            .find('[role="combobox"]')
            .should('not.have.attr', 'aria-disabled', 'true')
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
      });

      // 5. Select Supplier (Wait for the API to un-disable the field)
      cy.get('[data-testid="add-product-supplier-select"]')
        .find('[role="combobox"]', { timeout: 20000 })
        .should('not.have.attr', 'aria-disabled', 'true')
        .click({ force: true });
      cy.get("[role='listbox']", { timeout: 15000 }).should("be.visible");
      cy.get("[role='listbox'] [role='option']:not([aria-disabled='true'])")
        .should("have.length.at.least", 1)
        .then(($opts) => {
          const i = $opts.length > 1 ? 1 : 0;
          cy.wrap($opts.eq(i)).click({ force: true });
        });
      cy.get("[role='listbox']").should("not.exist");

      // 6. Select Category
      cy.get("input[name='categoryId']")
        .siblings('[role="combobox"]')
        .should('not.have.attr', 'aria-disabled', 'true')
        .click({ force: true });
      cy.get("[role='listbox']", { timeout: 15000 }).should("be.visible");
      cy.get("[role='listbox'] [role='option']:not([aria-disabled='true'])")
        .should("have.length.at.least", 1)
        .then(($opts) => {
          const i = $opts.length > 1 ? 1 : 0;
          cy.wrap($opts.eq(i)).click({ force: true });
        });
      cy.get("[role='listbox']").should("not.exist");

      // 7. Push fully assembled payload
      cy.get(`${SELECTORS.product.addSubmit}, button[type='submit']`).first().should('be.enabled').click();
      
      // Verification: Action resolves and destroys modal wrapper
      cy.get(SELECTORS.dialog, { timeout: 20000 }).should("not.exist");
    });
  });
});
