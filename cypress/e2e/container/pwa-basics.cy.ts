describe("Container: PWA basics", () => {
  it("exposes a web app manifest link and serves manifest", () => {
    cy.visit("/");
    cy.get('link[rel="manifest"]')
      .should("have.attr", "href")
      .then((hrefAttr) => {
        const href = String(hrefAttr);
        const base = Cypress.config("baseUrl") ?? "";
        const resolved =
          href.startsWith("http") ? href : new URL(href, base).href;
        cy.request(resolved).its("status").should("eq", 200);
      });
  });
});
