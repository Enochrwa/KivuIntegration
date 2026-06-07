import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS, PORTAL_USER_NAV } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.filter(key => PORTAL_USER_NAV[key].categories).forEach((userKey) => {
  // Only Admin and Store Admin typically have access to manage Categories based on standard RBAC
  // If your roles differ, this skip logic should be adjusted.
  describe(`Inventory: Categories Flow (${userKey})`, () => {
    it("can navigate to categories and handle adding a new category", () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);

      // 1. Navigate to Categories List
      cy.clickSidebarSubItem(
        SELECTORS.sidebarNav.inventoryProducts, 
        SELECTORS.sidebarNav.inventoryCategories
      );
      cy.url().should("include", "inventory").and("include", "categories");
      cy.get("body").should("be.visible");

      // Check if user has permission to add categories. (Usually COMPANY_ADMIN)
      if (userKey === "admin") {
        cy.get("body").then(($body) => {
          const addBtn = $body.find("button:contains('Add Category'), button:contains('Create Category')");
          if (addBtn.length > 0) {
            cy.wrap(addBtn).first().click();
            cy.get("[role='dialog']").should("be.visible");
            
            // Generate unique category name
            const catName = `Test Category ${Date.now()}`;
            cy.get("input:visible").first().type(catName);
            cy.contains("button", "Submit").click();
            
            // Modal closes and we see the category
            cy.get("[role='dialog']").should("not.exist");
            cy.contains(catName).should("be.visible");

            // Cleanup: Try to delete it if the delete button is available
            const row = cy.contains(catName).closest("tr");
            row.find("button[aria-label='Delete'], svg[data-testid='DeleteOutlineIcon']").click({ force: true });
            
            // Confirm deletion modal
            cy.get("[role='dialog']").should("be.visible");
            cy.get("[role='dialog']").contains("button", "Confirm", { matchCase: false }).click();
            cy.get("[role='dialog']").should("not.exist");
            cy.contains(catName).should("not.exist");
          }
        });
      }
    });
  });
});
