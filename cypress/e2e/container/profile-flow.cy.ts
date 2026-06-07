/**
 * Container: Profile page flow
 *
 * Fewer logins per role: one session walks tabs + modals (avoids staging token churn).
 */

import { ROUTES } from "../../support/commands";
import {
  scrollProfileTabsIntoView,
  selectUserProfileTab,
} from "../../support/containerProfileHelpers";
import { PORTAL_USER_KEYS } from "../../support/portalUsers";
import { SELECTORS } from "../../support/selectors";

PORTAL_USER_KEYS.forEach((userKey) => {
  describe(`Container: Profile flow (${userKey})`, () => {
    /**
     * Authorize runs after shell paint; a transient GraphQL `Failed to fetch` can send the user
     * to `/login?redirectPath=...` while the test continues. Wait for a terminal UI state, then
     * revisit profile once if we landed on login (same session cookie).
     */
    const goToProfile = () => {
      cy.loginAs(userKey);
      cy.visitMfe(ROUTES.profile);
      cy.assertOnPortal();
      cy.waitForAppReady();
      cy.assertSidebarNavForPortalUser(userKey);

      cy.get("body", { timeout: 60000 }).should(($body) => {
        const bouncedToLogin = $body.find(SELECTORS.login.form).length > 0;
        const profileReady =
          $body.find(SELECTORS.profile.viewCard).length > 0;
        expect(
          bouncedToLogin || profileReady,
          "authorize settled: login form or profile content"
        ).to.be.true;
      });

      cy.url().then((href) => {
        if (href.includes("/login")) {
          cy.log(
            "Profile route redirected to login (transient authorize); revisiting profile"
          );
          cy.visitMfe(ROUTES.profile);
          cy.assertOnPortal();
          cy.waitForAppReady();
          cy.assertSidebarNavForPortalUser(userKey);
        }
      });

      cy.location("pathname", { timeout: 60000 }).should((p) => {
        expect(
          p,
          "stay on portal profile, not bounced to login"
        ).to.satisfy(
          (path: string) =>
            path.includes("/portal/profile") && !path.includes("/login")
        );
      });

      cy.get(SELECTORS.profile.tabs, { timeout: 30000 })
        .should("exist")
        .scrollIntoView({ block: "center", inline: "center" });
      cy.get(SELECTORS.profile.viewCard, { timeout: 45000 }).should(
        "be.visible"
      );
    };

    it("renders Profile and Password tabs", () => {
      goToProfile();
      cy.get(SELECTORS.profile.tab(0)).should("exist");
      cy.get(SELECTORS.profile.tab(1)).should("exist");
    });

    it("exercises Profile and Password tabs in one session", () => {
      goToProfile();

      cy.url().should("include", "/portal/profile");

      selectUserProfileTab(0);
      cy.get(SELECTORS.profile.viewCard).should("exist").and("be.visible");
      cy.get(SELECTORS.profile.editButton).should("exist").and("be.visible");
      cy.get(SELECTORS.profile.editButton).click();
      
      cy.get(SELECTORS.profile.editModal).within(() => {
        cy.get("form", { timeout: 30000 }).should("be.visible");
      });
      cy.get("body").type("{esc}");

      // Closing the modal can coincide with a transient authorize redirect to login.
      cy.url().then((href) => {
        if (href.includes("/login")) {
          cy.log(
            "After closing edit profile modal, on login; revisiting profile (same session)"
          );
          cy.visitMfe(ROUTES.profile);
          cy.assertOnPortal();
          cy.waitForAppReady();
        }
      });

      cy.url({ timeout: 20000 }).should("include", "/portal/profile");

      scrollProfileTabsIntoView();
      selectUserProfileTab(1);
      cy.get(SELECTORS.profile.passwordCard, { timeout: 20000 })
        .should("exist")
        .scrollIntoView({ block: "center", inline: "center" });
      cy.get(SELECTORS.profile.passwordForm)
        .should("exist")
        .scrollIntoView({ block: "center", inline: "center" });
      cy.get(SELECTORS.profile.passwordInputCurrent).should("exist");
      cy.get(SELECTORS.profile.passwordInputNew).should("exist");
      cy.get(SELECTORS.profile.passwordInputConfirm).should("exist");
      cy.get(SELECTORS.profile.passwordSubmit).should("exist");
    });
  });
});
