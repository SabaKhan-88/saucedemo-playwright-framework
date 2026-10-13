// Chapter 9: custom fixtures replace repeated setup (and your Selenium BaseClass/@BeforeMethod).
// Tests just ask by name:  test('...', async ({ loginPage, inventoryPage }) => {...})
const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

exports.test = base.test.extend({
  // Depends on built-in `page`. Setup before use(), teardown after use().
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage); // <-- the test runs here
    // teardown code (if any) goes here
  },

  // Assumes the user is already logged in (storageState from the setup project)
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.open();
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Worker-scoped example (runs once per worker, good for expensive things like DB connections):
  // dbConnection: [async ({}, use) => { const db = await connect(); await use(db); await db.close(); }, { scope: 'worker' }],
});

exports.expect = base.expect;
