import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CatalogPage extends BasePage {
  readonly url = '/catalog';
  readonly brandInput: Locator;
  readonly modelInput: Locator;
  readonly brandResultList: Locator;
  readonly modelResultList: Locator;
  readonly nonExistedBrand: Locator;
  readonly nonExistedModel: Locator;
  readonly vehiclesCatalogNameList: Locator;
  readonly yearFromButton: Locator;
  readonly yearToButton: Locator;
  readonly yearFromDropdownMenu: Locator;
  readonly yearToDropdownMenu: Locator;
  readonly yearToLeftAmountOfVehicles: Locator;
  readonly listOfCarsOnThePage: Locator;
  readonly listOfCarsOnThePageInTextFormat: Locator;
  readonly fuelTypeAutoCatalogList: Locator;
  readonly fuelTypeButton: Locator;
  readonly fuelTypeList: Locator;
  readonly gearboxButton: Locator;
  readonly gearboxTypeList: Locator;
  readonly carDoesntExistError: Locator;
  readonly listOfCarsReleaseYear: Locator;

  constructor(page: Page) {
    super(page);
    this.brandInput = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[1]/div/div[1]/input');
    this.modelInput = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[2]/div/div/div[1]/input');
    this.brandResultList = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[1]/div/div[2]/ul/li/span/span[1]');
    this.modelResultList = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[2]/div/div/div[2]/ul/li');
    this.nonExistedBrand = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[1]/div/div[2]/ul/li[1]');
    this.nonExistedModel = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[2]/div/div/div[2]/ul/li[1]/span');
    this.vehiclesCatalogNameList = page.locator('//*[@id="vehicles-page-header"]/div/div/a/div[2]/div[1]');
    this.yearFromButton = page.locator('//*[@id="select-year-from"]//*[@class="multiselect__tags"]').nth(0);
    this.yearToButton = page.locator('//*[@id="select-year-to"]//*[@class="multiselect__tags"]').nth(0);
    this.yearFromDropdownMenu = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[3]/div/div/div/div[1]/div/div/div/div/div/div[3]/ul/li');
    this.yearToDropdownMenu = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[3]/div/div/div/div[2]/div/div/div/div/div/div[3]/ul/li');
    this.yearToLeftAmountOfVehicles = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[3]/div/div/div/div[2]/div/div/div/div/div/div[3]/ul/li/span/span[2]');
    this.listOfCarsOnThePage = page.locator('//*[@id="vehicles-page-header"]/div/div/a');
    this.listOfCarsOnThePageInTextFormat = page.locator('//*[@id="vehicles-page-header"]/header/div[3]/span');
    this.listOfCarsReleaseYear = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[2]/div[5]/div/div/a/div[2]/div[2]/div[1]');
    this.fuelTypeAutoCatalogList = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[2]/div[5]/div/div/a/div[2]/div[2]/div[2]');
    this.fuelTypeButton = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[12]/div/button');
    this.fuelTypeList = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[12]/div/div/ul/li/div/div[1]/label');  
    this.carDoesntExistError = page.locator('//html/body/div[2]/div/main/div[2]/div[1]/section/div/div/div[2]/div[5]/div/div/p');
    this.gearboxButton = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[11]/div/button');
    this.gearboxTypeList = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[1]/section/div/div/div[1]/div/ul/li[11]/div/div/ul/li'); 
  }

  async goto() {
    await this.page.goto(this.url);
    await this.acceptCookies();
    await this.waitNetworkIdle();
    await expect(this.page).toHaveURL(/\/catalog/);
  }

  async setBrand(brand: string) {
    await this.brandInput.fill(brand);
    await this.brandResultList.waitFor({state: "visible"});
    await this.page.keyboard.press('Enter');
  }

  async setModel(model: string) {
    await this.modelInput.fill(model);
    await this.modelResultList.first().waitFor({state: "visible"});
    await this.page.keyboard.press('Enter');
  }

  async setYearFrom(year: string) {
    await this.yearFromButton.click();
    await this.yearFromDropdownMenu.getByText(year).scrollIntoViewIfNeeded();
    await this.yearFromDropdownMenu.getByText(year).click();
  }

  async setYearTo(year: string) {
    await this.yearToButton.click();
    await this.yearToDropdownMenu.getByText(year).scrollIntoViewIfNeeded();
    await this.yearToDropdownMenu.getByText(year).click();
  }
  
  async getCountOfCarsOnThePageToString() {
    await this.listOfCarsOnThePage.first().waitFor({timeout: 3000, state: "attached"});
    return (await this.listOfCarsOnThePage.count()).toString(); //should be used in regular validation for the cars on the page < 25
  } 

}
