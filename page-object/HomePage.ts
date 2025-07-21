import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import ENV from "../ultilities/env";
import { expectedFooterLinks } from "../ultilities/footer.data";

export class HomePage extends BasePage {
  readonly footerTextLinks: Locator;
  readonly joinTrialLink: Locator;
  readonly zipInput: Locator;
  readonly continueBtn: Locator;
  readonly radiusDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.footerTextLinks = page
      .locator("div.footer-links-wrapper a.footer-link")
      .filter({
        hasNot: page.locator("img"),
      });
    this.joinTrialLink = page.getByRole("link", { name: "Join Trial" });
    this.zipInput = page.getByRole("textbox", { name: "Zip code" });
    this.continueBtn = page.getByRole("button", { name: "Continue" });
    this.radiusDropdown = page.getByRole("combobox", { name: "Search radius" });
  }
   
  async validateFooter() {
    const count = await this.footerTextLinks.count();
    console.log(`Found ${count} footer links`);

    const actualTexts: string[] = [];

    for (let i = 0; i < count; i++) {
      const link = this.footerTextLinks.nth(i);
      const text = await link.innerText();
      const href = await link.getAttribute("href");
      const trimmedText = text.trim();
      actualTexts.push(trimmedText);
      expect(expectedFooterLinks).toContain(trimmedText);
      expect(href).not.toBeNull();
      //Validate link is not broken
      const fullUrl = href!.startsWith("http") ? href! : `${ENV.URL}${href}`;
      const response = await this.page.request.get(fullUrl);
      expect(response.status(), ` link: ${fullUrl}`).toBe(200);
    }

    console.log("Footer link validation passed ✅");
  }

  async dismissPopupIfPresent() {
    const popupBackground = this.page.locator(".ctct-form-defaults");
    const closeBtn = this.page.getByRole("button", { name: "Close" });

    try {
      if (await popupBackground.isVisible({ timeout: 5000 })) {
        await popupBackground.click();
      }

      if (await closeBtn.isVisible({ timeout: 5000 })) {
        await closeBtn.click();
        console.log("Popup dismissed");
      }
    } catch (e) {
      console.log("Popup not present or already closed");
    }
  }

  async navigateToJoinTrial() {
    await expect(this.joinTrialLink).toBeVisible();
    await this.footerTextLinks.first().scrollIntoViewIfNeeded();
    await this.dismissPopupIfPresent(); 
    await this.joinTrialLink.click();
    await this.page.waitForURL(/.*opportunities\/search.*/);
  }

  async validateSearchRadiusOptions(expectedOptions: string[]) {
    await expect(this.zipInput).toBeVisible();
    await expect(this.continueBtn).toBeVisible();
    await expect(this.continueBtn).toBeDisabled();
    await this.page.getByRole('textbox', { name: 'Zip code' }).fill('60616');
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.radiusDropdown.click();

    const optionsLocator = this.page.locator('[role="option"]');
    const count = await optionsLocator.count();

    const actualOptions: string[] = [];

    for (let i = 0; i < count; i++) {
      const optionText = await optionsLocator.nth(i).innerText();
      actualOptions.push(optionText.trim());
    }

    expect(actualOptions).toEqual(expectedOptions);
  }

  
  


}
