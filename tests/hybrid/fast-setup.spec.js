// Chapter 11 (part 2): skip slow UI steps by preparing state directly, then verify in the UI.
// SauceDemo is a front-end-only demo (no login/cart API), so its "API" is the browser session:
//   - login  -> a cookie called `session-username`
//   - cart   -> localStorage key `cart-contents`
// On a real app you would call request.post('/api/login') / request.post('/api/cart') instead.
const { test, expect } = require('../../fixtures/test-fixtures');
const { InventoryPage } = require('../../pages/InventoryPage');

test.use({ storageState: { cookies: [], origins: [] } }); // start logged out on purpose

test.describe('Fast setup (API-style) + UI verify', () => {
  test('programmatic login (no login form)', { tag: ['@regression', '@hybrid'] }, async ({ page, context, baseURL }) => {
    await context.addCookies([
      { name: 'session-username', value: 'standard_user', domain: new URL(baseURL).hostname, path: '/' },
    ]);
    const inventory = new InventoryPage(page);
    await inventory.open();
    await expect(inventory.title).toHaveText('Products');
  });

  test('pre-seeded cart shows up in the UI', { tag: ['@regression', '@hybrid'] }, async ({ page, context, baseURL }) => {
    await context.addCookies([
      { name: 'session-username', value: 'standard_user', domain: new URL(baseURL).hostname, path: '/' },
    ]);
    // product ids 4 and 0 = Backpack + Bike Light
    await page.addInitScript(() => localStorage.setItem('cart-contents', '[4,0]'));

    const inventory = new InventoryPage(page);
    await inventory.open();
    await expect(inventory.cartBadge).toHaveText('2');
  });
});
