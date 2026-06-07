import { SELECTORS } from "./selectors";

const scrollTabsStrip = () => {
  cy.get(SELECTORS.profile.tabs, { timeout: 20000 })
    .should("exist")
    .scrollIntoView({ block: "center", inline: "center" });
};

/**
 * UserProfile mounts `#profile-tabpanel-N` only when `tab === N`.
 * - Do not use `be.visible` on the tabs root: app shell `overflow` clips it in Cypress.
 * - Prefer native `HTMLElement.click()` in a retrying `should` so MUI `onChange` runs; after
 *   modals, one `force` click fallback can finish selection when focus/scroll is odd.
 */
export function selectUserProfileTab(index: number) {
  scrollTabsStrip();

  const tabSel = SELECTORS.profile.tab(index);

  cy.get(tabSel, { timeout: 20000 })
    .should("exist")
    .scrollIntoView({ block: "center", inline: "center" });

  // If a modal was just dismissed, wait for the backdrop/dialog to naturally leave the DOM
  // so MUI Tabs are interactable again, rather than brute-forcing clicks in a retry loop.
  cy.get('body').then($body => {
    if ($body.find('[role="presentation"], [role="dialog"]').length > 0) {
      // Small defensive wait if transitions are still clearing
      cy.wait(300);
    }
  });

  cy.get(tabSel).then(($tab) => {
    if ($tab.attr("aria-selected") !== "true") {
      cy.wrap($tab).click({ force: true });
    }
  });

  cy.get(tabSel, { timeout: 20000 }).should(
    "have.attr",
    "aria-selected",
    "true"
  );

  cy.get(SELECTORS.profile.tabPanel(index), { timeout: 25000 }).should(
    "exist"
  );
  cy.get(SELECTORS.profile.tabPanel(index)).scrollIntoView({
    block: "center",
  });
}

/** Call after closing a modal so the tab strip is back in view and not focus-trapped. */
export function scrollProfileTabsIntoView() {
  scrollTabsStrip();
}
