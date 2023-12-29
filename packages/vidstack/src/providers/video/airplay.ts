import { isFunction, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { MediaAirPlayAdapter } from '../types';

export class VideoAirPlayAdapter implements MediaAirPlayAdapter {
  protected _supported?: boolean;
  protected _state?: RemotePlaybackState;

  constructor(
    private _video: HTMLVideoElement,
    private _ctx: MediaContext,
  ) {
    if (!this.supported) return;

    const events = ['connecting', 'connect', 'disconnect'],
      onStateChange = this._onStateChange.bind(this);

    onStateChange();
    listenEvent(_video, 'playing', onStateChange);

    for (const type of events) {
      // @ts-expect-error - video remote not typed
      listenEvent(_video.remote, type, onStateChange);
    }
  }

  get supported() {
    return (this._supported ??=
      !__SERVER__ &&
      this._video.remote &&
      'WebKitPlaybackTargetAvailabilityEvent' in window &&
      isFunction(this._video.webkitShowPlaybackTargetPicker));
  }

  async request() {
    if (!this.supported) throw Error('AirPlay is not supported on this platform.');
    this._video.webkitShowPlaybackTargetPicker!();
  }

  protected _onStateChange(event?: Event) {
    const state = this._video.remote.state;
    if (state === this._state) return;

    const detail = { type: 'airplay', state } as const;
    this._ctx.delegate._notify('remote-playback-change', detail, event);

    this._state = state;
  }
}
