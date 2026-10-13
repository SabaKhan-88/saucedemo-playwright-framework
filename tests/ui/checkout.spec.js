const { test, expect } = require('../../fixtures/test-fixtures');
const { products, checkout } = require('../../utils/testData');

test.describe('Checkout', () => {
  test('complete purchase end-to-end', { tag: ['@smoke', '@e2e', '@regression'] }, async ({
    inventoryPage, cartPage, checkoutPage,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo(checkout.customer);
    await checkoutPage.continue();
    await expect(checkoutPage.subtotalLabel).toBeVisible();

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('item total equals sum of product prices', { tag: '@regression' }, async ({
    inventoryPage, cartPage, checkoutPage,
  }) => {
    const { sumPrices } = require('../../utils/helpers');
    const prices = await inventoryPage.getProductPrices();
    const names = await inventoryPage.getProductNames();

    const pick = [products.backpack, products.bikeLight];
    const expected = sumPrices(pick.map((n) => prices[names.indexOf(n)]));

    for (const p of pick) await inventoryPage.addToCart(p);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(checkout.customer);
    await checkoutPage.continue();

    expect(await checkoutPage.getSubtotal()).toBe(expected);
  });

  // Data-driven negative tests
  for (const c of checkout.invalidCases) {
    test(`checkout validation: ${c.name}`, { tag: '@regression' }, async ({
      inventoryPage, cartPage, checkoutPage,
    }) => {
      await inventoryPage.addToCart(products.backpack);
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo(c);
      await checkoutPage.continue();
      await expect(checkoutPage.errorMessage).toContainText(c.expectedError);
    });
  }
});
