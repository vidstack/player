import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pkgPath = resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath).toString());
pkg.dependencies['@vidstack/player'] = pkg.version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
