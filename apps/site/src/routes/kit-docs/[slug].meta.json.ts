import {
  createMetaRequestHandler,
  type FileResolver,
  type MarkdownHeader,
  type MetaTransform,
} from '@svelteness/kit-docs/node';
import type { ComponentMeta } from '@vidstack/eliza';
import { kebabToTitleCase, lowercaseFirstLetter } from '@vidstack/foundation';
import { readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';

const __cwd = process.cwd();

const componentsDirRE = /\/components\//;
const noDocsRE = /(youtube|vimeo)/;
const apiRE = /\/api\/?$/;
const quickstartRE = /getting-started\/quickstart/;
const noImportsRE = /(youtube|vimeo|controls|buffering-indicator)/;

const titles = {
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

const resolveComponentDocs: FileResolver = (slug, { resolve }) => {
  if (!componentsDirRE.test(slug) || apiRE.test(slug)) return;

  const hasDocs = !noDocsRE.test(slug);
  const hasImports = !noImportsRE.test(slug);

  const docsSlug = hasDocs
    ? slug.replace(/(.+)\/(.*?)$/, '$1/$2/_Docs').replace('/react', '')
    : slug;

  return {
    file: resolve(docsSlug),
    transform: ({ meta }) => {
      const name = basename(slug.replace(/\/react\/?/, ''));
      const title = titles[name] ?? kebabToTitleCase(name);

      meta.title = `${title} Docs${/react/.test(slug) ? ' (React)' : ''}`;
      meta.frontmatter.component_frameworks = hasDocs;

      if (hasImports && meta.headers[0]?.title !== 'Import') {
        meta.frontmatter.component_imports = true;
        meta.headers.unshift({ level: 2, title: 'Import', slug: 'import' });
      }
    },
  };
};

const transformApi: MetaTransform = ({ slug, meta }) => {
  if (!componentsDirRE.test(slug) || !apiRE.test(slug)) return;

  const name = basename(dirname(slug.replace(/\/react/, '')));
  const tagName = `vds-${name}`;

  const isReact = /\/react\/?/.test(slug);
  const componentName = titles[name] ?? kebabToTitleCase(name);
  const titlePostfix = isReact ? ' (React)' : '';
  const title = `${componentName} API${titlePostfix}`;

  meta.title = title;
  meta.frontmatter.component_frameworks = true;
  meta.frontmatter.component_imports = !noImportsRE.test(slug);

  if (!meta.headers.length) {
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

    meta.headers.push(...headers);
  }
};

export const transformQuickstart: MetaTransform = ({ slug, meta }) => {
  if (!quickstartRE.test(slug) || meta.headers.length) return;

  const headers = [
    { title: 'Player Installation', slug: 'player-installation', level: 2, children: [] },
    { title: 'Native Media Controls', slug: 'native-media-controls', level: 2, children: [] },
    { title: 'Media Autoplay', slug: 'media-autoplay', level: 2, children: [] },
    { title: 'Player Poster', slug: 'player-poster', level: 2, children: [] },
    { title: 'Player Sizing', slug: 'player-sizing', level: 2, children: [] },
    { title: 'Player Skins', slug: 'player-skins', level: 2, children: [] },
    !/(quickstart\/(cdn|react))/.test(slug) && {
      title: 'Importing Everything',
      slug: 'importing-everything',
      level: 2,
      children: [],
    },
  ].filter(Boolean) as MarkdownHeader[];

  meta.headers.push(...headers);
};

export const get = createMetaRequestHandler({
  exclude: ['/index'],
  resolve: [resolveComponentDocs],
  transform: [transformApi, transformQuickstart],
});
