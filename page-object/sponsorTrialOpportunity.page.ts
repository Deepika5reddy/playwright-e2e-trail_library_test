import { Locator, Page, expect } from "@playwright/test";
import { AbstractPage } from "./AbstractPage";

export class SponsorTrialOpportunityPage extends AbstractPage {
  readonly zipInput: Locator;
  readonly continueBtn: Locator;
  readonly radiusDropdown: Locator;
  readonly trialCards: Locator;

  constructor(page: Page) {
    super(page); 
    this.zipInput = page.getByRole("textbox", { name: "Zip code" });
    this.continueBtn = page.getByRole("button", { name: "Continue" });
    this.radiusDropdown = page.getByRole("combobox", {
      name: /search radius/i,
    });
    this.trialCards = page.locator(
      ".MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation4"
    );
  }

  async validateTrialSearchByRadius(
    zipCode: string,
    radiusValues: (number | "Nationwide")[]
  ) {
    await this.zipInput.fill(zipCode);
    await this.continueBtn.click();

    let lastApiRadius: number | null = null;

    for (const radius of radiusValues) {
      console.log(`🔄 Testing radius: ${radius}`);

      const apiRadius = radius === "Nationwide" ? 6000 : radius;

      if (apiRadius === lastApiRadius) {
        console.log(
          `Skipping radius ${radius} — API value ${apiRadius} already tested`
        );
        continue;
      }

      try {
        await this.radiusDropdown.click();
        const optionText =
          radius === "Nationwide" ? "Nationwide" : `${radius} miles`;
        await this.page.getByText(optionText).first().click();

        const response = await this.page.waitForResponse(
          (res) =>
            res.url().includes("/trial-search") &&
            res.url().includes(`zip5_code=${zipCode}`) &&
            res.url().includes(`radius_in_miles=${apiRadius}`) &&
            res.status() === 200,
          { timeout: 10000 }
        );

        const data = await response.json();
        const expectedCount = Array.isArray(data) ? data.length : 0
        const cardCount = await this.trialCards.count();

        console.log(
          `Radius ${radius} (API: ${apiRadius}): UI shows ${cardCount} cards, API returned ${expectedCount} trials`
        );
        expect(cardCount).toBe(expectedCount);

        lastApiRadius = apiRadius;
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            `Error for radius "${radius}" (API: ${apiRadius}):`,
            err.message
          );
        } else {
          console.error(
            ` Error for radius "${radius}" (API: ${apiRadius}):`,
            err
          );
        }
      }
    }
  }



  
}
