export default {
  env: {
    browser: true,
    es2021: true
  },
  _extends: [
    'plugin:vue/essential',
    'standard'
  ],
  get extends() {
    return this._extends;
  },
  set extends(value) {
    this._extends = value;
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
  }
}
