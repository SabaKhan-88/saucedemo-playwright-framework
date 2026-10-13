# SauceDemo Playwright Framework

Practice framework for https://www.saucedemo.com (Playwright + JavaScript).
Read `docs/FRAMEWORK_STORY.md` first: it explains why each folder exists, in build order.

## Setup
```bash
npm install
npx playwright install
```

## Run
```bash
npm test                 # everything (env: qa)
npm run test:smoke       # @smoke
npm run test:regression  # @regression
npm run test:e2e         # @e2e
npm run test:mock        # @mock
npm run test:api         # API project only
npm run test:headed      # watch the browser
npm run test:debug       # Playwright Inspector
npm run test:ui          # UI mode (time-travel debugging)
npm run test:staging     # use .env.staging
npm run report           # open HTML report
npm run codegen          # record a test
```
Useful CLI: `npx playwright test --grep @smoke --project=chromium --workers=1 --retries=1 --headed`

Open a trace: `npx playwright show-trace test-results/<test-folder>/trace.zip`

## Structure
```
saucedemo-playwright-framework/
├── tests/
│   ├── setup/auth.setup.js            login once -> saves storageState
│   ├── ui/                            login, products, cart, checkout
│   ├── api/api.spec.js                API tests
│   ├── hybrid/fast-setup.spec.js      session shortcuts + UI verify
│   ├── mocking/network-mocking.spec.js
│   └── flaky/flaky-handling.spec.js
├── pages/                             Page Object Model
├── fixtures/test-fixtures.js          custom fixtures
├── utils/                             helpers, test data loader, constants
├── test-data/                         users / products / checkout JSON
├── .env.qa  .env.staging  .env.example
├── playwright.config.js
├── docs/FRAMEWORK_STORY.md
└── .github/workflows/playwright.yml   CI example
```

## Notes
- Why `--grep "@smoke|@setup"`? The auth setup test must run too, or tests that depend on the saved login will fail.
- SauceDemo has no real backend API, so API tests use jsonplaceholder, and the "fast setup" tests use SauceDemo's cookie/localStorage session.
- Real secrets belong in `.env` (git-ignored) or CI secrets. The `.env.qa` values here are SauceDemo's public demo credentials.
