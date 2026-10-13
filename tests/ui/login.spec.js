const { test, expect } = require('../../fixtures/test-fixtures');
const { users, getValidCredentials } = require('../../utils/testData');

// Login tests must start LOGGED OUT, so we ignore the saved storageState here.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('valid user can log in', { tag: ['@smoke', '@regression'] }, async ({ loginPage, page }) => {
    const { username, password } = getValidCredentials();
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // Chapter 5: DATA-DRIVEN. One test body, many test cases from JSON.
  for (const c of users.invalidLoginCases) {
    test(`login fails: ${c.name}`, { tag: '@regression' }, async ({ loginPage }) => {
      const password = c.usePasswordFromEnv ? process.env.PASSWORD : c.password;
      await loginPage.login(c.username, password);
      await expect(loginPage.errorMessage).toContainText(c.expectedError);
    });
  }

  test('protected page redirects to login when logged out', { tag: '@regression' }, async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.errorMessage).toContainText('You can only access');
  });
});
