import path from 'node:path';

import fs from 'fs-extra';

const cwd = process.cwd();

export function copyPkgFiles() {
  const pkgPath = path.resolve(cwd, 'package.json'),
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')),
    distDir = path.resolve(cwd, 'dist-npm');

  const root = (p) => path.resolve(cwd, p),
    dist = (p) => path.resolve(distDir, p);

  const validPkgFields = [
    'name',
    'description',
    'private',
    'version',
    'license',
    'type',
    'types',
    'sideEffects',
    'engines',
    'dependencies',
    'peerDependencies',
    'contributors',
    'repository',
    'bugs',
    'exports',
    'publishConfig',
    'keywords',
  ];

  // Create package.json.
  const distPkg = {};
  for (const field of validPkgFields) distPkg[field] = pkg[field];

  // Use publish fields.
  distPkg.types = pkg.$types;
  distPkg.exports = pkg.$exports;

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  fs.writeFileSync(dist('package.json'), JSON.stringify(distPkg, null, 2), 'utf-8');

  // Copy over license and readme.
  fs.copyFileSync(root('LICENSE'), dist('LICENSE'));

  if (fs.existsSync(root('README.md'))) {
    fs.copyFileSync(root('README.md'), dist('README.md'));
  }
}
