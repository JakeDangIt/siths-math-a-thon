import {defineField, defineType} from 'sanity'

export const activityType = defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'content',
      type: 'string',
    }),
  ],
})
