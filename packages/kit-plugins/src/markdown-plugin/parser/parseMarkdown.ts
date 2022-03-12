import fs from 'fs';
import matter from 'gray-matter';
import LRUCache from 'lru-cache';
import path from 'path';
import toml from 'toml';

import type {
  MarkdownMeta,
  MarkdownParser,
  MarkdownParserEnv,
  ParsedMarkdownResult,
  ParseMarkdownOptions,
} from './types';
import { preventViteReplace } from './utils/preventViteReplace';
import { slugify } from './utils/slugify';

export type ParsedMarkdownToSvelteResult = {
  component: string;
  meta: MarkdownMeta;
};

const cache = new LRUCache<string, ParsedMarkdownToSvelteResult>({ max: 1024 });

export function parseMarkdownToSvelte(
  parser: MarkdownParser,
  source: string,
  filePath: string,
  options: ParseMarkdownOptions = {},
): ParsedMarkdownToSvelteResult {
  const cachedResult = cache.get(source);
  if (cachedResult) return cachedResult;

  const {
    html,
    meta,
    env: parserEnv,
  } = parseMarkdown(parser, commentOutTemplateTags(source), filePath, {
    ...options,
  });

  const { hoistedTags = [] } = parserEnv as MarkdownParserEnv;

  const fileName = path.basename(filePath, path.extname(filePath));
  const isRoute = filePath.includes('src/routes/') && !fileName.startsWith('_');

  addGlobalImports(hoistedTags);

  if (isRoute) {
    addHeadTags(filePath, hoistedTags, meta);
    addMarkdownMeta(hoistedTags, meta);
    addMarkdownSlug(options.baseUrl ?? '/', filePath, hoistedTags);
  }

  const component =
    dedupeHoistedTags(hoistedTags).join('\n') + `\n\n${uncommentTemplateTags(html)}`;

  const result: ParsedMarkdownToSvelteResult = {
    component,
    meta,
  };

  cache.set(source, result);
  return result;
}

function addGlobalImports(tags: string[]) {
  const globalImports = [
    'Admonition',
    'ApiLink',
    'AttrWord',
    'ExperimentalWarning',
    'CodeInline',
    'CodeFence',
    'Steps',
    'Step',
    'Link',
    'TabbedLinks',
    'TableOfContents',
    'TableWrapper',
    'Yes',
    'No',
  ]
    .map((component) => `import ${component} from '$components/markdown/${component}.svelte';`)
    .join('\n');

  tags.push(['<script>', globalImports, '</script>'].join('\n'));
}

const ROOT_ROUTES_PATH = path.resolve(process.cwd(), 'src/routes');

function addHeadTags(filePath: string, tags: string[], meta: MarkdownMeta) {
  const segments = filePath.replace(path.resolve(ROOT_ROUTES_PATH, 'docs/player'), '').split('/');
  const category = formatCategory(segments[1] === 'components' ? segments[2] : segments[1]);
  const title = `${category}: ${meta.title ?? ''}`;
  const description = meta.description ?? title;

  tags.push(
    [
      '<svelte:head>',
      `<title>${title} | Vidstack</title>`,
      `<meta name="description" content="${description}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      `<meta name="og:description" content="${description}" />`,
      '</svelte:head>',
    ].join('\n'),
  );
}

function addMarkdownSlug(baseUrl: string, filePath: string, hoistedTags: string[]) {
  const route = `${baseUrl}${path.relative(ROOT_ROUTES_PATH, filePath)}`;

  const slug = route
    .replace(/\/?(index|md).*?$/, '')
    .split('/')
    .map(slugify)
    .join('/');

  hoistedTags.push(
    [
      '<script context="module">',
      `export const /*#__PURE__*/__slug = \`${slug}\`;`,
      '</script>',
    ].join('\n'),
  );

  hoistedTags.push(
    [
      '<script>',
      [
        "import { markdownSlug } from '$stores/markdown';",
        'markdownSlug.set(__slug);',
        "import { onDestroy as __onDestroyMarkdownSlug } from 'svelte';",
        "__onDestroyMarkdownSlug(() => { markdownSlug.set(''); });",
      ].join('\n'),
      '</script>',
    ].join('\n'),
  );
}

function addMarkdownMeta(tags: string[], meta: MarkdownMeta) {
  tags.push(
    [
      '<script context="module">',
      `export const /*#__PURE__*/__markdown = ${JSON.stringify(meta, null, 2)};`,
      '</script>',
    ].join('\n'),
  );

  tags.push(
    [
      '<script>',
      [
        "import { markdownMeta } from '$stores/markdown';",
        'markdownMeta.set(__markdown);',
        "import { onDestroy as __onDestroyMarkdownMeta } from 'svelte';",
        '__onDestroyMarkdownMeta(() => { markdownMeta.set(null); });',
      ].join('\n'),
      '</script>',
    ].join('\n'),
  );
}

