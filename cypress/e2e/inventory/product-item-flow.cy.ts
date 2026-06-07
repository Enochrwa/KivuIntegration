import { ROUTES } from "../../support/commands";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.filter((userKey) => userKey !== "analyst").forEach(
  (userKey) => {
    describe(`Inventory: Product Items Flow (${userKey})`, () => {
      it("can navigate to product items, open the add modal, and view QR codes", () => {
        cy.loginAs(userKey);
        cy.visitMfe(ROUTES.portal);
        cy.waitForAppReady();
        cy.assertSidebarNavForPortalUser(userKey);

        cy.clickSidebarProducts();

        cy.get(SELECTORS.product.listTable, { timeout: 25000 }).should("exist");
        cy.get(`${SELECTORS.product.listTable} tbody tr`, {
          timeout: 25000
        }).should("have.length.at.least", 1);

        cy.get(SELECTORS.product.listViewBtn).first().click();

        cy.url({ timeout: 25000 }).should(
          "match",
          /\/inventory\/products\/[^/?#]+/
        );

        // After product load, Delete mounts when useHasActiveProductItems finishes; until then
        // the tab row can re-render. Items tabpanel only mounts when tab state is 1 — see helper.
        cy.get(SELECTORS.product.tabDetails, { timeout: 20000 }).should(
          "be.visible"
        );
        cy.get(SELECTORS.product.detailDeleteSlot, { timeout: 30000 })
          .find("button")
          .should("be.visible");
        cy.selectProductViewItemsTab();

        cy.get(SELECTORS.product.tabItemsPanel, { timeout: 30000 }).should(
          "exist"
        );
        cy.get(SELECTORS.product.tabItemsPanel).scrollIntoView({
          block: "center",
        });

        cy.get(SELECTORS.product.tabItemsPanel).within(() => {
          cy.get(SELECTORS.product.itemListAddBtn, { timeout: 25000 })
            .should("be.visible")
            .click({ force: true });
        });

        cy.get(SELECTORS.product.addItemModal, { timeout: 15000 }).should(
          "be.visible"
        );

        cy.get(SELECTORS.product.addItemForm).within(() => {
          cy.get("input[name='totalQuantity']").then(($input) => {
            const editable =
              $input.length &&
              $input.is(":enabled") &&
              !$input.prop("readOnly");
            if (editable) {
              cy.wrap($input).click().clear();
              cy.get("input[name='totalQuantity']").should("be.enabled").type("5");
            }
          });
          cy.get("input[name='purchasePrice']").then(($input) => {
            if (
              $input.length &&
              $input.is(":enabled") &&
              !$input.prop("readOnly")
            ) {
              cy.wrap($input).click().clear();
              cy.get("input[name='purchasePrice']").should("be.enabled").type("100");
            }
          });
          cy.get("input[name='salesPrice']").then(($input) => {
            if (
              $input.length &&
              $input.is(":enabled") &&
              !$input.prop("readOnly")
            ) {
              cy.wrap($input).click().clear();
              cy.get("input[name='salesPrice']").should("be.enabled").type("150");
            }
          });
          cy.get("input[name='minSalesPrice']").then(($input) => {
            if (
              $input.length &&
              $input.is(":enabled") &&
              !$input.prop("readOnly")
            ) {
              cy.wrap($input).click().clear();
              cy.get("input[name='minSalesPrice']").should("be.enabled").type("120");
            }
          });
        });

        cy.get(SELECTORS.product.addItemSubmit).click();
        cy.get(SELECTORS.product.addItemModal, { timeout: 60000 }).should(
          "not.exist"
        );

        cy.get(SELECTORS.product.tabItemsPanel, { timeout: 15000 }).within(
          () => {
            cy.get("svg").should("have.length.at.least", 1);
          }
        );
      });
    });
  }
);

describe("Inventory: Product Items Flow (analyst)", () => {
  it("shows access denied on products list and no catalog rows", () => {
    cy.loginAs("analyst");
    cy.visitMfe(ROUTES.portal);
    cy.waitForAppReady();
    cy.assertSidebarNavForPortalUser("analyst");

    // Direct visit: sidebar click can settle on `.../inventory` (no `/products` segment)
    // while still rendering the catalog MFE default route — same UI as list.
    cy.visitMfe(ROUTES.inventoryProducts);
    cy.waitForAppReady();

    cy.get(SELECTORS.product.addButton, { timeout: 30000 }).should(
      "be.visible"
    );

    cy.contains(/access denied/i, { timeout: 25000 }).should("be.visible");
    cy.contains(/no products found/i).should("be.visible");

    cy.get(SELECTORS.product.listTable).should("not.exist");
    cy.get(SELECTORS.product.listViewBtn).should("not.exist");
  });
});
