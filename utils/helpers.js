// Chapter 8: small, pure functions that are NOT tied to any page.

/** "$29.99" or "Item total: $39.98" -> 29.99 / 39.98 */
exports.parsePrice = (text) => parseFloat(String(text).replace(/[^0-9.]/g, ''));

exports.sumPrices = (prices) =>
  Math.round(prices.reduce((a, b) => a + b, 0) * 100) / 100;

exports.isSortedAsc = (arr) => arr.every((v, i) => i === 0 || arr[i - 1] <= v);
exports.isSortedDesc = (arr) => arr.every((v, i) => i === 0 || arr[i - 1] >= v);

/** Unique values so parallel tests never clash on data */
exports.randomPostalCode = () => String(Math.floor(10000 + Math.random() * 90000));
exports.uniqueName = (prefix = 'user') => `${prefix}_${Date.now()}`;