function parseMarkdown(
  parser: MarkdownParser,
  source: string,
  filePath: string,
  options: ParseMarkdownOptions = {},
): ParsedMarkdownResult {
  const {
    data: frontmatter,
    content,
    excerpt,
  } = matter(source, {
    excerpt_separator: '<!-- more -->',
    engines: {
      toml: toml.parse.bind(toml),
    },
  });

  const parserEnv: MarkdownParserEnv = {
    filePath,
    frontmatter,
  };

  let html = parser.render(content, parserEnv);

  const excerptHtml = parser.render(excerpt ?? '');

  if (options.escapeConstants) {
    html = preventViteReplace(html, options.define);
  }

  const { headers = [], importedFiles = [], links = [], title = '' } = parserEnv;

  const _title = frontmatter.title ?? title;
  const description = frontmatter.description;

  delete frontmatter['title'];
  delete frontmatter['description'];

  const result: ParsedMarkdownResult = {
    content,
    html,
    links,
    importedFiles,
    env: parserEnv,
    meta: {
      excerpt: excerptHtml,
      headers,
      title: _title,
      description,
      frontmatter,
      lastUpdated: Math.round(fs.statSync(filePath).mtimeMs),
    },
  };

  return result;
}

const TEMPLATE_TAG_RE =
  /(\{#(if|each|await|key).*\})|(\{:(else|then|catch).*\})|(\{\/(if|each|key|await)\})|(\{@(html|debug).*\})/gim;
function commentOutTemplateTags(source: string) {
  return source.replace(TEMPLATE_TAG_RE, (match) => {
    return `<!--&%& ${match} &%&-->`;
  });
}

const TEMPLATE_TAG_COMMENT_RE = /(<!--&%&\s)|(\s&%&-->)/gim;
function uncommentTemplateTags(source: string) {
  return source.replace(TEMPLATE_TAG_COMMENT_RE, '');
}

const OPENING_SCRIPT_TAG_RE = /<\s*script[^>]*>/;
const OPENING_SCRIPT_MODULE_TAG_RE = /<\s*script[^>]*\scontext="module"\s*[^>]*>/;
const CLOSING_SCRIPT_TAG_RE = /<\/script>/;
const OPENING_STYLE_TAG_RE = /<\s*style[^>]*>/;
const CLOSING_STYLE_TAG_RE = /<\/style>/;
const OPENING_SVELTE_HEAD_TAG_RE = /<\s*svelte:head[^>]*>/;
const CLOSING_SVELTE_HEAD_TAG_RE = /<\/svelte:head>/;
function dedupeHoistedTags(tags: string[] = []): string[] {
  const deduped = new Map();

  const merge = (key: string, tag: string, openingTagRe: RegExp, closingTagRE: RegExp) => {
    if (!deduped.has(key)) {
      deduped.set(key, tag);
      return;
    }

    const block = deduped.get(key)!;
    deduped.set(key, block.replace(closingTagRE, tag.replace(openingTagRe, '')));
  };

  tags.forEach((tag) => {
    if (OPENING_SCRIPT_MODULE_TAG_RE.test(tag)) {
      merge('module', tag, OPENING_SCRIPT_MODULE_TAG_RE, CLOSING_SCRIPT_TAG_RE);
    } else if (OPENING_SCRIPT_TAG_RE.test(tag)) {
      merge('script', tag, OPENING_SCRIPT_TAG_RE, CLOSING_SCRIPT_TAG_RE);
    } else if (OPENING_STYLE_TAG_RE.test(tag)) {
      merge('style', tag, OPENING_STYLE_TAG_RE, CLOSING_STYLE_TAG_RE);
    } else if (OPENING_SVELTE_HEAD_TAG_RE.test(tag)) {
      merge('svelte:head', tag, OPENING_SVELTE_HEAD_TAG_RE, CLOSING_SVELTE_HEAD_TAG_RE);
    } else {
      // Treat unknowns as unique and leave them as-is.
      deduped.set(Symbol(), tag);
    }
  });

  return Array.from(deduped.values());
}

function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function kebabToTitleCase(str) {
  return uppercaseFirstLetter(str.replace(/-./g, (x) => ' ' + x[1].toUpperCase()));
}

function formatCategory(path: string) {
  if (path === 'ui') return 'UI';
  return kebabToTitleCase(path);
}
