import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  versions: {
    maxPerDoc: 100,
    drafts: {
      autosave: true,
      validate: false,
    },
  },
  auth: true,
  fields: [
    {
      type: 'array',
      // localized: true,
      name: 'ingredient-sections',
      fields: [
        {
          type: 'array',
          // localized: true,
          name: 'section-ingredients',
          fields: [
            {
              type: 'text',
              localized: true,
              name: 'ingredient-name',
            },
          ],
        },
      ],
    },
  ],
}
