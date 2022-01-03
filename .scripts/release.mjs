// @ts-check

import minimist from 'minimist';
import { execa } from 'execa';
import kleur from 'kleur';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import prompt from 'enquirer';
import semver from 'semver';
import path from 'path';
import fs from 'fs';

// @ts-expect-error - .
const require = createRequire(import.meta.url);
// @ts-expect-error - .
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = minimist(process.argv.slice(2));
const isDryRun = args.dry;
const skipBuild = args.skipBuild;
const skipTests = args.skipTests;
const currentVersion = require('../package.json').version;

if (isDryRun) console.log(kleur.cyan('\n☂️  Running in dry mode...\n'));

const preId =
  args.preid ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
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
        choices: versionIncrements
          .map((i) => `${i} (${inc(i)})`)
          .concat(['custom'])
      })
    );

    if (release === 'custom') {
      targetVersion = /** @type {{ version: string }} */ (
        await prompt.prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion
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
      message: `Releasing v${targetVersion}. Confirm?`
    })
  );

  if (!yes) {
    return;
  }

  step('Updating version...');
  updatePackageVersion(targetVersion);

  step('Updating lockfile...');
  await run(`npm`, ['install']);

  step('Running tests...');
  if (!skipTests && !isDryRun) {
    await run('npm', ['run', 'test:coverage']);
  } else {
    console.log(`(skipped)`);
  }

  step('Building package...');
  if (!skipBuild && !isDryRun) {
    await run('npm', ['run', 'build:all']);
  } else {
    console.log(`(skipped)`);
  }

  step('Minifying production build...');
  if (!skipBuild && !isDryRun) {
    await run('npm', ['run', 'minify:prod']);
  } else {
    console.log(`(skipped)`);
  }

  step('Generating changelog...');
  await run(`npm`, ['run', 'changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('Committing changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', [
      'commit',
      '-m',
      `chore(release): v${targetVersion}`
    ]);
  } else {
    console.log('No changes to commit.');
  }

  publishPackage(targetVersion);

  step('Pushing to GitHub...');
  await runIfNotDry('git', ['tag', `v${targetVersion}`]);
  await runIfNotDry('git', [
    'push',
    'upstream',
    'main',
    `refs/tags/v${targetVersion}`
  ]);
  await runIfNotDry('git', ['push', 'upstream', 'main']);

  if (isDryRun) {
    console.log(
      `\nDry run finished - run \`git diff\` to see package changes.`
    );
  }

  console.log();
}

function updatePackageVersion(version) {
  const pkgRoot = path.resolve(__dirname, '..');
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

async function publishPackage(version) {
  const pkgRoot = path.resolve(__dirname, '..');
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const pkgName = pkg.name;

  if (pkg.private) {
    return;
  }

  let releaseTag = null;

  if (args.tag) {
    releaseTag = args.tag;
  } else if (version.includes('alpha')) {
    releaseTag = 'alpha';
  } else if (version.includes('beta')) {
    releaseTag = 'beta';
  } else if (version.includes('rc')) {
    releaseTag = 'rc';
  } else {
    releaseTag = 'latest';
  }

  step(`Publishing ${pkgName}...`);

  try {
    await runIfNotDry(
      // use of yarn is intentional here as we rely on its publishing behavior.
      'yarn',
      [
        'publish',
        '--new-version',
        version,
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public'
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe'
      }
    );

    console.log(kleur.green(`✅ Successfully published ${pkgName}@${version}`));
  } catch (e) {
    if (/** @type {any} */ (e).stderr.match(/previously published/)) {
      console.log(kleur.red(`🚫 Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
