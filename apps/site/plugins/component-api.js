import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const __cwd = process.cwd();

/** @type {import('@vidstack/eliza').ComponentMeta[]} */
const components = [];
const elementsPath = path.resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, { encoding: 'utf-8' }));
components.push(...elements.components);

/**
 * @returns {import('@vitebook/core/node').Plugin}
 */
export default () => {
  const metaProps = /** @type {const} */ ([
    'props',
    'methods',
    'events',
    'slots',
    'cssProps',
    'cssParts',
  ]);

  const headingTitle = {
    props: 'Properties',
    methods: 'Methods',
    events: 'Events',
    slots: 'Slots',
    cssProps: 'CSS Props',
    cssParts: 'CSS Parts',
  };

  const headingId = {
    props: 'properties',
  };

  return {
    name: '@vidstack/component-api',
    vitebookConfig(config) {
      config.markdown.transformMeta.push(({ filePath, meta }) => {
        if (!filePath.endsWith('api.md')) return;

        const docsFilePath = filePath.replace(/api\.md$/, 'index.md');
        const docsFileContent = fs.readFileSync(docsFilePath, { encoding: 'utf-8' });

        meta.frontmatter.description = matter(docsFileContent).data.description;

        const name = path.basename(path.dirname(filePath)).replace(/^\[\d+\]/, '');
        const tagName = `vds-${name}`;
        const component = components.find((component) => component.tagName === tagName);

        if (component) {
          const headings = metaProps
            .filter((key) => (component[key]?.length ?? 0) > 0)
            .map((key) => ({
              title: headingTitle[key],
              id: headingId[key] ?? key,
              level: 2,
            }));

          meta.headings.push(...headings);
        }
      });
    },
  };
};
