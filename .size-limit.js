const path = require('path');
const { sync: globSync } = require('fast-glob');

const elements = globSync('src/**/*Element.ts')
  .filter(
    (filePath) => !filePath.includes('test') && !filePath.includes('src/base')
  )
  .map((filePath) => path.basename(filePath, path.extname(filePath)))
  .map((element) => ({
    name: `import { ${element} } from '@vidstack/elements'`,
    limit: '15 kB',
    path: 'dist-prod/bundle/index.js',
    import: `{ ${element} }`
  }));

module.exports = [
  {
    name: "import '@vidstack/elements'",
    limit: '35 kB',
    path: 'dist-prod/bundle/index.js'
  },
  {
    name: "import '@vidstack/elements/define'",
    limit: '35 kB',
    path: 'dist-prod/bundle/define.js'
  },
  ...elements
];
