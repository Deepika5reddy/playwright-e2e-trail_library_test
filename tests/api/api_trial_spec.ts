import { test, expect } from "../../ultilities/custom.fixtures";
import { HomePage } from "../../page-object/home.page";
import ENV from "../../ultilities/env";
import { zipCodes } from '../../ultilities/zipcode'; 

const radiusValues = [50, 100, 150, 6000];
const resultSummary: string[] = [];


test.describe.only('Trial Search API - ZIP and Radius Combinations', () => {
  zipCodes.forEach((zip) => {
    radiusValues.forEach((radius) => {
      test(` Validate response for ZIP: ${zip} & Radius: ${radius}`, async ({ request }) => {
        const response = await request.get(ENV.TRIAL_SEARCH_API, {
          params: {
            zip5_code: zip,
            radius_in_miles: radius.toString(),
          },
        });
        console.log(`Status for ZIP ${zip}, Radius ${radius}:`, response.status());
        expect(response.status(), ` Failed for ZIP: ${zip}, Radius: ${radius}`).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);

        console.log(` ZIP: ${zip}, Radius: ${radius} => Trials Found: ${data.length}`);
        const summary = ` ZIP: ${zip}, Radius: ${radius} => Trials Found: ${data.length}`;
        console.log(summary);
        resultSummary.push(summary);
        
      });
    });
  });
});