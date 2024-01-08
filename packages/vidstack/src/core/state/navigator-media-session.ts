import { effect, onDispose } from 'maverick.js';
import { DOMEvent, isNumber } from 'maverick.js/std';

import { MediaPlayerController } from '../api/player-controller';

export class NavigatorMediaSession extends MediaPlayerController {
  protected static _actions = ['play', 'pause', 'seekforward', 'seekbackward', 'seekto'] as const;

  constructor() {
    super();
  }

  protected override onConnect() {
    effect(this._onMetadataChange.bind(this));
    effect(this._onPlaybackStateChange.bind(this));

    const handleAction = this._handleAction.bind(this);
    for (const action of NavigatorMediaSession._actions) {
      navigator.mediaSession.setActionHandler(action, handleAction);
    }

    onDispose(this._onDisconnect.bind(this));
  }

  protected _onDisconnect() {
    for (const action of NavigatorMediaSession._actions) {
      navigator.mediaSession.setActionHandler(action, null);
    }
  }

  protected _onMetadataChange() {
    const { title, artist, poster } = this.$state;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title(),
      artist: artist(),
      artwork: [{ src: poster() }],
    });
  }

  protected _onPlaybackStateChange() {
    const { canPlay, paused } = this.$state;
    navigator.mediaSession.playbackState = !canPlay() ? 'none' : paused() ? 'paused' : 'playing';
  }

  protected _handleAction(details: MediaSessionActionDetails) {
    const trigger = new DOMEvent(`media-session-action`, { detail: details });
    switch (details.action) {
      case 'play':
        this.dispatch('media-play-request', { trigger });
        break;
      case 'pause':
        this.dispatch('media-pause-request', { trigger });
        break;
      case 'seekto':
      case 'seekforward':
      case 'seekbackward':
        this.dispatch('media-seek-request', {
          detail: isNumber(details.seekTime)
            ? details.seekTime
            : this.$state.currentTime() + (details.seekOffset ?? 10),
          trigger,
        });
        break;
    }
  }
}
