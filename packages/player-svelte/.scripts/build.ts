function vdsSveltePlugin(): Plugin {
  return {
    name: '@vidstack/player/svelte',
    async transform(components) {
      const CLIENT_INDEX_FILE = resolve(CWD, 'src/svelte/client/index.ts');
      const CLIENT_OUTPUT_DIR = resolve(CWD, 'src/svelte/client/components');
      const NODE_INDEX_FILE = resolve(CWD, 'src/svelte/node/index.ts');
      const NODE_OUTPUT_DIR = resolve(CWD, 'src/svelte/node/components');

      const INDEX_FILES = [CLIENT_INDEX_FILE, NODE_INDEX_FILE];
      const OUTPUT_DIRS = [CLIENT_OUTPUT_DIR, NODE_OUTPUT_DIR];

      for (const dir of OUTPUT_DIRS) {
        if (!existsSync(dir)) {
          mkdirSync(dir);
        }
      }

      const index: string[] = [
        AUTO_GEN_COMMENT,
        '',
        "export * from '../../index.js';",
        "export * from './lib/index.js';",
        '',
      ];

      for (const component of components) {
        const { className } = component;

        const displayName = className.replace('Element', '');
        const outputFileName = displayName;

        const slots = `['default', ${component.slots
          .map((slot) => slot.name.toLowerCase())
          .filter((slot) => slot !== 'default')
          .map((slot) => `'${slot}'`)
          .join(', ')}]`;

        const componentContent = (ssr: boolean) => `
          // [@vidstack/eliza] THIS FILE IS AUTO GENERATED - SEE \`eliza.config.ts\`
          ${ssr ? '' : `\nimport '../../../define/${component.tagName}.js';\n`}
          import { createComponent } from '../lib/index.js';

          export default createComponent('${component.tagName}', ${slots});
        `;

        for (const dir of OUTPUT_DIRS) {
          const outputPath = resolve(dir, `${outputFileName}.js`);
          const ssr = dir.includes('svelte/node');
          writeFileFormattedSync(outputPath, componentContent(ssr));
        }

        index.push(
          `export { default as ${displayName} } from './components/${outputFileName}.js';`,
        );
      }

      for (const indexFile of INDEX_FILES) {
        writeFileSync(indexFile, [...index, ''].join('\n'));
      }

      const rootSvelteDir = resolve(CWD, 'svelte');

      if (!existsSync(rootSvelteDir)) {
        mkdirSync(rootSvelteDir);
      }

      writeFileSync(
        resolve(rootSvelteDir, 'index.js'),
        "// This file only exists so it's easier for you to autocomplete the file path in your IDE.",
      );
    },
  };
}
