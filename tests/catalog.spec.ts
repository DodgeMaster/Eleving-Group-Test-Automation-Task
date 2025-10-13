import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/сatalogPage';

test.describe('P0: Check filters (brand, year, gearbox, fuel)', () => {
    const BRAND_NAME = 'BMW';
    const MODEL = '320';
    const NON_EXISTED_DATA = '123';
    const ERROR_MESSAGE = "No elements found. Consider changing the search query.";
    const YEAR_FROM = "2018";
    const YEAR_TO = "2021";

    test('Check for non existed brand', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await expect(page).toHaveURL(/catalog/);
        await catalog.brandInput.fill(NON_EXISTED_DATA);
        await catalog.nonExistedBrand.waitFor({state: "visible"});
        await expect(catalog.nonExistedBrand).toHaveText(ERROR_MESSAGE);
    });

    test('Check for existed brand', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await expect(page).toHaveURL(/catalog/);
        await catalog.setBrand(BRAND_NAME);
        await catalog.vehiclesCatalogNameList.first().waitFor({state: 'visible'});
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
    });

    test('Check for existed brand and non existed model', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await expect(page).toHaveURL(/catalog/);
        await catalog.setBrand(BRAND_NAME);
        await catalog.modelInput.fill(NON_EXISTED_DATA);
        await catalog.nonExistedModel.waitFor({state: "visible"});
        await expect(catalog.nonExistedModel).toHaveText(ERROR_MESSAGE);
    });

    test('Check for existed brand and existed model', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await expect(page).toHaveURL(/catalog/);
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
    });

    test('Check for existed brand + model + year from + year to', async ({ page }) => {
        const catalog = new CatalogPage(page);
        await catalog.goto();
        await expect(page).toHaveURL(/catalog/);
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
        await catalog.setYearFrom(YEAR_FROM);
        await catalog.yearToButton.click();
        await catalog.yearToDropdownMenu.getByText(YEAR_TO).scrollIntoViewIfNeeded();
        await catalog.waitForListUpdate(await catalog.yearToDropdownMenu); //wait for list update
        let avaliableYears = await catalog.yearToDropdownMenu.allTextContents(); //get all avaliable years in the list
        let index = avaliableYears.findIndex(avaliableYears => avaliableYears.includes(YEAR_TO)); //found that year that we want to click and save index
        let amountOfVehicles = await catalog.yearToLeftAmountOfVehicles.nth(index).textContent(); //save amount of vehicles for future validation
        await catalog.yearToDropdownMenu.getByText(YEAR_TO).click();
        let getAmountOfCarsOnPage = await catalog.getCountOfCarsOnThePageToString();
        expect(getAmountOfCarsOnPage).toBe(amountOfVehicles); //validating that same amount of cars as well as in years to 
    });
    
//   test('P0: Filter by brand + year', async ({ page }) => { ... });

//   test('P1: Sort by price', async ({ page }) => { ... });

//   test('P1: Sort by newest', async ({ page }) => { ... });

//   test('P1: Currency toggle updates prices', async ({ page }) => { ... });

//   test('P2: Cookie banner does not block UI', async ({ page }) => { ... });

});