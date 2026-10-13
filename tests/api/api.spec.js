// Chapter 11 (part 1): pure API tests with Playwright's `request` fixture.
// SauceDemo has no public backend API, so we use jsonplaceholder (a free demo API) to show the pattern.
const { test, expect } = require('@playwright/test');

test.describe('API', () => {
  test('GET a post', { tag: ['@api', '@smoke'] }, async ({ request }) => {
    const res = await request.get('/posts/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
  });

  test('POST creates a resource', { tag: ['@api', '@regression'] }, async ({ request }) => {
    const res = await request.post('/posts', {
      data: { title: 'framework demo', body: 'hello', userId: 1 },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe('framework demo');
  });
});
