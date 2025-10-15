import { Page, expect, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }

    async acceptCookies() {
        const btn = this.page.getByRole('button', { name: /Permite toate/i });
        if (await btn.first().isVisible().catch(()=>false)) await btn.first().click().catch(()=>{});
    }

    async waitNetworkIdle() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(500);
    }

    async waitForListUpdate(
        locator: Locator,
        { 
            timeout = 10000,
            poll = 150 }: { 
            timeout?: number; 
            poll?: number
            } = {}): Promise<void> {
            const start = await locator.evaluateAll(els => els.map(e => (e as HTMLElement).innerText.trim()));
            const startLen = start.length;

            const deadline = Date.now() + timeout;
            while (Date.now() < deadline) {
                const now = await locator.evaluateAll(els => els.map(e => (e as HTMLElement).innerText.trim()));
            if (now.length !== startLen) return;
                const changed = now.some((t, i) => t !== start[i]);
            if (changed) return;
                await this.page.waitForTimeout(poll);
            }
            throw new Error('waitForListUpdate: timeout — list does not updated');
    }  
}
