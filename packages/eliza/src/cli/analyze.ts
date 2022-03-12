import { isArray, isUndefined } from '@vidstack/foundation';
import { pathExists } from 'fs-extra';
import kleur from 'kleur';
import type { Program } from 'typescript';

import { clearTerminal, log, LogLevel, logWithTime } from '../logger';
import {
  compileAndWatch,
  compileOnce,
  defaultBuildPlugin,
  defaultDiscoverPlugin,
  transpileModuleOnce,
} from '../meta';
import { type Plugin, runPlugins } from '../plugins';
import { parseGlobs, resolveConfigPaths, resolveCorePkgName } from '../utils';

export interface AnalyzeCommandConfig extends Record<string, unknown> {
  pkgName: string;
  logLevel: string;
  glob?: string[];
  globs?: string[];
  cwd: string;
  configFile: string;
  watch: boolean;
  project: string | null;
}

async function normalizeConfig(config: AnalyzeCommandConfig) {
  const cwd = isUndefined(config.cwd) ? process.cwd() : config.cwd;
  const normalizedConfig = await resolveConfigPaths(cwd, config);
  normalizedConfig.pkgName = (await resolveCorePkgName(normalizedConfig.cwd))!;
  return normalizedConfig;
}

export async function runAnalyzeCommand(analyzeConfig: AnalyzeCommandConfig): Promise<void> {
  clearTerminal();

  const config = await normalizeConfig(analyzeConfig);
  const glob: string[] = config.glob ?? [];

  log(config, LogLevel.Verbose);

  let plugins: Plugin[] = [];

  if (!(await pathExists(config.configFile))) {
    log(
      `no configuration file could be found at ${kleur.cyan(config.configFile)}`,
      LogLevel.Verbose,
    );
  } else {
    plugins = (await transpileModuleOnce(config.configFile)) as Plugin[];
  }

  if (!isArray(plugins)) {
    log(
      `configuration file must default export an array of plugins, found ${kleur.red(
        typeof plugins,
      )}`,
      LogLevel.Error,
    );
    return;
  }

  plugins.push(defaultDiscoverPlugin(), defaultBuildPlugin());

  if (config.watch) {
    log('watching files for changes...');
    compileAndWatch(config.project ?? 'tsconfig.json', async (program) => {
      const filePaths = await parseGlobs(glob);
      await run(program, plugins, filePaths, true);
    });
  } else {
    const startCompileTime = process.hrtime();
    const filePaths = await parseGlobs(glob);
    const program = compileOnce(filePaths);
    logWithTime(`compiled program`, startCompileTime);
    await run(program, plugins, filePaths);
  }
}

async function run(program: Program, plugins: Plugin[], filePaths: string[], watching = false) {
  const startAnalyzeTime = process.hrtime();

  const result = await runPlugins(program, plugins, filePaths, watching);

  if (result) {
    const { sourceFiles } = result;
    const noOfFiles = sourceFiles.length;
    const noOfFilesText = kleur.green(`${noOfFiles} ${noOfFiles === 1 ? 'file' : 'files'}`);
    logWithTime(`analyzed ${noOfFilesText}`, startAnalyzeTime);
  }
}
