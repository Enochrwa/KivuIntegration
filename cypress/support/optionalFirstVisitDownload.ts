import { SELECTORS } from "./selectors";

const STEP_MS = 250;
/** ~20s max wait when the first-visit sheet may exist but never becomes interactable. */
const MAX_STEPS = 80;
/**
 * If no first-visit control and no welcome link mounts, fall through to direct `/download-apps`
 * (build without first-visit UI / link).
 */
const EARLY_EXIT_STEPS = 24;

function localizedDownloadAppsPath(): string {
  const lang = Cypress.env("defaultLang") || "en";
  return `/${lang}/download-apps`;
}

function hasOpaqueBackdrop(
  win: Window,
  $body: JQuery<HTMLElement>
): boolean {
  return $body.find(".MuiBackdrop-root").toArray().some((el) => {
    const s = win.getComputedStyle(el);
    return (
      s.display !== "none" &&
      s.visibility !== "hidden" &&
      parseFloat(s.opacity) > 0.01
    );
  });
}

/**
 * After `cy.reload()` on home: prefer first-visit **View more** if the sheet is shown, else
 * optional welcome **Download apps** when no modal backdrop blocks it, else `cy.visit` to
 * `/download-apps`. Most specs pre-set `kivu_sd` in `e2e.ts` so the sheet never opens;
 * `download-mobile-apps-flow` opts out and may still exercise the first-visit path.
 */
function pollForOptionalFirstVisit(i: number): void {
  cy.get("body").then(($body) => {
    const win = $body[0].ownerDocument.defaultView!;
    const viewMoreSel = SELECTORS.firstVisitDownload.viewMore;
    const welcomeSel = SELECTORS.welcome.downloadAppsLink;

    if ($body.find(viewMoreSel).length > 0) {
      cy.get(viewMoreSel).first().should("be.visible").click();
      return;
    }

    if (hasOpaqueBackdrop(win, $body)) {
      if (i >= MAX_STEPS) {
        cy.visit(localizedDownloadAppsPath());
        return;
      }
      cy.wait(STEP_MS).then(() => pollForOptionalFirstVisit(i + 1));
      return;
    }

    if ($body.find(welcomeSel).length > 0) {
      cy.get(welcomeSel).first().click();
      return;
    }

    if (i >= EARLY_EXIT_STEPS || i >= MAX_STEPS) {
      cy.visit(localizedDownloadAppsPath());
      return;
    }

    cy.wait(STEP_MS).then(() => pollForOptionalFirstVisit(i + 1));
  });
}

export function continueFromHomeToDownloadAppsPage(): void {
  pollForOptionalFirstVisit(0);
}
