import { effect, onDispose } from 'maverick.js';
import { DOMEvent, isNumber } from 'maverick.js/std';

import { MediaPlayerController } from '../api/player-controller';

const actions = ['play', 'pause', 'seekforward', 'seekbackward', 'seekto'] as const;

export class NavigatorMediaSession extends MediaPlayerController {
  protected override onConnect() {
    effect(this.#onMetadataChange.bind(this));
    effect(this.#onPlaybackStateChange.bind(this));

    const handleAction = this.#handleAction.bind(this);
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, handleAction);
    }

    onDispose(this.#onDisconnect.bind(this));
  }

  #onDisconnect() {
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, null);
    }
  }

  #onMetadataChange() {
    const { title, artist, artwork, poster } = this.$state;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title(),
      artist: artist(),
      artwork: artwork() ?? [{ src: poster() }],
    });
  }

  #onPlaybackStateChange() {
    const { canPlay, paused } = this.$state;
    navigator.mediaSession.playbackState = !canPlay() ? 'none' : paused() ? 'paused' : 'playing';
  }

  #handleAction(details: MediaSessionActionDetails) {
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
            : this.$state.currentTime() + (details.seekOffset ?? (details.action === "seekforward" ? 10 : -10)),
          trigger,
        });
        break;
    }
  }
}
