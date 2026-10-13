const { test, expect } = require('../../fixtures/test-fixtures');
const { products } = require('../../utils/testData');

test.describe('Cart', () => {
  test('added item appears in cart', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([products.backpack]);
  });

  test('removing item empties the cart', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.removeItem(products.backpack);
    await expect(cartPage.items).toHaveCount(0);
  });
});
