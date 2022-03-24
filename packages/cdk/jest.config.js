const base = require("../../jest.config");
const packageJson = require("./package");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  ...base,
  testEnvironment: "node",
  name: packageJson.name,
  displayName: packageJson.name,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
};
