import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type Note = CollectionEntry<'notes'>;
export type Project = CollectionEntry<'projects'>;

/** One row in a list of entries, whatever collection it came from. */
export interface Item {
  kind: 'article' | 'note';
  href: string;
  title: string;
  summary: string;
  date: Date;
  tags: string[];
  project?: string;
}

// Drafts show up in `npm run dev` but are left out of the published site.
const isLive = (entry: { data: { draft: boolean } }) => import.meta.env.DEV || !entry.data.draft;
const newestFirst = (a: { data: { date: Date } }, b: { data: { date: Date } }) =>
  b.data.date.valueOf() - a.data.date.valueOf();

export const getArticles = async () => (await getCollection('articles', isLive)).sort(newestFirst);
export const getNotes = async () => (await getCollection('notes', isLive)).sort(newestFirst);
export const getProjects = async () =>
  (await getCollection('projects', isLive)).sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );

export const articleItem = (entry: Article): Item => ({
  kind: 'article',
  href: `/articles/${entry.id}/`,
  title: entry.data.title,
  summary: entry.data.description,
  date: entry.data.date,
  tags: entry.data.tags,
  project: entry.data.project?.id,
});

export const noteItem = (entry: Note): Item => ({
  kind: 'note',
  href: `/notes/${entry.id}/`,
  title: entry.data.title,
  summary: excerpt(entry.body ?? ''),
  date: entry.data.date,
  tags: entry.data.tags,
  project: entry.data.project?.id,
});

/** Articles and notes together, newest first. */
export async function getStream(): Promise<Item[]> {
  const [articles, notes] = await Promise.all([getArticles(), getNotes()]);
  return [...articles.map(articleItem), ...notes.map(noteItem)].sort(
    (a, b) => b.date.valueOf() - a.date.valueOf(),
  );
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const tagSlug = (tag: string) => tag.trim().toLowerCase().replace(/\s+/g, '-');

/** Minutes to read the prose, leaving out image descriptions, embedded HTML and link addresses. */
export function readingMinutes(body = '') {
  const prose = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)(\{[^}]*\})?/g, ' ')
    .replace(/\]\([^)]*\)/g, ']');
  return Math.max(1, Math.round(prose.split(/\s+/).filter(Boolean).length / 220));
}

/** Plain text of the first paragraph of a Markdown body, cut at a word boundary. */
export function excerpt(body: string, max = 180) {
  const paragraphs = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map((block) => block.trim());
  // Skip headings, images, tables, quotes and raw HTML to find the first block of running text.
  const first = paragraphs.find((block) => block && !/^(#|!\[|\||>|<|---)/.test(block)) ?? '';

  const text = first
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)).replace(/[.,;:]$/, '') + '…';
}
