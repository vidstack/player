import { derived, writable } from 'svelte/store';

export type MarkdownFrontmatter = Record<string, unknown>;

export type MarkdownHeader = {
  level: number;
  title: string;
  slug: string;
  children: MarkdownHeader[];
};

export type MarkdownMeta = {
  title: string;
  description: string;
  excerpt: string;
  headers: MarkdownHeader[];
  frontmatter: MarkdownFrontmatter;
  lastUpdated: number;
};

export const markdownMeta = writable<MarkdownMeta | null>(null);
export const markdownSlug = writable<string>('');

export const hasMarkdownHeaders = derived(
  markdownMeta,
  (meta) =>
    meta?.headers &&
    [...meta.headers.map((h) => h.title), ...meta.headers.map((h) => h.children).flat()].length > 1,
);
