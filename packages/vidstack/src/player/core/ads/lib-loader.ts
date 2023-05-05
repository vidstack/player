import { DOMEvent, isObject, isString } from 'maverick.js/std';

import { coerceToError } from '../../../utils/error';
import { loadScript } from '../../../utils/network';
import type { MediaContext } from '../api/context';
import type { ImaSdk } from './types';

interface LoadIMASdkCallbacks {
  onLoadStart?: () => void;
  onLoaded?: (imaSdk: ImaSdk) => void;
  onLoadError?: (err: Error) => void;
}

export class ImaSdkLoader {
  constructor(
    private _lib: string,
    private _context: MediaContext,
    private _callback: (imaSdk: ImaSdk) => void,
  ) {
    this._startLoading();
  }

  private async _startLoading() {
    if (__DEV__) this._context.logger?.info('🏗️ Loading HLS Library');

    const callbacks: LoadIMASdkCallbacks = {
      onLoadStart: this._onLoadStart.bind(this),
      onLoaded: this._onLoaded.bind(this),
      onLoadError: this._onLoadError.bind(this),
    };

    // If the library is already loaded, we can just return it. Otherwise try to load it.
    // If we fail to load it, we return null.
    let imaSdk =
      !isObject((window as any).google) || !isObject((window as any).google.ima)
        ? await loadImaSdkScript(this._lib, callbacks)
        : ((window as any).google.ima as ImaSdk);
    if (!imaSdk) return null;

    return imaSdk;
  }

  private _onLoadStart() {
    if (__DEV__) {
      this._context.logger
        ?.infoGroup('Starting to load `imasdk3`')
        .labelledLog('URL', this._lib)
        .dispatch();
    }

    this._context.player?.dispatchEvent(new DOMEvent<void>('ima-lib-load-start'));
  }

  private _onLoaded(imaSdk: ImaSdk) {
    if (__DEV__) {
      this._context.logger
        ?.infoGroup('Loaded `imasdk3`')
        .labelledLog('Library', this._lib)
        .dispatch();
    }

    this._context.player!.dispatchEvent(
      new DOMEvent<ImaSdk>('ima-lib-loaded', {
        detail: imaSdk,
      }),
    );

    this._callback(imaSdk);
  }

  private _onLoadError(e) {
    const error = coerceToError(e);

    if (__DEV__) {
      this._context.logger
        ?.errorGroup('Failed to load `imasdk3`')
        .labelledLog('Library', this._lib)
        .labelledLog('Error', e)
        .dispatch();
    }

    this._context.player!.dispatchEvent(
      new DOMEvent<any>('ima-lib-load-error', {
        detail: error,
      }),
    );

    this._context.delegate._dispatch('error', {
      detail: { message: error.message, code: 4 },
    });
  }
}

/**
 * Loads `hls.js` from the remote source given via `library` into the window namespace. This
 * is because `hls.js` in {currentYear} still doesn't provide a ESM export. This method will
 * return `undefined` if it fails to load the script. Listen to `lib-load-error` to be
 * notified of any failures.
 */
async function loadImaSdkScript(
  src: unknown,
  callbacks: LoadIMASdkCallbacks = {},
): Promise<ImaSdk | undefined> {
  if (!isString(src)) return undefined;

  callbacks.onLoadStart?.();

  try {
    await loadScript(src);

    if (!isObject((window as any).google) || !isObject((window as any).google.ima)) {
      throw Error(
        __DEV__
          ? '[vidstack] failed loading `imasdk3`. Could not find a valid `google` object on window'
          : '',
      );
    }

    const imaSdk = (window as any).google.ima as ImaSdk;
    callbacks.onLoaded?.(imaSdk);
    return imaSdk;
  } catch (err) {
    callbacks.onLoadError?.(err as Error);
  }

  return undefined;
}
