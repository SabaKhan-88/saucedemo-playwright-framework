// Chapter 4: one place to load test data (JSON) + credentials (from .env).
const users = require('../test-data/users.json');
const products = require('../test-data/products.json');
const checkout = require('../test-data/checkout.json');

// Credentials come from environment variables, never hardcoded in tests.
const getValidCredentials = () => ({
  username: process.env.STANDARD_USER,
  password: process.env.PASSWORD,
});

module.exports = { users, products, checkout, getValidCredentials };
