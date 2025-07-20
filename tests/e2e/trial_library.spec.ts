import { test, expect } from "../../ultilities/custom.fixtures";
import { HomePage } from "../../page-object/home.page";
import ENV from "../../ultilities/env";
import { zipCodes } from "../../ultilities/zipcode";
import { SponsorTrialOpportunityPage } from "../../page-object/sponsorTrialOpportunity.page";

test.beforeEach(async ({ homePage }) => {
   await homePage.dismissPopupIfPresent();
});

test("Validate the footer text,links are not broken ", async ({
   homePage,
   page,
}) => {
   console.log("Navigated to URL: ", ENV.URL);
   await homePage.validateFooter();
});

test("Validate sponsored trial opportunities page radius options displayed in UI", async ({
   homePage,
   page,
}) => {
   await homePage.navigateToJoinTrial();
   const expectedOptions = [
      "50 miles",
      "100 miles",
      "150 miles",
      "250 miles",
      "Nationwide",
   ];
   await homePage.validateSearchRadiusOptions(expectedOptions);
});

test("Validate zipcode is required field", async ({ homePage, page }) => {
   test.setTimeout(60000);
   await homePage.navigateToJoinTrial();
   await expect(page.getByRole("textbox", { name: "Zip code" })).toBeVisible();
   await expect(page.getByText("Continue")).toBeDisabled();
   await page.getByText("Zip codeZip codeContinue").click();
   await expect(
      page.getByText("Zip codeZip codeRequired fieldContinue")
   ).toBeVisible();
});

test("Validate trial card count for Chicago ZIP: 60616 across radius values", async ({
   homePage,
   sponsorTrialPage,
   page,
}) => {
   test.setTimeout(60000);
   const zipCode = "60616";
   const radiusValuesTest: (number | "Nationwide")[] = [
      50,
      100,
      "Nationwide",
      150,
   ];
   await homePage.navigateToJoinTrial();
   await sponsorTrialPage.validateTrialSearchByRadius(zipCode, radiusValuesTest);
});

test("Validate trial card count for NY ZIP:  across radius values", async ({
   homePage,
   sponsorTrialPage,
   page,
}) => {
   test.setTimeout(60000);
   const zipCode = "10001";
   const radiusValuesTest: (number | "Nationwide")[] = [
      50,
      100,
      "Nationwide",
      150,
   ];
   await homePage.navigateToJoinTrial();
   await sponsorTrialPage.validateTrialSearchByRadius(zipCode, radiusValuesTest);
});

test("Validate trial card count for San Fransisco:  across radius values", async ({
   homePage,
   page,
   sponsorTrialPage,
}) => {
   test.setTimeout(60000);
   const zipCode = "94105";
   const radiusValuesTest: (number | "Nationwide")[] = [50, 100, "Nationwide", 150];
   await homePage.navigateToJoinTrial();
   await sponsorTrialPage.validateTrialSearchByRadius(zipCode, radiusValuesTest);
});
