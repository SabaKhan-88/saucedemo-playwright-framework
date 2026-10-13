# The Framework Story (build order)

| # | Chapter | Problem | Solution | Where in this repo |
|---|---------|---------|----------|--------------------|
| 1 | Organize | Messy code | Give everything a home | folder structure |
| 2 | Separate UI from tests | Locators copy-pasted everywhere | Page Object Model | `pages/` |
| 3 | Separate data from tests | Hardcoded values in tests | JSON test data | `test-data/`, `utils/testData.js` |
| 4 | Reduce duplication | Many near-identical tests | Data-driven loops | `tests/ui/login.spec.js` |
| 5 | Separate secrets and environments | Passwords in code, many envs | `.env.*` files / CI secrets | `.env.qa`, `.env.example` |
| 6 | Centralize settings | Settings scattered | `playwright.config.js` | `playwright.config.js` |
| 7 | Reduce repeated setup | Same setup in every test | Custom fixtures | `fixtures/test-fixtures.js` |
| 8 | Reuse small logic | Same helper code repeated | Utilities | `utils/helpers.js` |
| 9 | Skip repeated login | Slow, flaky logins | storageState + setup project | `tests/setup/auth.setup.js` |
| 10 | Faster setup | UI setup is slow | API / session shortcuts + UI verify | `tests/api/`, `tests/hybrid/` |
| 11 | Handle unreal scenarios | Can't force backend errors | `page.route()` mocking | `tests/mocking/` |
| 12 | Run the right tests | Can't run everything always | Tags + `--grep` | `{ tag: '@smoke' }` + npm scripts |
| 13 | Debug failures | "Fails only in CI" | trace, screenshot, video, reports | `playwright.config.js` (`use`, `reporter`) |
| 14 | Keep it stable | Random failures | Fix root cause, retries as safety net, quarantine | `tests/flaky/` |

## One-breath version
Organize -> POM -> JSON data -> data-driven -> .env -> config -> fixtures -> utils -> storageState -> API+UI -> mocking -> tags -> trace/reports -> flaky handling.

## Selenium (Java) -> Playwright (JS) mapping
| Selenium + TestNG | This framework |
|---|---|
| BaseClass | `fixtures/test-fixtures.js` + `pages/BasePage.js` |
| PageClass | `pages/*.js` |
| TestClass | `tests/**/*.spec.js` |
| testng.xml / groups | `playwright.config.js` projects + tags |
| config.properties | `.env.*` + `playwright.config.js` |
| DataProvider | JSON + `for` loop generating tests |
| Extent Reports / listeners | HTML reporter + Trace Viewer |
| RetryAnalyzer | `retries` in config |

## Interview answer: "Explain your framework"
"It's a Playwright + JavaScript framework using Page Object Model. Tests are in `tests/`, page classes in `pages/`, and custom fixtures inject page objects. Test data is JSON, and credentials come from environment files or CI secrets. The config handles environments, retries, reporters and projects. A setup project logs in once and saves storageState. We use API or session shortcuts for fast data setup, `page.route()` for mocking, tags for smoke/regression, and traces, screenshots and videos for debugging failures."
