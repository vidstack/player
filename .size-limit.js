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
    path: 'dist-prod/index.js',
    import: `{ ${element} }`
  }));

module.exports = [
  ...elements,
  {
    name: "import '@vidstack/elements'",
    limit: '35 kB',
    path: 'dist-prod/index.js'
  }
];
