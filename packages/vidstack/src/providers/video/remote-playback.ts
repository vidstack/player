import { effect, signal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import { getAndroidVersion, IS_CHROME } from '../../utils/support';
import type { MediaRemotePlaybackAdapter } from '../types';

export abstract class VideoRemotePlaybackAdapter implements MediaRemotePlaybackAdapter {
  protected abstract readonly _type: 'airplay' | 'google-cast';
  protected abstract readonly _canPrompt: boolean;

  protected _state?: RemotePlaybackState;
  protected _supported = signal(false);

  get supported() {
    return this._supported();
  }

  constructor(
    protected _video: HTMLVideoElement,
    protected _ctx: MediaContext,
  ) {
    this._setup();
  }

  private _setup() {
    if (__SERVER__ || !this._video?.remote || !this._canPrompt) return;

    this._video.remote
      .watchAvailability((available) => {
        this._supported.set(available);
      })
      .catch(() => {
        this._supported.set(false);
      });

    effect(this._watchSupported.bind(this));
  }

  private _watchSupported() {
    if (!this._supported()) return;

    const events = ['connecting', 'connect', 'disconnect'],
      onStateChange = this._onStateChange.bind(this);

    onStateChange();
    listenEvent(this._video, 'playing', onStateChange);

    for (const type of events) {
      // @ts-expect-error - video remote not typed
      listenEvent(this._video.remote, type, onStateChange);
    }
  }

  async prompt() {
    if (!this.supported) throw Error('Not supported on this platform.');

    if (this._type === 'airplay' && this._video.webkitShowPlaybackTargetPicker) {
      return this._video.webkitShowPlaybackTargetPicker();
    }

    return this._video.remote.prompt();
  }

  protected _onStateChange(event?: Event) {
    const state = this._video.remote.state;
    if (state === this._state) return;

    const detail = { type: this._type, state } as const;
    this._ctx.delegate._notify('remote-playback-change', detail, event);

    this._state = state;
  }
}

export class VideoAirPlayAdapter extends VideoRemotePlaybackAdapter {
  override _type = 'airplay' as const;
  protected get _canPrompt() {
    return 'WebKitPlaybackTargetAvailabilityEvent' in window;
  }
}

export class VideoGoogleCastAdapter extends VideoRemotePlaybackAdapter {
  override _type = 'google-cast' as const;
  get _canPrompt() {
    // Google Cast is available natively on Chrome Android >=56
    return IS_CHROME && getAndroidVersion() >= 56;
  }
}
