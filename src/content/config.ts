import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.union([
      z.date(),
      z.string()
    ]).transform((val) => {
      // If it's already a Date object, return it
      if (val instanceof Date) {
        return val;
      }
      // For YYYY-MM-DD format, parse as UTC to avoid timezone issues
      // This ensures 2025-01-30 stays as January 30
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const [year, month, day] = val.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      }
      // For other formats, parse normally
      return new Date(val);
    }),
    description: z.string().optional(),
  }),
});

export const collections = { blog };