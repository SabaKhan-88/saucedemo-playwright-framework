const { BasePage } = require('./BasePage');
const { parsePrice } = require('../utils/helpers');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.errorMessage = page.getByTestId('error');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async getSubtotal() {
    return parsePrice(await this.subtotalLabel.textContent());
  }
}

module.exports = { CheckoutPage };
