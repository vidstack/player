import {
  createMetaRequestHandler,
  type FileResolver,
  getFrontmatter,
  type MarkdownHeader,
  type MetaTransform,
  resolveSlug,
} from '@svelteness/kit-docs/node';
import type { ComponentMeta } from '@vidstack/eliza';
import { kebabToTitleCase, lowercaseFirstLetter } from '@vidstack/foundation';
import { readFileSync } from 'fs';
import { basename, resolve } from 'path';

const __cwd = process.cwd();

const quickstartRE = /\/quickstart/;
const componentsDirRE = /\/components\//;
const noDocsRE = /(youtube|vimeo)/;
const apiRE = /\/api\/?$/;
const noImportsRE = /(youtube|vimeo|controls|buffering-indicator)/;

const componentTitles = {
  hls: 'HLS',
  youtube: 'YouTube',
};

const components: ComponentMeta[] = [];

try {
  const elementsPath = resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
  const elements = JSON.parse(readFileSync(elementsPath).toString());
  components.push(...elements.components);
} catch (e) {
  // no-op
}

const resolveQuickstartDocs: FileResolver = (slug, { resolve }) => {
  if (!quickstartRE.test(slug)) return;
  return 'src/routes/docs/player/[...1]getting-started/[...1_deep]quickstart/__layout.md';
};

const resolveComponentDocs: FileResolver = (slug, { resolve }) => {
  if (!componentsDirRE.test(slug)) return;

  const hasDocs = !noDocsRE.test(slug);

  const docsSlug = hasDocs
    ? slug
        .replace(/(.+)\/(.*?)$/, '$1/$2/_Docs')
        .replace('/react', '')
        .replace('/api', '')
    : slug;

  return resolve(docsSlug);
};

const transformQuickstartDocs: MetaTransform = ({ slug, meta }) => {
  if (!quickstartRE.test(slug)) return;

  const fileContent = readFileSync(resolveSlug(slug)).toString();
  const frontmatter = getFrontmatter(fileContent);

  meta.title = frontmatter.title;
  meta.description = frontmatter.description;
};

const transformComponentsDocs: MetaTransform = ({ slug, meta }) => {
  if (!componentsDirRE.test(slug)) return;

  const name = basename(slug.replace(/\/react\/?/, '').replace(/\/?api$/, ''));
  const title = componentTitles[name] ?? kebabToTitleCase(name);
  const hasImports = !noImportsRE.test(slug);
  const isApiSlug = apiRE.test(slug);

  meta.title = `${title} ${isApiSlug ? 'API' : 'Docs'}${/react/.test(slug) ? ' (React)' : ''}`;

  if (!isApiSlug && hasImports && meta.headers[0]?.title !== 'Import') {
    meta.frontmatter.component_imports = true;
    meta.headers.unshift({ level: 2, title: 'Import', slug: 'import' });
  }
};

const transformApi: MetaTransform = ({ slug, meta }) => {
  if (!componentsDirRE.test(slug) || !apiRE.test(slug)) return;

  const name = basename(slug.replace(/\/react/, '').replace(/\/?api$/, ''));
  const tagName = `vds-${name}`;
  const component = components.find((component) => component.tagName === tagName);

  const title = {
    props: 'Properties',
    methods: 'Methods',
    events: 'Events',
    slots: 'Slots',
    cssProps: 'CSS Props',
    cssParts: 'CSS Parts',
  };

  const headers: MarkdownHeader[] = (
    ['props', 'methods', 'events', 'slots', 'cssProps', 'cssParts'] as const
  )
    .filter((key) => (component[key]?.length ?? 0) > 0)
    .map((key) => ({
      title: title[key],
      slug: lowercaseFirstLetter(title[key].replace(' ', '').replace('CSS', 'css')),
      level: 2,
    }));

  meta.headers = [...headers];
  meta.frontmatter.component_imports = !noImportsRE.test(slug);
};

export const get = createMetaRequestHandler({
  exclude: ['/index.svelte'],
  extensions: ['.md', '.svelte'],
  resolve: [resolveQuickstartDocs, resolveComponentDocs],
  transform: [transformQuickstartDocs, transformComponentsDocs, transformApi],
});
