import { DOMEvent, isFunction, isString, isUndefined } from 'maverick.js/std';

import { coerceToError } from '../../utils/error';
import { loadScript } from '../../utils/network';
import type { MediaSetupContext } from '../types';
import type { HLSConstructor, HLSConstructorLoader, HLSLibrary } from './types';

interface LoadHLSConstructorCallbacks {
  onLoadStart?: () => void;
  onLoaded?: (ctor: HLSConstructor) => void;
  onLoadError?: (err: Error) => void;
}

export class HLSLibLoader {
  constructor(
    private _lib: HLSLibrary,
    private _ctx: MediaSetupContext,
    private _callback: (ctor: HLSConstructor) => void,
  ) {
    this._startLoading();
  }

  private async _startLoading() {
    if (__DEV__) this._ctx.logger?.info('🏗️ Loading HLS Library');

    const callbacks: LoadHLSConstructorCallbacks = {
      onLoadStart: this._onLoadStart.bind(this),
      onLoaded: this._onLoaded.bind(this),
      onLoadError: this._onLoadError.bind(this),
    };

    // If not a string it'll return undefined.
    let ctor = await loadHLSScript(this._lib, callbacks);

    // If it's not a remote source, it must of been passed in directly as a static/dynamic import.
    if (isUndefined(ctor) && !isString(this._lib)) ctor = await importHLS(this._lib, callbacks);

    // We failed loading the constructor.
    if (!ctor) return null;

    // Not supported.
    if (!ctor.isSupported()) {
      const message = '[vidstack]: `hls.js` is not supported in this environment';
      if (__DEV__) this._ctx.logger?.error(message);
      this._ctx.player.dispatch(new DOMEvent<void>('hls-unsupported'));
      this._ctx.delegate._notify('error', { message, code: 4 });
      return null;
    }

    return ctor;
  }

  private _onLoadStart() {
    if (__DEV__) {
      this._ctx.logger
        ?.infoGroup('Starting to load `hls.js`')
        .labelledLog('URL', this._lib)
        .dispatch();
    }

    this._ctx.player.dispatch(new DOMEvent<void>('hls-lib-load-start'));
  }

  private _onLoaded(ctor: HLSConstructor) {
    if (__DEV__) {
      this._ctx.logger
        ?.infoGroup('Loaded `hls.js`')
        .labelledLog('Library', this._lib)
        .labelledLog('Constructor', ctor)
        .dispatch();
    }

    this._ctx.player.dispatch(
      new DOMEvent<HLSConstructor>('hls-lib-loaded', {
        detail: ctor,
      }),
    );

    this._callback(ctor);
  }

  private _onLoadError(e) {
    const error = coerceToError(e);

    if (__DEV__) {
      this._ctx.logger
        ?.errorGroup('Failed to load `hls.js`')
        .labelledLog('Library', this._lib)
        .labelledLog('Error', e)
        .dispatch();
    }

    this._ctx.player.dispatch(
      new DOMEvent<any>('hls-lib-load-error', {
        detail: error,
      }),
    );

    this._ctx.delegate._notify('error', { message: error.message, code: 4 });
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
