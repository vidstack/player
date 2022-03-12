import {
  isFunction,
  isString,
  isUndefined,
  kebabToCamelCase,
  ScriptLoader,
} from '@vidstack/foundation';
import type { Events as HlsEvent } from 'hls.js';

import type { DynamicHlsConstructorImport, HlsConstructor } from './types.js';

const HLS_CTOR_CACHE = new Map<any, HlsConstructor>();

export function isHlsConstructorCached(src: string) {
  return HLS_CTOR_CACHE.has(src);
}

export type HlsConstructorLoadCallbacks = {
  onLoadStart?: () => void;
  onLoaded?: (ctor: HlsConstructor) => void;
  onLoadError?: (err: Error) => void;
};

export async function importHlsConstructor(
  importer: HlsConstructor | DynamicHlsConstructorImport | undefined,
  callbacks: HlsConstructorLoadCallbacks = {},
): Promise<HlsConstructor | undefined> {
  if (isUndefined(importer)) return undefined;

  callbacks.onLoadStart?.();

  // Must be static.
  if (!isFunction(importer)) {
    callbacks.onLoaded?.(importer);
    return importer;
  }

  const cacheKey = String(importer);

  if (HLS_CTOR_CACHE.has(cacheKey)) {
    const hlsCtor = HLS_CTOR_CACHE.get(cacheKey)!;
    callbacks.onLoaded?.(hlsCtor);
    return hlsCtor;
  }

  try {
    const hlsCtor = (await (importer as DynamicHlsConstructorImport)())?.default;

    if (hlsCtor && !!hlsCtor.isSupported) {
      callbacks.onLoaded?.(hlsCtor);
      HLS_CTOR_CACHE.set(cacheKey, hlsCtor);
    } else {
      throw Error(
        __DEV__
          ? '[vds]: Failed importing `hls.js`. Dynamic import returned invalid constructor.'
          : '',
      );
    }

    return hlsCtor;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}

/**
 * Loads `hls.js` from the remote source given via `hlsLibrary` into the window namespace. This
 * is because `hls.js` in {currentYear} still doesn't provide a ESM export. This method will
 * return `undefined` if it fails to load the script. Listen to `vds-hls-lib-load-error` to be
 * notified of any failures.
 */
export async function loadHlsConstructorScript(
  src: unknown,
  callbacks: HlsConstructorLoadCallbacks = {},
): Promise<HlsConstructor | undefined> {
  if (!isString(src)) return undefined;
  if (HLS_CTOR_CACHE.has(src)) return HLS_CTOR_CACHE.get(src);

  callbacks.onLoadStart?.();

  try {
    await ScriptLoader.load(src);

    if (!isFunction((window as any).Hls)) {
      throw Error(
        __DEV__
          ? '[vds]: Failed loading `hls.js`. Could not find a valid constructor at `window.Hls`.'
          : '',
      );
    }

    const ctor = (window as any).Hls as unknown as HlsConstructor;
    callbacks.onLoaded?.(ctor);
    HLS_CTOR_CACHE.set(src, ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}

export function vdsToHlsEventType(type: string) {
  return kebabToCamelCase(type.replace('vds-', ''));
}

const vdsHlsEventPrefix = 'vds-hls-';
const vdsHlsEvents = ['lib-load', 'instance', 'unsupported'];
export function isHlsEventType(type: string): type is HlsEvent {
  return (
    type.startsWith(vdsHlsEventPrefix) &&
    !vdsHlsEvents.some((t) => type.startsWith(`${vdsHlsEventPrefix}${t}`))
  );
}
