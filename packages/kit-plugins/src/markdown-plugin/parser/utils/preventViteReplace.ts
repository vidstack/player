/**
 * Global constants and env variables will be statically replaced by Vite in build mode. This
 * util helps avoid that by inserting escape sequences.
 *
 * @see https://vitejs.dev/guide/env-and-mode.html#production-replacement
 */
export function preventViteReplace(source: string, define?: Record<string, unknown>): string {
  source = source
    .replace(/\bimport\.meta/g, 'import.<wbr/>meta')
    .replace(/\bprocess\.env/g, 'process.<wbr/>env');

  // Also avoid replacing defines.
  if (define) {
    const regex = new RegExp(
      `\\b(${Object.keys(define)
        .map((key) => key.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'))
        .join('|')})`,
      'g',
    );

    source = source.replace(regex, (_) => `${_[0]}<wbr/>${_.slice(1)}`);
  }

  return source;
}
