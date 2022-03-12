import { isString, isUndefined, keysOf } from '@vidstack/foundation';
import normalizePath from 'normalize-path';
import { dirname, relative, resolve } from 'path';
import { readPackageUp } from 'read-pkg-up';

export async function resolveCorePkgName(root: string): Promise<string | undefined> {
  const pkg = await readPackageUp({ cwd: root });
  return pkg?.packageJson.name;
}

export const resolvePath = (...pathSegments: string[]): string =>
  normalizePath(resolve(...pathSegments));

export function resolveRelativePath(from: string, to: string): string {
  const path = relative(dirname(from), to);
  return normalizePath(path.startsWith('.') ? path : `./${path}`);
}

export async function resolveConfigPaths<T extends Record<string, unknown>>(
  cwd: string,
  config: T,
  match: (key: keyof T) => boolean = (key) =>
    isString(key) && (key.endsWith('File') || key.endsWith('Dir')),
): Promise<T> {
  const configWithResolvedPaths: T = { ...config };
  const rcwd = cwd.startsWith('.') ? resolvePath(process.cwd(), cwd) : cwd;

  if (Object.keys(config).includes('cwd')) {
    (configWithResolvedPaths as unknown as { cwd: string }).cwd = rcwd;
  }

  keysOf(config).forEach((key) => {
    if (!isUndefined(config[key]) && match(key)) {
      configWithResolvedPaths[key] = resolvePath(rcwd, config[key] as string) as T[keyof T];
    }
  });

  return configWithResolvedPaths;
}
