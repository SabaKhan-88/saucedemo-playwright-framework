// Replaces your Selenium "BaseClass/BasePage": common stuff shared by all pages.
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async currentPath() {
    return new URL(this.page.url()).pathname;
  }
}

module.exports = { BasePage };
