export default {
  description: 'group node, for relative positioning',
  params: {
    src: {
      type: 'string',
      optional: true,
      skipInAframe: true
    }
  },
  childrenTypes: [
    'box',
    'column',
    'group',
    'interior',
    'object',
    'polybox',
    'wall'
  ],
  parentTypes: [
    'level',
    'group'
  ]
}