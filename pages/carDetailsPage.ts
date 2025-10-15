import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CarDetailsPage {
  readonly page: Page;
  readonly carName: Locator;
  readonly fuelType: Locator;
  readonly gearbox: Locator;
  readonly releaseYear: Locator;

  constructor(page: Page) {
    this.page = page;
    this.carName = page.locator('h1[class]');
    this.fuelType = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[2]/div/div[2]/div/div[1]/div').nth(1);
    this.gearbox = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[2]/div/div[2]/div/div[1]/div').nth(3);
    this.releaseYear = page.locator('//*[@id="__nuxt"]/div/main/div[2]/div[2]/div/div[2]/div/div[1]/div').nth(0);
  }

  async backOnPreviousPage() {
    await this.page.goBack();
  }

}