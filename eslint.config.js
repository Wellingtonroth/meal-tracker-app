// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  vue: true,
  typescript: true,
  ignores: [
    '**/node_modules',
    '.nuxt',
    'dist',
    '.github',
  ],
  rules: {
    'style/no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
    'vue/attributes-order': ['error', {
      order: [
        'GLOBAL', // ex.: is
        'DEFINITION', // defineComponent-related
        'LIST_RENDERING', // v-for
        'CONDITIONALS', // v-if / v-else-if / v-else / v-show
        'RENDER_MODIFIERS', // v-once / v-memo
        'UNIQUE', // key / ref / slot / name
        'TWO_WAY_BINDING', // v-model
        'OTHER_DIRECTIVES', // demais v-*
        'OTHER_ATTR', // attrs comuns
        'EVENTS', // @click etc.
        'CONTENT', // conteúdo de slot
      ],
      alphabetical: true,
    }],
    'vue/singleline-html-element-content-newline': 'off',
  },
})
