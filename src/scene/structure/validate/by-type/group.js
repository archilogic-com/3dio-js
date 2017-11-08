export default {
  params: {
    src: {
      type: 'string',
      optional: true,
      skipInAframe: true
    }
  },
  childrenTypes: ['interior', 'object', 'wall', 'box', 'group', 'polybox'],
  parentTypes: ['level', 'group']
}