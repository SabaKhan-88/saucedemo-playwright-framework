// Chapter 12: page.route() lets you fake the backend: mock, fail, or block requests.
// Register the route BEFORE the action that triggers the request.
const { test, expect } = require('../../fixtures/test-fixtures');

test.describe('Network mocking', () => {
  test('block images - page still works', { tag: ['@mock', '@regression'] }, async ({ page, inventoryPage }) => {
    // inventoryPage fixture already navigated, so re-register then reload
    await page.route(/\.(png|jpg|jpeg|webp)$/, (route) => route.abort());
    await page.reload();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('mock a successful API response', { tag: '@mock' }, async ({ page, inventoryPage }) => {
    await page.route('**/api/products', (route) =>
      route.fulfill({ status: 200, json: [{ id: 1, name: 'Fake Item' }] })
    );
    // Demo: the page itself calls the endpoint; on a real app the UI would trigger this call.
    const data = await page.evaluate(() => fetch('/api/products').then((r) => r.json()));
    expect(data).toEqual([{ id: 1, name: 'Fake Item' }]);
  });

  test('simulate backend failure (HTTP 500)', { tag: '@mock' }, async ({ page, inventoryPage }) => {
    await page.route('**/api/products', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );
    const status = await page.evaluate(() => fetch('/api/products').then((r) => r.status));
    expect(status).toBe(500);
  });

  test('modify a request and let it continue', { tag: '@mock' }, async ({ page, inventoryPage }) => {
    let seenHeader;
    await page.route('**/api/ping', (route) => {
      seenHeader = route.request().headers()['x-test-run'];
      route.fulfill({ status: 200, body: 'pong' });
    });
    await page.evaluate(() => fetch('/api/ping', { headers: { 'x-test-run': 'framework' } }));
    expect(seenHeader).toBe('framework');
  });
});
