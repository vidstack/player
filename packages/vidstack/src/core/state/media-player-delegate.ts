import { peek, tick } from 'maverick.js';
import { DOMEvent, type InferEventDetail } from 'maverick.js/std';

import type { MediaContext } from '../api/media-context';
import type { MediaEvents } from '../api/media-events';

let seenAutoplayWarning = false;

export class MediaPlayerDelegate {
  constructor(
    private _handle: (event: Event) => void,
    private _media: MediaContext,
  ) {}

  _notify = <Type extends keyof MediaEvents>(
    type: Type,
    ...init: InferEventDetail<MediaEvents[Type]> extends void | undefined | never
      ? [detail?: never, trigger?: Event]
      : [detail: InferEventDetail<MediaEvents[Type]>, trigger?: Event]
  ) => {
    if (__SERVER__) return;
    this._handle(
      new DOMEvent<any>(type, {
        detail: init?.[0],
        trigger: init?.[1],
      }),
    );
  };

  async _ready(
    info?: {
      duration: number;
      seekable: TimeRanges;
      buffered: TimeRanges;
    },
    trigger?: Event,
  ) {
    if (__SERVER__) return;

    const { $state, logger } = this._media;

    if (peek($state.canPlay)) return;

    const detail = {
      duration: info?.duration ?? peek($state.duration),
      seekable: info?.seekable ?? peek($state.seekable),
      buffered: info?.buffered ?? peek($state.buffered),
      provider: peek(this._media.$provider)!,
    };

    this._notify('can-play', detail, trigger);

    tick();

    if (__DEV__) {
      logger
        ?.infoGroup('-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-')
        .labelledLog('Media Store', { ...$state })
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    if ($state.canPlay() && $state.autoplay() && !$state.started()) {
      await this._attemptAutoplay(trigger);
    }
  }

  private async _attemptAutoplay(trigger?: Event) {
    const { player, $state } = this._media;

    $state.autoplaying.set(true);

    const attemptEvent = new DOMEvent<void>('autoplay-attempt', { trigger });

    try {
      await player.play(attemptEvent);
    } catch (error) {
      if (__DEV__ && !seenAutoplayWarning) {
        const muteMsg = !$state.muted()
          ? ' Attempting with volume muted will most likely resolve the issue.'
          : '';

        this._media.logger
          ?.errorGroup('autoplay request failed')
          .labelledLog(
            'Message',
            `Autoplay was requested but failed most likely due to browser autoplay policies.${muteMsg}`,
          )
          .labelledLog('Trigger Event', trigger)
          .labelledLog('Error', error)
          .labelledLog('See', 'https://developer.chrome.com/blog/autoplay')
          .dispatch();

        seenAutoplayWarning = true;
      }
    }
  }
}
