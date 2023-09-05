import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().nonempty().optional(),
    description: z.string().nonempty(),
    sidebar_title: z.string().optional(),
  }),
});

export const collections = {
  docs,
};
