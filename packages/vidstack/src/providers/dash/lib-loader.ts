import { DOMEvent, isFunction, isString, isUndefined } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import { coerceToError } from '../../utils/error';
import { loadScript } from '../../utils/network';
import type {
  DASHConstructor,
  DASHConstructorLoader,
  DASHLibrary,
  DASHNamespace,
  DASHNamespaceLoader,
} from './types';

interface LoadDASHConstructorCallbacks {
  onLoadStart?: () => void;
  onLoaded?: (ctor: DASHConstructor) => void;
  onLoadError?: (err: Error) => void;
}

export class DASHLibLoader {
  #lib: DASHLibrary;
  #ctx: MediaContext;
  #callback: (ctor: DASHConstructor) => void;

  constructor(lib: DASHLibrary, ctx: MediaContext, callback: (ctor: DASHConstructor) => void) {
    this.#lib = lib;
    this.#ctx = ctx;
    this.#callback = callback;
    this.#startLoading();
  }

  async #startLoading() {
    if (__DEV__) this.#ctx.logger?.info('🏗️ Loading DASH Library');

    const callbacks: LoadDASHConstructorCallbacks = {
      onLoadStart: this.#onLoadStart.bind(this),
      onLoaded: this.#onLoaded.bind(this),
      onLoadError: this.#onLoadError.bind(this),
    };

    // If not a string it'll return undefined.
    let ctor = await loadDASHScript(this.#lib, callbacks);

    // If it's not a remote source, it must of been passed in directly as a static/dynamic import.
    if (isUndefined(ctor) && !isString(this.#lib)) ctor = await importDASH(this.#lib, callbacks);

    // We failed loading the constructor.
    if (!ctor) return null;

    // Not supported.
    if (!window.dashjs.supportsMediaSource()) {
      const message = '[vidstack] `dash.js` is not supported in this environment';
      if (__DEV__) this.#ctx.logger?.error(message);
      this.#ctx.player.dispatch(new DOMEvent<void>('dash-unsupported'));
      this.#ctx.notify('error', { message, code: 4 });
      return null;
    }

    return ctor;
  }

  #onLoadStart() {
    if (__DEV__) {
      this.#ctx.logger
        ?.infoGroup('Starting to load `dash.js`')
        .labelledLog('URL', this.#lib)
        .dispatch();
    }

    this.#ctx.player.dispatch(new DOMEvent<void>('dash-lib-load-start'));
  }

  #onLoaded(ctor: DASHConstructor) {
    if (__DEV__) {
      this.#ctx.logger
        ?.infoGroup('Loaded `dash.js`')
        .labelledLog('Library', this.#lib)
        .labelledLog('Constructor', ctor)
        .dispatch();
    }

    this.#ctx.player.dispatch(
      new DOMEvent<DASHConstructor>('dash-lib-loaded', {
        detail: ctor,
      }),
    );

    this.#callback(ctor);
  }

  #onLoadError(e: any) {
    const error = coerceToError(e);

    if (__DEV__) {
      this.#ctx.logger
        ?.errorGroup('[vidstack] Failed to load `dash.js`')
        .labelledLog('Library', this.#lib)
        .labelledLog('Error', e)
        .dispatch();
    }

    this.#ctx.player.dispatch(
      new DOMEvent<any>('dash-lib-load-error', {
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

async function importDASH(
  loader: DASHConstructor | DASHConstructorLoader | DASHNamespace | DASHNamespaceLoader | undefined,
  callbacks: LoadDASHConstructorCallbacks = {},
) {
  if (isUndefined(loader)) return undefined;

  callbacks.onLoadStart?.();

  if (isDASHConstructor(loader)) {
    callbacks.onLoaded?.(loader);
    return loader;
  }

  if (isDASHNamespace(loader)) {
    const ctor = loader.MediaPlayer;
    callbacks.onLoaded?.(ctor);
    return ctor;
  }

  try {
    const ctor = (await loader())?.default;

    if (isDASHNamespace(ctor)) {
      callbacks.onLoaded?.(ctor.MediaPlayer);
      return ctor.MediaPlayer;
    }

    if (ctor) {
      callbacks.onLoaded?.(ctor);
    } else {
      throw Error(
        __DEV__
          ? '[vidstack] failed importing `dash.js`. Dynamic import returned invalid object.'
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
 * Loads `dash.js` from the remote source given via `library` into the window namespace. This
 * is because `dash.js` in {currentYear} still doesn't provide a ESM export. This method will
 * return `undefined` if it fails to load the script. Listen to `dash-lib-load-error` to be
 * notified of any failures.
 */
async function loadDASHScript(
  src: unknown,
  callbacks: LoadDASHConstructorCallbacks = {},
): Promise<DASHConstructor | undefined> {
  if (!isString(src)) return undefined;

  callbacks.onLoadStart?.();

  try {
    await loadScript(src);

    if (!isFunction((window as any).dashjs.MediaPlayer)) {
      throw Error(
        __DEV__
          ? '[vidstack] failed loading `dash.js`. Could not find a valid `Dash` constructor on window'
          : '',
      );
    }

    const ctor = window.dashjs.MediaPlayer;
    callbacks.onLoaded?.(ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}

function isDASHConstructor(value: any): value is DASHConstructor {
  return value && value.prototype && value.prototype !== Function;
}

function isDASHNamespace(value: any): value is DASHNamespace {
  return value && 'MediaPlayer' in value;
}
