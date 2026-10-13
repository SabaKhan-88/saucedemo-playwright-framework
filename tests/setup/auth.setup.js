// Chapter 10: log in ONCE, save the session, reuse it in every other test.
const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { getValidCredentials } = require('../../utils/testData');
const { AUTH_FILE } = require('../../utils/constants');

setup('authenticate as standard user', { tag: '@setup' }, async ({ page }) => {
  const { username, password } = getValidCredentials();
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(username, password);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: AUTH_FILE });
});
