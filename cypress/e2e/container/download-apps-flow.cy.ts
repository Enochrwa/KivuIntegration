/**
 * Container: home → /download-apps via welcome download link or direct URL if the build hides it.
 * First-visit sheet is pre-dismissed via `kivu_sd` in `e2e.ts` (same as other specs). Asserts
 * Windows + Mac installer links.
 */
import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { continueFromHomeToDownloadAppsPage } from "../../support/optionalFirstVisitDownload";
import { SELECTORS } from "../../support/selectors";

describe("Container: Download apps (home → page)", () => {
  it("reaches download-apps with Windows and Mac links", () => {
    cy.viewport(1280, 800);

    const homePath = buildLocalizedPath(ROUTES.home);
    cy.visit(homePath);

    // Wait for initial page load
    cy.window({ timeout: 30000 }).should("exist");
    cy.get("body").should("be.visible");

    // Remove localStorage key that might hide the download link
    cy.window().then((w) => {
      try {
        w.localStorage.removeItem("kivu_ld");
      } catch {
        /* ignore */
      }
    });

    // Visit again instead of reload for more reliable page load
    cy.visit(homePath, { timeout: 60000 });
    
    // Wait for page to be fully loaded
    cy.get("body", { timeout: 30000 }).should("be.visible");

    continueFromHomeToDownloadAppsPage();

    cy.location("pathname", { timeout: 15000 }).should(
      "include",
      ROUTES.downloadApps
    );

    cy.get(SELECTORS.downloadApps.windowsLink, { timeout: 30000 })
      .should("be.visible")
      .should("have.attr", "href")
      .and("match", /^https?:\/\//);

    cy.get(SELECTORS.downloadApps.macLink, { timeout: 30000 })
      .should("have.length.at.least", 1)
      .first()
      .should("be.visible")
      .should("have.attr", "href")
      .and("match", /^https?:\/\//);
  });
});
