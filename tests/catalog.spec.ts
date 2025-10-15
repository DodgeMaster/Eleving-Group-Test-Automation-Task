import { test, expect } from '../fixtures/catalog.fixture';
import { CarDetailsPage } from '../pages/carDetailsPage';
import { parsePricesToNumbers } from '../utils/priceUtils';

test.describe('Catalog tests', () => {
    const BRAND_NAME = 'BMW';
    const MODEL = '320';
    const NON_EXISTED_DATA = '123';
    const ERROR_MESSAGE = "No elements found. Consider changing the search query.List is empty.";
    const YEAR_FROM = ["2017", "2018"];
    const YEAR_TO = "2021";
    const FUEL = ["Motorină", "Benzină", "Benzină/Gaz", "Hibrid", "Electric"];
    const GEARBOX = ["Manuală", "Automată/CVT/Robot"];
    const THAT_CAR_DOESNT_EXIST = "Nu au fost găsite mașini care să corespundă criteriilor de căutare";
    const NAVIGATION = ["Cutia de viteze"];


    test('Non-existent brand', async ({ catalog }) => {
        await catalog.brandInput.fill(NON_EXISTED_DATA);
        await catalog.nonExistedBrand.waitFor({state: "visible"});
        await expect(catalog.nonExistedBrand).toHaveText(ERROR_MESSAGE);
    });

    test('Existing brand', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.vehiclesCatalogNameList.first().waitFor({state: 'visible'});
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
    });

    test('Existing brand + non-existent model', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.modelInput.fill(NON_EXISTED_DATA);
        await catalog.nonExistedModel.waitFor({state: "visible"});
        await expect(catalog.nonExistedModel).toHaveText(ERROR_MESSAGE);
    });

    test('Existing brand + existing model', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
    });

    test('Brand + model + year range (count validation)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await expect(catalog.vehiclesCatalogNameList.first()).toContainText(BRAND_NAME);
        await catalog.setYearFrom(YEAR_FROM[1]);
        await catalog.yearToButton.click();
        await catalog.yearToDropdownMenu.getByText(YEAR_TO).scrollIntoViewIfNeeded();
        await catalog.waitForListUpdate(catalog.yearToDropdownMenu);
        let avaliableYears = await catalog.yearToDropdownMenu.allTextContents(); //get all avaliable years in the list
        let index = avaliableYears.findIndex(avaliableYears => avaliableYears.includes(YEAR_TO)); //found that year that we want to click and save index
        let amountOfVehicles = await catalog.yearToLeftAmountOfVehicles.nth(index).textContent(); //save amount of vehicles for future validation
        await catalog.yearToDropdownMenu.getByText(YEAR_TO).click();
        let getAmountOfCarsOnPage = await catalog.getCountOfCarsOnThePageToString();
        expect(getAmountOfCarsOnPage).toBe(amountOfVehicles); //validating that same amount of cars as well as in years to 
    });

       test('Brand + model + year range (boundary validation)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM[1]);
        await catalog.setYearTo(YEAR_TO);
        await catalog.waitForListUpdate(catalog.listOfCarsReleaseYear);
        const carsReleaseYear = await catalog.listOfCarsReleaseYear.allTextContents();
        for(const type of carsReleaseYear) {
            // console.log(parseInt(type))
            expect(parseInt(type)).toBeGreaterThanOrEqual(parseInt(YEAR_FROM[1]));
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
    
    test('Multi-select / union (Diesel + Petrol)', async ({ catalog }) => {
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

    test('Single gearbox filter (Manual)', async ({ catalog }) => {
        await catalog.gearboxButton.getByText(NAVIGATION[0]).click();
        await catalog.gearboxTypeList.getByText(GEARBOX[0]).click();
        await catalog.waitForListUpdate(catalog.listOfCarsGearboxType);
        let autoGearboxType = (await catalog.listOfCarsGearboxType.allTextContents());
        await catalog.waitNetworkIdle();
        for(const type of autoGearboxType) {
            expect(type).not.toBe(GEARBOX[1]);
            // expect(type).toBe(GEARBOX[0]);
        }
    });

    test('Single gearbox filter (Automatic/CVT/Robot)', async ({ catalog }) => {
        await catalog.gearboxButton.getByText(NAVIGATION[0]).click();
        await catalog.gearboxTypeList.getByText(GEARBOX[1]).click();
        await catalog.waitForListUpdate(catalog.listOfCarsGearboxType);
        let autoGearboxType = (await catalog.listOfCarsGearboxType.allTextContents());
        await catalog.waitNetworkIdle();
        for(const type of autoGearboxType) {
            expect(type).not.toBe(GEARBOX[0]);
            // expect(type).toBe(GEARBOX[1]);
        }
    });

    test('Cross-filter validation (brand + fuel + gearbox)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.fuelTypeButton.click();
        await catalog.fuelTypeList.getByText(FUEL[1]).first().click();
        await catalog.waitForListUpdate(catalog.fuelTypeAutoCatalogList);
        await catalog.waitNetworkIdle();
        await catalog.gearboxButton.getByText(NAVIGATION[0]).click();
        await catalog.gearboxTypeList.getByText(GEARBOX[1]).click();
        await catalog.modelInput.last().fill(MODEL);
        await catalog.waitForListUpdate(catalog.listOfCarsModelType);
        let amountOfCarsInFilter = await catalog.listOfCarsModelType.first().textContent();
        await catalog.page.keyboard.press('Enter');
        await catalog.waitNetworkIdle();
        let brandNameList = await catalog.vehiclesCatalogNameList.allTextContents();
        let autoFuelType = (await catalog.fuelTypeAutoCatalogList.allTextContents());
        let autoGearboxType = (await catalog.listOfCarsGearboxType.allTextContents());
        let amountOfCarsOnPage = await catalog.listOfCarsOnThePageInTextFormat.textContent();
        
        expect(amountOfCarsOnPage).toContain(amountOfCarsInFilter);
        for(let i in brandNameList) {
            expect(BRAND_NAME + " " + MODEL).toBe(brandNameList[i]);
            expect(FUEL[1]).toBe(autoFuelType[i]);
            expect(GEARBOX[1]).toBe(autoGearboxType[i]);
        }
    });

    test('Currency toggle consistency (EUR -> RON)', async ({ catalog }) => {
        let euroPrices = await catalog.carPriceList.allTextContents();
        await catalog.currencyToggleLei.click();
        let leiPrices = await catalog.carPriceList.allTextContents();
        for(let i in euroPrices) {
            expect(euroPrices[i]).not.toBe(leiPrices[i]);
            // console.log(euroPrices[i] + " " + leiPrices[i]);
        }
    });

    test('Round-trip switch (EUR -> RON -> EUR)', async ({ catalog }) => {
        let defaultEuroPrices = await catalog.carPriceList.allTextContents();
        await catalog.currencyToggleLei.click();
        let leiPrices = await catalog.carPriceList.allTextContents();
        await catalog.currencyToggleEuro.click();
        let switchedEuroPrices = await catalog.carPriceList.allTextContents();
        for(let i in defaultEuroPrices) {
            expect(defaultEuroPrices[i]).not.toBe(leiPrices[i]);
            expect(defaultEuroPrices[i]).toBe(switchedEuroPrices[i]);
        }
    });

    test('Sort by price (ascending)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM[0]);
        await catalog.setYearTo(YEAR_TO);
        await catalog.sortingOptionMenuButton.click();
        await catalog.higherPrices.click();
        await catalog.waitForListUpdate(catalog.carPriceList);
        let catalogPriceList = await catalog.carPriceList.allTextContents();
        const cleanCatalogPriceList = parsePricesToNumbers(catalogPriceList);
        
        for(let i = 1; i <= cleanCatalogPriceList.length; i++) {
            if(cleanCatalogPriceList[i] == undefined) break
            // console.log(`Prev price: ${cleanCatalogPriceList[i-1]} Current price:  ${cleanCatalogPriceList[i]}`);
            expect(cleanCatalogPriceList[i-1]).toBeGreaterThanOrEqual(cleanCatalogPriceList[i]);
        }
    });

    test('Sort by price (descending)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM[0]);
        await catalog.setYearTo(YEAR_TO);
        await catalog.sortingOptionMenuButton.click();
        await catalog.lowerPrices.click();
        await catalog.waitForListUpdate(catalog.carPriceList);
        let catalogPriceList = await catalog.carPriceList.allTextContents();
        const cleanCatalogPriceList = parsePricesToNumbers(catalogPriceList);
        
        for(let i = 1; i <= cleanCatalogPriceList.length; i++) {
            if(cleanCatalogPriceList[i] == undefined) break
            // console.log(`Prev price: ${cleanCatalogPriceList[i-1]} Current price:  ${cleanCatalogPriceList[i]}`);
            expect(cleanCatalogPriceList[i-1]).toBeLessThanOrEqual(cleanCatalogPriceList[i]);
        }
    });

    test('Check price consistent (descending)', async ({ catalog }) => {
        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM[0]);
        await catalog.setYearTo(YEAR_TO);
        await catalog.sortingOptionMenuButton.click();
        await catalog.lowerPrices.click();
        await catalog.waitForListUpdate(catalog.carPriceList);
        let catalogPriceList = await catalog.carPriceList.allTextContents();
        const cleanCatalogPriceList = parsePricesToNumbers(catalogPriceList);
        
        for(let i = 1; i <= cleanCatalogPriceList.length; i++) {
            if(cleanCatalogPriceList[i] == undefined) break
            expect(cleanCatalogPriceList[i-1]).toBeLessThanOrEqual(cleanCatalogPriceList[i]);
        }

        await catalog.rebootPage();
        await catalog.waitNetworkIdle();
        let catalogPriceListReloaded = await catalog.carPriceList.allTextContents();
        const cleanCatalogPriceListReloded = parsePricesToNumbers(catalogPriceListReloaded);

        for(let i = 0; i <= cleanCatalogPriceList.length; i++) {
            if(cleanCatalogPriceList[i] == undefined) break
            // console.log(`Before reloading price: ${cleanCatalogPriceList[i]} After reloading price:  ${cleanCatalogPriceListReloded[i]}`);
            expect(cleanCatalogPriceList[i]).toBe(cleanCatalogPriceListReloded[i]);
        }
    });

    test('Open details from catalog', async ({ catalog, page }) => {
        const details = new CarDetailsPage(page);

        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM[0]);
        await catalog.setYearTo(YEAR_TO);
        await catalog.waitNetworkIdle();
        let carName = await catalog.vehiclesCatalogNameList.first().textContent();
        let releaseYear = await catalog.listOfCarsReleaseYear.first().textContent();
        let fuelType = await catalog.fuelTypeAutoCatalogList.first().textContent();
        let gearbox = await catalog.listOfCarsGearboxType.first().textContent();
        await catalog.carMoreDetails.first().click();
        await catalog.waitNetworkIdle();
        let pageURL = await catalog.getCurrentPage();        
        let detailedCarPageCarName = await details.carName.textContent();
        let detailedCarPageFuelType = await details.fuelType.textContent();
        let detailedCarPageGearbox = await details.gearbox.textContent();
        let detailedCarPageReleaseYear = await details.releaseYear.textContent();
        expect(carName).toBe(detailedCarPageCarName);
        expect(fuelType).toBe(detailedCarPageFuelType);
        expect(gearbox).toBe(detailedCarPageGearbox);
        expect(releaseYear).toBe(detailedCarPageReleaseYear);
        expect(pageURL).
            toMatch(
                new RegExp(`${process.env.BASE_URL}/auto/\\d+/${BRAND_NAME}-${MODEL}-${releaseYear}`, 'i'));
    });

    test('Back to catalog — state is preserved', async ({ catalog, page }) => {
        const details = new CarDetailsPage(page);

        await catalog.setBrand(BRAND_NAME);
        await catalog.setModel(MODEL);
        await catalog.setYearFrom(YEAR_FROM[0]);
        await catalog.setYearTo(YEAR_TO);
        await catalog.waitNetworkIdle();
        let amountOfCars = await catalog.listOfCarsOnThePage.allTextContents();
        await catalog.carMoreDetails.first().click();
        await catalog.waitNetworkIdle();
        await details.backOnPreviousPage();
        await catalog.waitNetworkIdle();
        let amountOfCarsAfterReturnOnThePage = await catalog.listOfCarsOnThePage.allTextContents();
        for(let i = 0; i <= amountOfCars.length; i++) {
            expect(amountOfCars[i]).toBe(amountOfCarsAfterReturnOnThePage[i]);
        }
    });
});