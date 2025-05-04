// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts-esm',   // ESM + TS support
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],            // treat .ts as ESM
  globals: {
    'ts-jest': {
      useESM: true,                            // enable ESM mode in ts-jest
    },
  },  
  moduleNameMapper: {
    // if you import .ts files without specifying extensions:
    '^(\\.{1,2}/.*)\\.js$': '$1',
  }
};
