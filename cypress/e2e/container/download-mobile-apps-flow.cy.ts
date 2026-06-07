/**
 * Container: same optional routing as download-apps-flow (mobile viewport).
 * Mobile store listings are not published yet — page shows iOS/Android cards with
 * “coming soon” copy (no App Store / Play URLs). Asserts those cards are visible.
 *
 * Card `data-testid`s may be absent on older deploys; assertions use visible titles
 * matching `download-apps-ios-label` / `download-apps-android-label` English fallbacks
 * (align `defaultLang` with those strings if testing non-en).
 */
import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { continueFromHomeToDownloadAppsPage } from "../../support/optionalFirstVisitDownload";

describe("Container: Download mobile apps (first-visit modal → page)", () => {
  it("reaches download-apps with iOS and Android cards (modal optional)", () => {
    cy.viewport("iphone-x");

    cy.visit(buildLocalizedPath(ROUTES.home));

    // Wait for initial page load before manipulating storage
    cy.window({ timeout: 30000 }).should("exist");
    cy.get("body").should("be.visible");

    cy.window().then((w) => {
      try {
        w.localStorage.removeItem("kivu_ld");
        w.sessionStorage.removeItem("kivu_sd");
        w.sessionStorage.removeItem("kivu_es");
        w.sessionStorage.removeItem("kivu_embedded_shell");
      } catch {
        /* ignore */
      }
    });

    // Increase reload timeout and wait for document ready
    cy.reload({ timeout: 120000 });
    
    // Wait for page to be interactive after reload
    cy.get("body", { timeout: 30000 }).should("be.visible");

    continueFromHomeToDownloadAppsPage();

    cy.location("pathname", { timeout: 15000 }).should(
      "include",
      ROUTES.downloadApps
    );

    cy.contains("h6", "iPhone & iPad", { timeout: 30000 })
      .scrollIntoView()
      .should("be.visible");

    cy.contains("h6", "Android", { timeout: 30000 })
      .scrollIntoView()
      .should("be.visible");
  });
});
