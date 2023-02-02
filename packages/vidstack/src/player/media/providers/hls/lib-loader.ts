import { dispatchEvent, isFunction, isString, isUndefined } from 'maverick.js/std';

import { coerceToError } from '../../../../utils/error';
import { loadScript } from '../../../../utils/network';
import type { MediaSetupContext } from '../types';
import type { HLSConstructor, HLSConstructorLoader, HLSLibrary } from './types';

interface LoadHLSConstructorCallbacks {
  onLoadStart?: () => void;
  onLoaded?: (ctor: HLSConstructor) => void;
  onLoadError?: (err: Error) => void;
}

export async function loadHLSLibrary(
  lib: HLSLibrary,
  { player, delegate, logger }: MediaSetupContext,
): Promise<HLSConstructor | null> {
  if (__DEV__) {
    logger?.info('🏗️ Loading HLS Library');
  }

  const callbacks: LoadHLSConstructorCallbacks = {
    onLoadStart() {
      if (__DEV__) {
        logger?.infoGroup('Starting to load `hls.js`').labelledLog('URL', lib).dispatch();
      }

      dispatchEvent(player, 'hls-lib-load-start');
    },
    onLoaded(ctor) {
      if (__DEV__) {
        logger
          ?.infoGroup('Loaded `hls.js`')
          .labelledLog('Library', lib)
          .labelledLog('Constructor', ctor)
          .dispatch();
      }

      dispatchEvent(player, 'hls-lib-loaded', { detail: ctor });
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

      dispatchEvent(player, 'hls-lib-load-error', { detail: error });
      delegate.dispatch('error', { detail: { message: error.message, code: 4 } });
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
    dispatchEvent(player, 'hls-unsupported');
    delegate.dispatch('error', { detail: { message, code: 4 } });
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

  try {
    const ctor = (await (loader as HLSConstructorLoader)())?.default;

    if (ctor && !!ctor.isSupported) {
      callbacks.onLoaded?.(ctor);
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
 * Loads `hls.js` from the remote source given via `library` into the window namespace. This
 * is because `hls.js` in {currentYear} still doesn't provide a ESM export. This method will
 * return `undefined` if it fails to load the script. Listen to `lib-load-error` to be
 * notified of any failures.
 */
async function loadHLSScript(
  src: unknown,
  callbacks: LoadHLSConstructorCallbacks = {},
): Promise<HLSConstructor | undefined> {
  if (!isString(src)) return undefined;

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
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}
