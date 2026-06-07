import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

// The roles we know are NOT allowed to edit global Company/Store setups
const RESTRICTED_ROLES = ["clerk", "analyst"] as const;

RESTRICTED_ROLES.forEach((userKey) => {
  describe(`Container: RBAC Negative Path (${userKey})`, () => {
    it("verify restricted roles cannot access administrative functionality", () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();

      // 1. Check Sidebar Missing Navigations
      // Clerk and Analyst should not see 'Company' or 'Stores' management in the sidebar
      cy.get("body").should(($body) => {
        expect($body.find(SELECTORS.sidebarNav.company).length, "Company nav should not exist").to.eq(0);
        expect($body.find(SELECTORS.sidebarNav.stores).length, "Stores nav should not exist").to.eq(0);
      });

      // 2. Direct Navigation Guard
      // Try to navigate directly to a company page. Frontend should stop it or backend throws 403.
      cy.visitMfe(`${ROUTES.portal}/company`);
      cy.get("body").then(($body) => {
        // Assert that the page is either empty (guarded) or explicitly shows an error about auth
        const showsError = $body.text().toLowerCase().includes("not authorized") || 
                           $body.text().toLowerCase().includes("access denied") ||
                           $body.text().toLowerCase().includes("page not found");
        
        // Assert we are not actually seeing the company details view.
        expect($body.find(SELECTORS.company.viewCard).length, "Company details should perfectly hide").to.eq(0);
      });

      // 3. Ensure "Add Employee", "Edit Company" action buttons are completely absent everywhere
      cy.get("body").should(($body) => {
        expect($body.find("button:contains('Add Employee')").length, "Should not see add employee button").to.eq(0);
        expect($body.find("button:contains('Edit Company')").length, "Should not see edit company button").to.eq(0);
      });
    });
  });
});
