import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files whose name starts with "_" are ignored, so they can be used as scratch drafts.
const markdown = (folder: string) =>
  glob({ pattern: '**/[^_]*.md', base: `./src/content/${folder}` });

const articles = defineCollection({
  loader: markdown('articles'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      project: reference('projects').optional(),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

const notes = defineCollection({
  loader: markdown('notes'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    project: reference('projects').optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: markdown('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(['active', 'paused', 'shipped', 'archived']).default('active'),
      started: z.coerce.date().optional(),
      links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      // Lower numbers are listed first.
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles, notes, projects };
