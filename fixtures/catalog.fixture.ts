import { test as base, expect, Page } from '@playwright/test';
import { CatalogPage } from '../pages/сatalogPage';

type Fixtures = {
  catalog: CatalogPage;
};

export const test = base.extend<Fixtures>({
  catalog: async ({ page }, use) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await use(catalog);
  },
});

export { expect };