export default {
  params: {
    src: {
      type: 'string',
      optional: true
    }
  },
  possibleChildrenTypes: ['interior', 'object', 'wall', 'box', 'group', 'polybox']
}