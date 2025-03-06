import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^nanoid$": "<rootDir>/__mocks__/nanoid.ts",
  },
};

export default createJestConfig(config);
