import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANDS, SERVICES } from '@/lib/content';

// The kinds of work a post or project covers. Add a value here when the owner names a new one.
export const DISCIPLINES = ['ai', 'automation', 'copywriting', 'web-design'] as const;

const faq = z.object({ question: z.string(), answer: z.string() });
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// One folder per post: index.mdx plus the images it uses. The body starts at the first `##`.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '*/index.mdx' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    disciplines: z.array(z.enum(DISCIPLINES)).default([]),
    author: z.string(),
    published: isoDate,
    /** Set only when the post was revised after publishing. */
    updated: isoDate.optional(),
    /** Full-screen cover photo under the title (a path in public/). Without one, the title sits on stripes. */
    cover: z.string().optional(),
    /** The question Ask AI opens with, about this page. */
    aiQuestion: z.string().optional(),
    /** The action after the article. */
    cta: z.object({ label: z.string(), href: z.string() }),
    intro: z.string(),
    tldr: z.array(z.string()).min(1),
    faqs: z.array(faq),
  }),
});

// One folder per project: index.mdx plus its media. `presentation` picks the page layout,
// so a project can get its own treatment later without a new collection.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*/index.mdx' }),
  schema: z.object({
    title: z.string(),
    /** The breadcrumb and browser-tab name. */
    shortTitle: z.string(),
    presentation: z.enum(['case-study']).default('case-study'),
    kind: z.enum(['client', 'internal']),
    /** A name from BRANDS in src/lib/content.ts; required for client work. */
    client: z.string().refine((name) => BRANDS.some((brand) => brand.name === name), 'client must be a BRANDS name').optional(),
    disciplines: z.array(z.enum(DISCIPLINES)).min(1),
    services: z.array(z.string().refine((service) => SERVICES.includes(service), 'service must be in SERVICES')).min(1),
    length: z.string().optional(),
    companySize: z.string().optional(),
    annualRevenue: z.string().optional(),
    /** Placeholder or unfinished entries stay out of search engines. */
    noindex: z.boolean().default(false),
  }).refine((entry) => entry.kind === 'internal' || entry.client, { message: 'client work needs a client', path: ['client'] }),
});

export const collections = { blog, work };
