/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: [
    "html",
    "lcov",
    "text"
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      statement: 100
    }
  }
};
