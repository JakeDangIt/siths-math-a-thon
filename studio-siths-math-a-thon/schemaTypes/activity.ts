import {defineField, defineType} from 'sanity'

export const activityType = defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      type: 'string',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
    }),
  ],
})
