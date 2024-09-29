import {defineField, defineType} from 'sanity'

export const questionsType = defineType({
  name: 'questions',
  title: 'Questions',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'number',
      type: 'string',
    }),
    defineField({
      name: 'content',
      type: 'string',
    }),
    defineField({
      name: 'author',
      type: 'string',
    }),
    defineField({
      name: 'week',
      type: 'string',
    }),
  ],
})
