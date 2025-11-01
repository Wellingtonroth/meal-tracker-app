import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: false,
  ignores: [
    '**/node_modules',
    '.nuxt',
    '.output',
    'dist',
    'coverage',
    '.husky',
    '.github',
    '*.yml',
    '*.yaml',
    'public/**',
  ],
  rules: {
    'vue/block-order': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'style/no-trailing-spaces': 'off',
    // 'style/comma-dangle': 'off',
  },
})
