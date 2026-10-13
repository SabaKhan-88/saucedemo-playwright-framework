const { test, expect } = require('../../fixtures/test-fixtures');
const { products } = require('../../utils/testData');
const { isSortedAsc, isSortedDesc } = require('../../utils/helpers');

test.describe('Products', () => {
  test('shows all products', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage }) => {
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(products.totalProducts);
  });

  // Data-driven sorting checks
  for (const c of products.sortCases) {
    test(`sort: ${c.name}`, { tag: '@regression' }, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(c.option);
      const values =
        c.by === 'price' ? await inventoryPage.getProductPrices() : await inventoryPage.getProductNames();
      const ok = c.order === 'asc' ? isSortedAsc(values) : isSortedDesc(values);
      expect(ok, `${c.name} -> ${values.join(', ')}`).toBeTruthy();
    });
  }

  test('adding items updates the cart badge', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.addToCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });
});
