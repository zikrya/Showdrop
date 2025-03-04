/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    moduleDirectories: ["node_modules", "<rootDir>/"],
    transform: {
      "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    },
    testMatch: ["<rootDir>/**/*.test.{js,jsx,ts,tsx}"],
    collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/node_modules/**",
    ],
  };
