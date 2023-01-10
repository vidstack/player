import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const __cwd = process.cwd();

const elementsPath = path.resolve(__cwd, 'node_modules/vidstack/elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, { encoding: 'utf-8' }));

/** @type {import('@maverick-js/compiler/analyze').ComponentMeta[]} */
const components = elements.components;

const props = /** @type {const} */ (['props', 'events', 'slots', 'cssvars', 'cssparts', 'members']);

const title = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  cssvars: 'CSS Vars',
  cssparts: 'CSS Parts',
  members: 'Members',
};

/**
 * @returns {import('@vessel-js/app/node').MarkdocMetaTransformer}
 */
export default function componentAPIMeta() {
  return ({ filePath, meta }) => {
    if (!filePath.endsWith('api.md')) return;

    const docsFilePath = filePath.replace(/api\.md$/, 'index.md');
    const docsFileContent = fs.readFileSync(docsFilePath, { encoding: 'utf-8' });

    meta.frontmatter.description = matter(docsFileContent).data.description;

    const name = path.basename(path.dirname(filePath)).replace(/^\[\d+\]/, '');
    const tagName = `vds-${name}`;
    const component = components.find((component) => component.tag.name === tagName);

    if (component) {
      const headings = props
        .filter((key) => (component[key]?.length || 0) > 0)
        .map((key) => ({
          id: key,
          title: title[key],
          level: 2,
        }));

      meta.headings.push(...headings);
    }
  };
}
