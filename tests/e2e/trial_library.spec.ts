import { test, expect } from "../../ultilities/custom.fixtures";
import { HomePage } from "../../page-object/home.page";
import ENV from "../../ultilities/env";
import { zipCodes } from '../../ultilities/zipcode'; 

const radiusValues = [50, 100, 150, 6000];
const resultSummary: string[] = [];


test("Validate the footer text,links are not broken ", async ({ homePage, page }) => {
  console.log("Navigated to URL: ", ENV.URL);
  await homePage.validateFooter();
});

test("Validate sponsored trial opportunities page", async ({ homePage,page,}) => {
  await homePage.navigateToJoinTrial();
  const expectedOptions = ['50 miles', '100 miles', '150 miles', '250 miles', 'Nationwide'];
  await homePage.validateSearchRadiusOptions(expectedOptions);
});






