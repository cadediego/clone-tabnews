process.env.NODE_ENV = "development";
const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testEnvironment: "node",
  testTimeout: 60000,
});

module.exports = jestConfig;
