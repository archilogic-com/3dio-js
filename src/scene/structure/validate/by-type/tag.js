export default {
  description: 'all kinds of stairs types',
  params: {
    v: {
      type: 'number',
      defaultValue: 0,
      optional: true,
      description: 'version'
    },
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
