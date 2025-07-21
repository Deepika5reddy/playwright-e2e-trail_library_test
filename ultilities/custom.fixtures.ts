import { test as base, BrowserContext, Page, expect } from '@playwright/test';
import { HomePage } from '../page-object/HomePage';
import { SponsorTrialOpportunityPage } from '../page-object/SponsorTrialOpportunityPage';
import ENV from './env';

type Fixtures = {
  context: BrowserContext;
  page: Page;
  homePage: HomePage;
  sponsorTrialPage: SponsorTrialOpportunityPage;
};

export const test = base.extend<Fixtures>({
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
   await page.goto(ENV.URL); // ✅ Navigate only once here
    await use(page);
    await page.close();
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  sponsorTrialPage: async ({ page }, use) => {
    const sponsorTrialPage = new SponsorTrialOpportunityPage(page);
    await use(sponsorTrialPage);
  },
});

export { expect };
