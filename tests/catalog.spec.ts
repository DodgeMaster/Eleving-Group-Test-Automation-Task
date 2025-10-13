import { test, expect } from '../fixtures/catalog.fixture';

test.describe('P0: Check filters (brand, year, gearbox, fuel)', () => {
    const BRAND_NAME = 'BMW';
    const MODEL = '320';
    const NON_EXISTED_DATA = '123';
    const ERROR_MESSAGE = "No elements found. Consider changing the search query.";
    const YEAR_FROM = "2018";
    const YEAR_TO = "2021";
    const FUEL = ["Motorină", "Benzină", "Benzină/Gaz", "Hibrid", "Electric"];
    const THAT_CAR_DOESNT_EXIST = "Nu au fost găsite mașini care să corespundă criteriilor de căutare";


    test('Check for non existed brand', async ({ catalog }) => {
        await catalog.brandInput.fill(NON_EXISTED_DATA);
        await catalog.nonExistedBrand.waitFor({state: "visible"});
        await expect(catalog.nonExistedBrand).toHaveText(ERROR_MESSAGE);
    });

    test('Check for existed brand', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.vehiclesCatalogNameList.first().waitFor({state: 'visible'});
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
    });

    test('Check for existed brand and non existed model', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.modelInput.fill(NON_EXISTED_DATA);
        await catalog.nonExistedModel.waitFor({state: "visible"});
        await expect(catalog.nonExistedModel).toHaveText(ERROR_MESSAGE);
    });

    test('Check for existed brand and existed model', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
    });

    test('Check for existed brand + model + year from + year to', async ({ catalog }) => {
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

       test('Validate that car release year do not move out from boundaries', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM);
        await catalog.setYearTo(YEAR_TO);
        await catalog.waitForListUpdate(catalog.listOfCarsReleaseYear);
        const carsReleaseYear = await catalog.listOfCarsReleaseYear.allTextContents();
        for(const type of carsReleaseYear) {
            console.log(parseInt(type))
            expect(parseInt(type)).toBeGreaterThanOrEqual(parseInt(YEAR_FROM));
            expect(parseInt(type)).toBeLessThanOrEqual(parseInt(YEAR_TO));
        }
    });

    test('Single fuel filter (Diesel)', async ({ catalog }) => {
        await catalog.fuelTypeButton.click();
        await catalog.fuelTypeList.getByText(FUEL[0]).click();
        await catalog.waitForListUpdate(catalog.fuelTypeAutoCatalogList);
        let autoFuelType = (await catalog.fuelTypeAutoCatalogList.allTextContents());
        for(const type of autoFuelType) {
            expect(type).toBe(FUEL[0]);
        }
    });
    
    test('Multi-select / union', async ({ catalog }) => {
        await catalog.fuelTypeButton.click();
        await catalog.fuelTypeList.getByText(FUEL[0]).click();
        await catalog.waitNetworkIdle();
        await catalog.fuelTypeList.getByText(FUEL[1]).first().click();
        await catalog.waitNetworkIdle();
        let autoFuelType = (await catalog.fuelTypeAutoCatalogList.allTextContents());
        for(const type of autoFuelType) {
            expect(type).not.toBe(FUEL[2]);
            expect(type).not.toBe(FUEL[3]);
            expect(type).not.toBe(FUEL[4]);
        }
    });

    test('Contextual options (Brand + Model + invalid fuel type)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.fuelTypeButton.click();
        await catalog.fuelTypeList.getByText(FUEL[4]).click();
        await catalog.waitNetworkIdle();
        const carNotExistError = await catalog.carDoesntExistError.textContent();
        expect(carNotExistError).toBe(THAT_CAR_DOESNT_EXIST);
    });

 

//   test('P0: Filter by brand + year', async ({ page }) => { ... });

//   test('P1: Sort by price', async ({ page }) => { ... });

//   test('P1: Sort by newest', async ({ page }) => { ... });

//   test('P1: Currency toggle updates prices', async ({ page }) => { ... });

//   test('P2: Cookie banner does not block UI', async ({ page }) => { ... });

});