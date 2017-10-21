export default {
  params: {
    src: {
      type: 'string',
      optional: true,
      skipInAframe: true
    }
  },
  possibleChildrenTypes: ['interior', 'object', 'wall', 'box', 'group', 'polybox']
}