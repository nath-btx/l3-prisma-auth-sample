module.exports = {
  // specifies the eslint parser
  parserOptions: {
    // allows for the parsing of modern ecmascript features
    ecmaVersion: 2019,
    // allows for the use of imports
    sourceType: 'module',
  },
  env: {
    // browser global variables.
    browser: true,
    // allows es6 global variable
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', require('./prettier.config.js')],
  },
}