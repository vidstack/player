import path from 'path';

import { execa } from 'execa';
import fs from 'fs-extra';
import kleur from 'kleur';

const __cwd = process.cwd();

/**
 * @description
 * Prepares all the playgrounds by iterating through them and retrieving deps via
 * yalc.lock file and installs node modules.
 */
const runPlaygroundPrepare = async () => {
  const ROOT_PLAYGROUND_PATH = path.resolve(__cwd, 'playground');

  if (!fs.existsSync(ROOT_PLAYGROUND_PATH)) {
    console.log(kleur.green('✔ Created /playground directory because it did not exist.'));
    fs.mkdir(ROOT_PLAYGROUND_PATH);
    process.exit(0);
  }

  const playgroundProjects = fs.readdirSync(ROOT_PLAYGROUND_PATH);

  if (!playgroundProjects.length) {
    console.error(
      kleur.red(
        `🚨 Error: Playground directory is empty. You can use something like ${kleur.green(
          'create-vite package-name --template react-ts',
        )} to scaffold a project.`,
      ),
    );
    process.exit(0);
  }

  for (const project of playgroundProjects) {
    // Use lock file to retrieve dependency
    await execa('yalc', ['update'], {
      cwd: `${ROOT_PLAYGROUND_PATH}/${project}`,
      stdout: 'inherit',
    });

    // Install node modules
    await execa('npm', ['i'], { cwd: `${ROOT_PLAYGROUND_PATH}/${project}`, stdout: 'inherit' });
  }

  console.log(kleur.green('🚀 Retrieved yalc deps from yalc.lock & installed node modules.'));
};

runPlaygroundPrepare().catch((e) => {
  if (e.exitCode === 1) return;
  console.error(e);
  process.exit(1);
});
