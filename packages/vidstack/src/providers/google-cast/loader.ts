import { peek } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import type { MediaType } from '../../core/api/types';
import { canGoogleCastSrc } from '../../utils/mime';
import { loadScript } from '../../utils/network';
import { IS_CHROME, IS_IOS } from '../../utils/support';
import type { MediaProviderLoader } from '../types';
import type { GoogleCastPromptError, GoogleCastPromptErrorCode } from './events';
import type { GoogleCastProvider } from './provider';
import type { GoogleCastOptions } from './types';
import {
  getCastContext,
  getCastErrorMessage,
  getCastFrameworkURL,
  getCastSession,
  getDefaultCastOptions,
  hasLoadedCastFramework,
  isCastAvailable,
  isCastConnected,
} from './utils';

export class GoogleCastLoader implements MediaProviderLoader<GoogleCastProvider> {
  readonly name = 'google-cast';

  target!: HTMLElement;

  protected _player?: cast.framework.RemotePlayer;

  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
   */
  get cast() {
    return getCastContext();
  }

  mediaType(): MediaType {
    return 'video';
  }

  canPlay(src: Src) {
    // Casting is not supported on iOS.
    return IS_CHROME && !IS_IOS && canGoogleCastSrc(src);
  }

  async prompt(ctx: MediaContext) {
    let loadEvent: DOMEvent | undefined,
      openEvent: DOMEvent | undefined,
      errorEvent: DOMEvent | undefined;

    try {
      loadEvent = await this._loadCastFramework(ctx);

      // Not working as expected.
      // const State = window.cast.framework.CastState;
      // if (this.cast.getCastState() === State.NO_DEVICES_AVAILABLE) {
      //   throw this._createError(State.NO_DEVICES_AVAILABLE, 'No cast devices found.');
      // }

      if (!this._player) {
        this._player = new cast.framework.RemotePlayer();
        new cast.framework.RemotePlayerController(this._player);
      }

      openEvent = ctx.player.createEvent('google-cast-prompt-open', {
        trigger: loadEvent,
      });

      ctx.player.dispatchEvent(openEvent);

      this._notifyRemoteStateChange(ctx, 'connecting', openEvent);

      await this._showPrompt(peek(ctx.$props.googleCast));

      ctx.$state.remotePlaybackInfo.set({
        deviceName: getCastSession()?.getCastDevice().friendlyName,
      });

      if (isCastConnected()) this._notifyRemoteStateChange(ctx, 'connected', openEvent);
    } catch (code) {
      const error =
        code instanceof Error
          ? (code as GoogleCastPromptError)
          : this._createError(
              (code + '').toUpperCase() as GoogleCastPromptErrorCode,
              'Prompt failed.',
            );

      errorEvent = ctx.player.createEvent('google-cast-prompt-error', {
        detail: error,
        trigger: openEvent ?? loadEvent,
        cancelable: true,
      });

      ctx.player.dispatch(errorEvent);

      this._notifyRemoteStateChange(
        ctx,
        isCastConnected() ? 'connected' : 'disconnected',
        errorEvent,
      );

      throw error;
    } finally {
      ctx.player.dispatch('google-cast-prompt-close', {
        trigger: errorEvent ?? openEvent ?? loadEvent,
      });
    }
  }

  async load(ctx: MediaContext) {
    if (__SERVER__) {
      throw Error('[vidstack] can not load google cast provider server-side');
    }

    if (!this._player) {
      throw Error('[vidstack] google cast player was not initialized');
    }

    return new (await import('./provider')).GoogleCastProvider(this._player, ctx);
  }

  protected async _loadCastFramework(ctx: MediaContext) {
    if (hasLoadedCastFramework()) return;

    const loadStartEvent = ctx.player.createEvent('google-cast-load-start');
    ctx.player.dispatch(loadStartEvent);

    await loadScript(getCastFrameworkURL());
    await customElements.whenDefined('google-cast-launcher');

    const loadedEvent = ctx.player.createEvent('google-cast-loaded', { trigger: loadStartEvent });
    ctx.player.dispatch(loadedEvent);

    if (!isCastAvailable()) {
      throw this._createError('CAST_NOT_AVAILABLE', 'Google Cast not available on this platform.');
    }

    return loadedEvent;
  }

  protected async _showPrompt(options: GoogleCastOptions) {
    this._setOptions(options);

    const errorCode = await this.cast!.requestSession();

    if (errorCode) {
      throw this._createError(
        errorCode.toUpperCase() as GoogleCastPromptErrorCode,
        getCastErrorMessage(errorCode),
      );
    }
  }

  protected _setOptions(options?: GoogleCastOptions) {
    this.cast?.setOptions({
      ...getDefaultCastOptions(),
      ...options,
    });
  }

  protected _notifyRemoteStateChange(
    ctx: MediaContext,
    state: RemotePlaybackState,
    trigger?: Event,
  ) {
    const detail = { type: 'google-cast', state } as const;
    ctx.delegate._notify('remote-playback-change', detail, trigger);
  }

  private _createError(code: GoogleCastPromptErrorCode, message: string): GoogleCastPromptError {
    const error = Error(message) as GoogleCastPromptError;
    error.code = code;
    return error;
  }
}
