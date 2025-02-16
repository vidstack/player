/**
 * Thanks: https://github.com/vuejs/vue-next/blob/master/scripts/release.js
 */
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

import prompt from 'enquirer';
import { execa } from 'execa';
import fsExtra from 'fs-extra';
import kleur from 'kleur';
import minimist from 'minimist';
import semver from 'semver';

const require = createRequire(import.meta.url),
  __dirname = path.dirname(fileURLToPath(import.meta.url)),
  args = minimist(process.argv.slice(2)),
  isDryRun = args.dry,
  isNext = args.next,
  isCDNOnly = args.cdn,
  skippedPackages = [],
  currentVersion = require('../package.json').version,
  packagesDir = fs.readdirSync(path.resolve(__dirname, '../packages')),
  packages = packagesDir.filter((pkg) => !pkg.startsWith('.')),
  preId =
    args.preid || (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)?.[0]),
  versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
  ];

function inc(i) {
  return semver.inc(currentVersion, i, preId);
}

async function run(bin, args, opts = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}

async function dryRun(bin, args, opts = {}) {
  console.info(kleur.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);
}

const runIfNotDry = isDryRun ? dryRun : run;

function getPkgRoot(pkgName) {
  return path.resolve(__dirname, '../packages/' + pkgName);
}

function step(msg) {
  console.info('\n✨ ' + kleur.cyan(msg) + '\n');
}

async function main() {
  let targetVersion = args._[0];

  if (!targetVersion) {
    const { release } = /** @type {{ release: string }} */ (
      await prompt.prompt({
        type: 'select',
        name: 'release',
        message: 'Select release type',
        choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
      })
    );

    if (release === 'custom') {
      targetVersion = /** @type {{ version: string }} */ (
        await prompt.prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version;
    } else {
      targetVersion = /** @type {string[]} */ (release.match(/\((.*)\)/))[1];
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(kleur.red(`🚨 invalid target version: ${targetVersion}`));
  }

  const { yes } = /** @type {{ yes: boolean }} */ (
    await prompt.prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing v${targetVersion}${isNext ? '-next' : ''}. Confirm?`,
    })
  );

  if (!yes) {
    return;
  }

  if (isCDNOnly) {
    await publishCDN(targetVersion);
    return;
  }

  step('Updating cross dependencies...');
  updateVersions(targetVersion);

  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion, runIfNotDry);
  }

  step('Adding back workspace settings...');
  updateVersions('workspace:*');

  step('Updating lockfile...');
  await run(`pnpm`, ['install']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('Committing changes...');

    const commit = `chore(release): v${targetVersion}${isNext ? '-next' : ''}`;
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-m', commit]);
  } else {
    console.log('No changes to commit.');
  }

  const tag = `v${targetVersion}${isNext ? '-next' : ''}`;
  await runIfNotDry('git', ['tag', tag]);

  step('Generating changelog...');
  await run('pnpm', ['changelog']);
  await runIfNotDry('git', ['add', '-A']);
  await runIfNotDry('git', ['commit', '-m', 'chore(release): update changelog']);

  step('Pushing to GitHub...');
  await runIfNotDry('git', ['push', 'upstream', `refs/tags/${tag}`]);
  await runIfNotDry('git', ['push', 'upstream', 'main']);

  await publishCDN(targetVersion);

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`);
  }

  if (skippedPackages.length) {
    console.log(
      kleur.yellow(
        `The following packages are skipped and NOT published:\n- ${skippedPackages.join('\n- ')}`,
      ),
    );
  }
  console.log();
}

function updateVersions(version) {
  // 1. update root package.json
  updatePackageVersion(path.resolve(__dirname, '..'), version);
  // 2. update all packages
  packages.forEach((p) => updatePackageVersion(getPkgRoot(p), version));
}

function updatePackageVersion(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  if (version !== 'workspace:*') pkg.version = version;

  if (!pkg.private) {
    updatePackageDeps(pkg, 'dependencies', version);
    updatePackageDeps(pkg, 'peerDependencies', version);
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

const workspace = new Set();

function updatePackageDeps(pkg, depType, version) {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach((dep) => {
    if (workspace.has(dep) || deps[dep] === 'workspace:*') {
      const color = version === 'workspace:*' ? 'cyan' : 'yellow';
      console.log(kleur[color](`🦠 ${pkg.name} -> ${depType} -> ${dep}@${version}`));
      deps[dep] = version;
      workspace.add(dep);
    }
  });
}

async function publishPackage(pkgName, version, runIfNotDry) {
  if (skippedPackages.includes(pkgName)) {
    return;
  }

  const pkgRoot = getPkgRoot(pkgName),
    distDir = path.resolve(pkgRoot, 'dist-npm'),
    pkgPath = path.resolve(distDir, 'package.json'),
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  if (pkg.private) {
    console.log(kleur.red(`\n🚫 Skipping private package: ${pkg.name}`));
    return;
  }

  // Write new version.
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');

  step(`Publishing ${pkgName}...`);

  try {
    await runIfNotDry('npm', ['publish', '--tag', getReleaseTag(version), '--access', 'public'], {
      cwd: distDir,
      stdio: 'pipe',
    });
    console.log(kleur.green(`\n✅ Successfully published ${pkgName}@${version}`));
  } catch (e) {
    if (/** @type {any} */ (e).stderr.match(/previously published/)) {
      console.log(kleur.red(`\n🚫 Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }
}

async function publishCDN(version) {
  step('Publishing CDN...');

  const pkgRoot = getPkgRoot('vidstack'),
    cdnDir = path.resolve(pkgRoot, 'dist-cdn'),
    cdnPkgPath = path.resolve(cdnDir, 'package.json');

  await run('pnpm', ['run', '-F', 'vidstack', 'build:cdn']);

  // Copy over styles.
  fsExtra.copySync(path.resolve(pkgRoot, 'styles'), path.resolve(cdnDir, 'styles'));

  const packageJson = {
    name: '@vidstack/cdn',
    version,
    license: 'MIT',
    type: 'module',
    repository: { type: 'git', url: 'https://github.com/vidstack/player.git' },
    bugs: { url: 'https://github.com/vidstack/player/issues' },
  };

  fs.writeFileSync(cdnPkgPath, JSON.stringify(packageJson, null, 2));

  await runIfNotDry('npm', ['publish', '--tag', getReleaseTag(version), '--access', 'public'], {
    cwd: cdnDir,
    stdio: 'pipe',
  });

  console.log(kleur.green(`\n✅ Successfully published @vidstack/cdn@${version}`));
}

function getReleaseTag(version) {
  if (args.tag) {
    return args.tag;
  } else if (version.includes('alpha')) {
    return 'alpha';
  } else if (version.includes('beta')) {
    return 'beta';
  } else if (version.includes('rc')) {
    return 'rc';
  } else {
    return isNext ? 'next' : 'latest';
  }
}

if (isDryRun) console.log(kleur.cyan('\n☂️  Running in dry mode...\n'));

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
