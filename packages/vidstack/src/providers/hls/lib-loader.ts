import { DOMEvent, isFunction, isString, isUndefined } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import { coerceToError } from '../../utils/error';
import { loadScript } from '../../utils/network';
import type { HLSConstructor, HLSConstructorLoader, HLSLibrary } from './types';

interface LoadHLSConstructorCallbacks {
  onLoadStart?: () => void;
  onLoaded?: (ctor: HLSConstructor) => void;
  onLoadError?: (err: Error) => void;
}

export class HLSLibLoader {
  #lib: HLSLibrary;
  #ctx: MediaContext;
  #callback: (ctor: HLSConstructor) => void;

  constructor(lib: HLSLibrary, ctx: MediaContext, callback: (ctor: HLSConstructor) => void) {
    this.#lib = lib;
    this.#ctx = ctx;
    this.#callback = callback;
    this.#startLoading();
  }

  async #startLoading() {
    if (__DEV__) this.#ctx.logger?.info('🏗️ Loading HLS Library');

    const callbacks: LoadHLSConstructorCallbacks = {
      onLoadStart: this.#onLoadStart.bind(this),
      onLoaded: this.#onLoaded.bind(this),
      onLoadError: this.#onLoadError.bind(this),
    };

    // If not a string it'll return undefined.
    let ctor = await loadHLSScript(this.#lib, callbacks);

    // If it's not a remote source, it must of been passed in directly as a static/dynamic import.
    if (isUndefined(ctor) && !isString(this.#lib)) ctor = await importHLS(this.#lib, callbacks);

    // We failed loading the constructor.
    if (!ctor) return null;

    // Not supported.
    if (!ctor.isSupported()) {
      const message = '[vidstack] `hls.js` is not supported in this environment';
      if (__DEV__) this.#ctx.logger?.error(message);
      this.#ctx.player.dispatch(new DOMEvent<void>('hls-unsupported'));
      this.#ctx.notify('error', { message, code: 4 });
      return null;
    }

    return ctor;
  }

  #onLoadStart() {
    if (__DEV__) {
      this.#ctx.logger
        ?.infoGroup('Starting to load `hls.js`')
        .labelledLog('URL', this.#lib)
        .dispatch();
    }

    this.#ctx.player.dispatch(new DOMEvent<void>('hls-lib-load-start'));
  }

  #onLoaded(ctor: HLSConstructor) {
    if (__DEV__) {
      this.#ctx.logger
        ?.infoGroup('Loaded `hls.js`')
        .labelledLog('Library', this.#lib)
        .labelledLog('Constructor', ctor)
        .dispatch();
    }

    this.#ctx.player.dispatch(
      new DOMEvent<HLSConstructor>('hls-lib-loaded', {
        detail: ctor,
      }),
    );

    this.#callback(ctor);
  }

  #onLoadError(e) {
    const error = coerceToError(e);

    if (__DEV__) {
      this.#ctx.logger
        ?.errorGroup('[vidstack] Failed to load `hls.js`')
        .labelledLog('Library', this.#lib)
        .labelledLog('Error', e)
        .dispatch();
    }

    this.#ctx.player.dispatch(
      new DOMEvent<any>('hls-lib-load-error', {
        detail: error,
      }),
    );

    this.#ctx.notify('error', {
      message: error.message,
      code: 4,
      error,
    });
  }
}

async function importHLS(
  loader: HLSConstructor | HLSConstructorLoader | undefined,
  callbacks: LoadHLSConstructorCallbacks = {},
): Promise<HLSConstructor | undefined> {
  if (isUndefined(loader)) return undefined;

  callbacks.onLoadStart?.();

  // Must be static.
  if (loader.prototype && loader.prototype !== Function) {
    callbacks.onLoaded?.(loader as HLSConstructor);
    return loader as HLSConstructor;
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
 * return `undefined` if it fails to load the script. Listen to `hls-lib-load-error` to be
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
