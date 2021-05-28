module.exports = {
   extends: [
      '@ni/eslint-config/typescript',
      '@ni/eslint-config/typescript-requiring-type-checking',
      'plugin:prettier/recommended'
   ],
   parserOptions: {
      project: 'tsconfig.json'
   },
   rules: {
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-void': 'off'
   }
}