export default {
  params: {
    title: {
      type: 'string',
      optional: false
    },
    notes: {
      type: 'string',
      optional: true
    },
  },
  childrenTypes: [],
  parentTypes: ['level', 'interior']
}
