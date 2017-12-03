export default {
  description: 'all kinds of stairs types',
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
