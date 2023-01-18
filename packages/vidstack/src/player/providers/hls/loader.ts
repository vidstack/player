import { dispatchEvent, isFunction, isString, isUndefined } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import { coerceToError } from '../../../utils/error';
import { loadScript } from '../../../utils/network';
import type { HLSConstructor, HLSConstructorLoader, HLSLibrary, HLSVideoElement } from './types';

const ctorCache = new Map<any, HLSConstructor>();

interface LoadHLSConstructorCallbacks {
  onLoadStart?: () => void;
  onLoaded?: (ctor: HLSConstructor) => void;
  onLoadError?: (err: Error) => void;
}

export function isHLSConstructorCached(src: string) {
  return ctorCache.has(src);
}

export async function loadHLSLibrary(
  target: HLSVideoElement,
  lib: HLSLibrary,
  logger?: Logger,
): Promise<HLSConstructor | null> {
  if (__DEV__) {
    logger?.info('🏗️ Loading HLS Library');
  }

  const callbacks: LoadHLSConstructorCallbacks = {
    onLoadStart() {
      if (__DEV__) {
        logger?.infoGroup('Starting to load `hls.js`').labelledLog('URL', lib).dispatch();
      }

      dispatchEvent(target, 'hls-lib-load-start');
    },
    onLoaded(ctor) {
      if (__DEV__) {
        logger
          ?.infoGroup('Loaded `hls.js`')
          .labelledLog('Library', lib)
          .labelledLog('Constructor', ctor)
          .dispatch();
      }

      dispatchEvent(target, 'hls-lib-loaded', { detail: ctor });
    },
    onLoadError(e) {
      const error = coerceToError(e);

      if (__DEV__) {
        logger
          ?.errorGroup('Failed to load `hls.js`')
          .labelledLog('Library', lib)
          .labelledLog('Error', e)
          .dispatch();
      }

      dispatchEvent(target, 'hls-lib-load-error', { detail: error });
      dispatchEvent(target, 'error', { detail: { message: error.message, code: 4 } });
    },
  };

  // If not a string it'll return undefined.
  let ctor = await loadHLSScript(lib, callbacks);

  // If it's not a remote source, it must of been passed in directly as a static/dynamic import.
  if (isUndefined(ctor) && !isString(lib)) ctor = await importHLS(lib, callbacks);

  // We failed loading the constructor.
  if (!ctor) return null;

  // Not supported.
  if (!ctor.isSupported()) {
    const message = '[vidstack]: `hls.js` is not supported in this environment';
    if (__DEV__) logger?.error(message);
    dispatchEvent(target, 'hls-unsupported');
    dispatchEvent(target, 'error', { detail: { message, code: 4 } });
    return null;
  }

  return ctor;
}

async function importHLS(
  loader: HLSConstructor | HLSConstructorLoader | undefined,
  callbacks: LoadHLSConstructorCallbacks = {},
): Promise<HLSConstructor | undefined> {
  if (isUndefined(loader)) return undefined;

  callbacks.onLoadStart?.();

  // Must be static.
  if (!isFunction(loader)) {
    callbacks.onLoaded?.(loader);
    return loader;
  }

  const cacheKey = String(loader);

  if (ctorCache.has(cacheKey)) {
    const ctor = ctorCache.get(cacheKey)!;
    callbacks.onLoaded?.(ctor);
    return ctor;
  }

  try {
    const ctor = (await (loader as HLSConstructorLoader)())?.default;

    if (ctor && !!ctor.isSupported) {
      callbacks.onLoaded?.(ctor);
      ctorCache.set(cacheKey, ctor);
    } else {
      throw Error(
        __DEV__
          ? '[vidstack] failed importing `hls.js`. Dynamic import returned invalid constructor.'
          : '',
      );
    }

    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}

/**
 * Loads `hls.js` from the remote source given via `hlsLibrary` into the window namespace. This
 * is because `hls.js` in {currentYear} still doesn't provide a ESM export. This method will
 * return `undefined` if it fails to load the script. Listen to `hls-lib-load-error` to be
 * notified of any failures.
 */
async function loadHLSScript(
  src: unknown,
  callbacks: LoadHLSConstructorCallbacks = {},
): Promise<HLSConstructor | undefined> {
  if (!isString(src)) return undefined;
  if (ctorCache.has(src)) return ctorCache.get(src);

  callbacks.onLoadStart?.();

  try {
    await loadScript(src);

    if (!isFunction((window as any).Hls)) {
      throw Error(
        __DEV__
          ? '[vidstack] failed loading `hls.js`. Could not find a valid `Hls` constructor on window'
          : '',
      );
    }

    const ctor = (window as any).Hls as HLSConstructor;
    callbacks.onLoaded?.(ctor);
    ctorCache.set(src, ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}
