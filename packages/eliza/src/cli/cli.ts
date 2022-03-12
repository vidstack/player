import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { logStackTrace, mapLogLevelStringToNumber, setGlobalLogLevel } from '../logger';
import { type AnalyzeCommandConfig, runAnalyzeCommand } from './analyze';
import { isCLIError } from './cli-error';

export function cli(): void {
  yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [glob..] [options]')
    .command<AnalyzeCommandConfig>({
      command: ['analyze [glob..]', '$0 [glob..]'],
      describe: 'Analyzes component metadata.',
      handler: async (config) => {
        setGlobalLogLevel(mapLogLevelStringToNumber(config.logLevel));

        try {
          await runAnalyzeCommand(config);
        } catch (e) {
          if (isCLIError(e)) {
            logStackTrace(e.message, e.stack!);
          } else {
            throw e;
          }
        }
      },
    })
    .example('$ $0', '')
    .option('cwd', {
      string: true,
      describe: 'The base path to use when emitting files (useful when working inside a monorepo).',
      default: process.cwd(),
    })
    .option('logLevel', {
      describe: 'Select logging level.',
      nArgs: 1,
      choices: ['silent', 'error', 'warn', 'info', 'verbose'],
      default: 'info',
    })
    .option('configFile', {
      alias: 'c',
      string: true,
      describe: 'The path to your configuration file.',
      default: './eliza.config.ts',
    })
    .option('watch', {
      alias: 'w',
      boolean: true,
      describe: 'Watch input files for changes.',
      default: false,
    })
    .option('project', {
      alias: 'p',
      string: true,
      describe:
        "Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json' file.",
      default: null,
    })
    .alias('v', 'version')
    .help('h')
    .wrap(110)
    .strict()
    .alias('h', 'help').argv;
}
