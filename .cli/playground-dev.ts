import path from 'path';

import { execa } from 'execa';
import fs from 'fs-extra';
import kleur from 'kleur';
import prompts from 'prompts';
import type { Choice } from 'prompts';

const __cwd = process.cwd();

/**
 * @description
 * Prompts user to pick a playground to spin up.
 */
const runPlaygroundDev = async () => {
  const ROOT_PLAYGROUND_PATH = path.resolve(__cwd, 'playground');

  const choices: Choice[] = fs
    .readdirSync(ROOT_PLAYGROUND_PATH)
    .map((title) => ({ title, value: title }));

  if (!choices.length) {
    console.error(
      kleur.red(
        `🚨 Error: Playground directory is empty. You can use something like ${kleur.green(
          'create-vite package-name --template react-ts',
        )} to scaffold a project.`,
      ),
    );
    process.exit(0);
  }

  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: 'Choose playground to spin up.',
    choices,
  });

  /**
   * Spin up server for playground project
   */
  await execa('pnpm', ['run', 'dev'], {
    cwd: `${ROOT_PLAYGROUND_PATH}/${value}`,
    stdout: 'inherit',
  });
};

runPlaygroundDev().catch((e) => {
  if (e.exitCode === 1) return;
  console.error(e);
  process.exit(1);
});
