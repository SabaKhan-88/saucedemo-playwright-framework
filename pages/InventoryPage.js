const { BasePage } = require('./BasePage');
const { parsePrice } = require('../utils/helpers');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async open() {
    await this.goto('/inventory.html');
  }

  async getProductNames() {
    return this.itemNames.allTextContents();
  }

  async getProductPrices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(parsePrice);
  }

  async sortBy(optionValue) {
    // az | za | lohi | hilo
    await this.sortDropdown.selectOption(optionValue);
  }

  productCard(productName) {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName) {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName) {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
