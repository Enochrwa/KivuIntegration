/**
 * Container: public info pages — FAQ & Contact via floating actions; About & User guide via FAQ ingress.
 * Selectors prefer data-testid; href / accordion id fallbacks work before container test ids ship.
 */
import { ROUTES, buildLocalizedPath } from "../../support/commands";
import { SELECTORS } from "../../support/selectors";

const assertPathIncludes = (segment: string) => {
  cy.location("pathname", { timeout: 20000 }).should("include", segment);
};

const assertVisiblePageTitle = (titleTestId: string) => {
  cy.get(SELECTORS.publicInfo.pageTitle(titleTestId), { timeout: 20000 })
    .filter(":visible")
    .first()
    .should("be.visible");
};

const visitFaqPage = () => {
  cy.visit(buildLocalizedPath(ROUTES.faq));
  cy.document().its("readyState").should("eq", "complete");
  cy.get(`${SELECTORS.publicInfo.pageTitle("faq-page-title")}, ${SELECTORS.publicInfo.faqWhatIsFmsHeader}`, {
    timeout: 20000
  })
    .filter(":visible")
    .first()
    .should("exist");
};

const clickVisibleFaqLink = (selector: string) => {
  cy.get(selector, { timeout: 20000 }).then(($links) => {
    const $visible = $links.filter(":visible");
    if ($visible.length > 0) {
      cy.wrap($visible.first()).click();
      cy.wait(500);
      return;
    }
    cy.get(SELECTORS.publicInfo.faqWhatIsFmsHeader).scrollIntoView().click();
    cy.wait(300);
    cy.get(selector).filter(":visible").first().scrollIntoView().click();
    cy.wait(500);
  });
};

describe("Container: Public info pages", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit(buildLocalizedPath(ROUTES.home));
    cy.dismissFirstVisitDownloadModal();
  });

  it("shows FAQ and Contact floating actions", () => {
    cy.get(SELECTORS.publicInfo.fabFaq).should("be.visible");
    cy.get(SELECTORS.publicInfo.fabContact).should("be.visible");
  });

  it("FAQ FAB navigates to the FAQ page", () => {
    cy.get(SELECTORS.publicInfo.fabFaq).click();
    assertPathIncludes(ROUTES.faq);
    assertVisiblePageTitle("faq-page-title");
  });

  it("Contact FAB navigates to the contact page", () => {
    cy.get(SELECTORS.publicInfo.fabContact).click();
    assertPathIncludes(ROUTES.contact);
    assertVisiblePageTitle("contact-page-title");
  });

  it("FAQ ingress: user guide link opens the user guide page", () => {
    visitFaqPage();
    clickVisibleFaqLink(SELECTORS.publicInfo.faqIngressUserGuide);
    assertPathIncludes(ROUTES.userGuide);
    assertVisiblePageTitle("user-guide-page-title");
  });

  it("FAQ ingress: about link in what-is-fms opens the about page", () => {
    visitFaqPage();
    clickVisibleFaqLink(SELECTORS.publicInfo.faqIngressAbout);
    assertPathIncludes(ROUTES.about);
    assertVisiblePageTitle("about-page-title");
  });
});
