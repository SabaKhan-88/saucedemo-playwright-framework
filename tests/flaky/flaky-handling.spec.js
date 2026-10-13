// Chapter 15: keep the suite stable. Detect -> Investigate -> Fix -> Monitor.
const { test, expect } = require('../../fixtures/test-fixtures');
const { products } = require('../../utils/testData');

test.describe('Flaky-proof patterns', () => {
  test('GOOD: web-first assertion auto-waits (no hard waits)', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    // BAD:  await page.waitForTimeout(3000); expect(await badge.textContent()).toBe('1')
    // GOOD: retries until the condition is true or the expect timeout hits
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('GOOD: log the retry number so flaky runs are visible in reports', { tag: '@regression' }, async ({ inventoryPage }, testInfo) => {
    if (testInfo.retry > 0) console.log(`Retry #${testInfo.retry} for: ${testInfo.title}`);
    await expect(inventoryPage.items.first()).toBeVisible();
  });

  // QUARANTINE: skip temporarily WITH a ticket reference. Never silently delete a test.
  test('QUARANTINED example', { tag: '@regression' }, async () => {
    test.fixme(true, 'JIRA-1234: intermittent failure, under investigation');
  });
});

// Per-suite override example (use sparingly; fix the cause first):
// test.describe.configure({ retries: 2 });
