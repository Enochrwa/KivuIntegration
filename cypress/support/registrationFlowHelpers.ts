import { SELECTORS } from "./selectors";

/** Alphanumeric only (matches company registration number validation). */
function randomAlnum(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < length; i += 1) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

/** Rwanda national mobile without country code (9 digits; validated by libphonenumber in-app). */
function randomRwandaLocalNine(): string {
  const six = String(100000 + Math.floor(Math.random() * 899999));
  return `782${six}`;
}

export type E2ERegistrationIdentity = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  /** Company registration / TIN (alphanumeric). */
  registrationNumber: string;
  phoneLocal: string;
};

/**
 * Unique admin + company labels for staging registration; names and company title start with E2E.
 */
export function buildE2ERegistrationIdentity(): E2ERegistrationIdentity {
  const stamp = Date.now();
  const suffix = randomAlnum(5);
  return {
    firstName: `E2E${suffix}`,
    lastName: `E2E${randomAlnum(5)}`,
    companyName: `E2E Company ${stamp}`,
    email: `e2e.reg.${stamp}.${randomAlnum(4).toLowerCase()}@kivunova.com`,
    password: `E2eReg!${stamp}${randomAlnum(4)}`,
    registrationNumber: `E2ETIN${stamp}${randomAlnum(3)}`,
    phoneLocal: randomRwandaLocalNine(),
  };
}

function clickMuiSelectSurface(selectInputId: string) {
  cy.get(`#${selectInputId}`, { timeout: 30000 })
    .should("exist")
    .scrollIntoView();
  cy.get(`#${selectInputId}`)
    .parent()
    .find('[role="combobox"], .MuiSelect-select')
    .first()
    .should("be.visible")
    .click({ force: true });
}

function pickFirstListboxOption() {
  cy.get("body", { timeout: 20000 })
    .find("ul[role='listbox'], [role='listbox']")
    .should("be.visible");
  cy.get("body")
    .find("ul[role='listbox'], [role='listbox']")
    .first()
    .within(() => {
      cy.get("[role='option']:not([aria-disabled='true'])")
        .first()
        .click({ force: true });
    });
  cy.get("body").find("ul[role='listbox'], [role='listbox']").should("not.exist");
}

/** Rwanda (+250 / RW) — required for default phone validation in the container app. */
function ensureRwandaPhoneCountry() {
  clickMuiSelectSurface("registration-phone-country-code");
  cy.get("body", { timeout: 20000 })
    .find("ul[role='listbox'], [role='listbox']")
    .should("be.visible");
  cy.get('[role="option"][data-value="RW"]').click({ force: true });
  cy.get("body")
    .find("ul[role='listbox'], [role='listbox']")
    .should("not.exist");
}

/**
 * Cascade Rwanda address selects: pick first enabled option at each level.
 */
function fillRwandaAddress() {
  cy.get("#registration-province", { timeout: 45000 })
    .closest(".MuiOutlinedInput-root")
    .should("not.have.class", "Mui-disabled");

  const geoSelects = [
    "registration-province",
    "registration-district-select",
    "registration-sector-selector",
    "registration-cell-selector",
    "registration-village-selector",
  ] as const;

  geoSelects.forEach((id) => {
    clickMuiSelectSurface(id);
    pickFirstListboxOption();
  });

  cy.get(SELECTORS.registration.streetAddress, { timeout: 15000 })
    .should("be.visible")
    .clear()
    .type("E2E Test Street 1");
}

export function completeRegistrationAsNewUser(identity: E2ERegistrationIdentity) {
  cy.get(SELECTORS.registration.form, { timeout: 30000 }).should("be.visible");

  cy.get(SELECTORS.registration.firstName).should("be.enabled").click().clear();
  cy.get(SELECTORS.registration.firstName).should("be.enabled").type(identity.firstName);
  
  cy.get(SELECTORS.registration.lastName).should("be.enabled").click().clear();
  cy.get(SELECTORS.registration.lastName).should("be.enabled").type(identity.lastName);
  
  cy.get(SELECTORS.registration.email).should("be.enabled").click().clear();
  cy.get(SELECTORS.registration.email).should("be.enabled").type(identity.email);
  
  ensureRwandaPhoneCountry();
  
  cy.get(SELECTORS.registration.phone).should("be.enabled").click().clear();
  cy.get(SELECTORS.registration.phone).should("be.enabled").type(identity.phoneLocal);
  
  cy.get(SELECTORS.registration.password).should("be.enabled").click().clear();
  cy.get(SELECTORS.registration.password).should("be.enabled").type(identity.password);

  cy.get(SELECTORS.registration.next, { timeout: 15000 })
    .first()
    .should("be.visible")
    .click();

  cy.get(SELECTORS.registration.companyForm, { timeout: 20000 }).should(
    "be.visible"
  );

  cy.get(SELECTORS.registration.companyName)
    .clear()
    .type(identity.companyName);
  cy.get(SELECTORS.registration.registrationNumber)
    .clear()
    .type(identity.registrationNumber);
  cy.get(SELECTORS.registration.description)
    .clear()
    .type("E2E automated registration.");

  fillRwandaAddress();

  cy.get(SELECTORS.registration.next, { timeout: 15000 })
    .first()
    .should("be.visible")
    .click();

  cy.get(SELECTORS.registration.submit, { timeout: 20000 })
    .first()
    .should("be.visible")
    .should("be.enabled")
    .click();

  cy.url({ timeout: 90000 }).should(
    "match",
    /\/(en|rw|fr)\/login(\?.*)?$/
  );
  cy.get(SELECTORS.login.form, { timeout: 30000 }).should("be.visible");
}
