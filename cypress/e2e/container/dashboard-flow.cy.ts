import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.forEach((userKey) => {
  describe(`Dashboard & Portal Default Routing Flow (${userKey})`, () => {
    beforeEach(() => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.portal);
      cy.waitForAppReady();
      
      cy.get("body", { timeout: 60000 }).should(($body) => {
        const bouncedToLogin = $body.find(SELECTORS.login.form).length > 0;
        const hasPortalContent = $body.find('[data-testid="app-shell"], [data-testid="sidebar-drawer"], .MuiDrawer-root').length > 0;
        expect(
          bouncedToLogin || hasPortalContent,
          "authorize settled: login form or portal content"
        ).to.be.true;
      });

      cy.url().then((href) => {
        if (href.includes("/login")) {
          cy.log("Bounced to login after waitForAppReady; revisiting portal with same session");
          cy.visitMfe(ROUTES.portal);
          cy.waitForAppReady();
        }
      });
    });

    it("evaluates portal shell behavior and dashboard mounting capabilities correctly per role", () => {
      // Admins should land explicitly on the Analytics Dashboard
      if (userKey === "admin" || userKey === "storeAdmin") {
        cy.contains("h4", "Dashboard", { timeout: 30000 }).should("be.visible");
        
        // Drive through all 8 core analytics widgets/accordions safely
        const expectedWidgets = [
          "Subscription",
          "Stores",
          "Employees",
          "Suppliers",
          "Customers",
          "Products",
          "Categories",
          "Product items by state"
        ];

        expectedWidgets.forEach((widget) => {
           cy.get('.MuiAccordionSummary-root')
             .contains(widget, { matchCase: false })
             .scrollIntoView()
             .should('be.visible')
             .then(($el) => {
               if (!$el.hasClass('Mui-expanded')) {
                 cy.wrap($el).click();
               }
             });
        });
      } 
      // Clerks and Analysts lack analytics clearance. Test that the dashboard refuses to mount.
      else {
         // Assert that the dashboard UI is completely inaccessible to these roles
         cy.contains("h4", "Dashboard").should('not.exist');
      }
    });
  });
});
