/* eslint-env node */

module.exports = {
  extends: [
    '@spotify',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'import/extensions': [
      'error',
      'always',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],
    'new-cap': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
