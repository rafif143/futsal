// Shim for node:test -> Jest globals
// This allows test files written for node:test to run under Jest

const describe = global.describe;
const it = global.it;
const test = global.test;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;
const beforeAll = global.beforeAll;
const afterAll = global.afterAll;

module.exports = {
  describe,
  it,
  test,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
};
