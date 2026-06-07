describe("Container: PWA basics", () => {
  it("exposes a web app manifest link and serves manifest", () => {
    cy.visit("/");
    cy.get('link[rel="manifest"]')
      .should("have.attr", "href")
      .then((href) => {
        const base = Cypress.config("baseUrl") ?? "";
        const resolved =
          typeof href === "string" && href.startsWith("http")
            ? href
            : new URL(String(href), base).href;
        cy.request(resolved).its("status").should("eq", 200);
      });
  });
});
