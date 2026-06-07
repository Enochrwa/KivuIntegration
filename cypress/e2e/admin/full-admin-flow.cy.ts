/**
 * Admin portal full flow. Uses CYPRESS_ADMIN_URL when admin is a separate app.
 */
describe("Admin: Full admin flow", () => {
  const adminUrl = Cypress.env("adminUrl") || Cypress.config().baseUrl;

  it("admin app loads and has visible content", () => {
    cy.visit(adminUrl || "/");
    cy.get("body").should("be.visible");
    cy.document().its("readyState").should("eq", "complete");
  });
});
