import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url)),
  pkgPath = path.resolve(__dirname, '../package.json'),
  pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

pkg.dependencies.vidstack = `${pkg.version}@next`;

fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
