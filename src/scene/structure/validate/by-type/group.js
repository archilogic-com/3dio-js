export default {
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