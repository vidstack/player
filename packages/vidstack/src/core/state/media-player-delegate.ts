import { tick, untrack } from 'maverick.js';
import { DOMEvent, type InferEventDetail } from 'maverick.js/std';

import type { MediaContext } from '../api/media-context';
import type { MediaEvents } from '../api/media-events';
import type { VideoQuality } from '../quality/video-quality';

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

    return untrack(async () => {
      const { logger } = this._media,
        {
          autoPlay,
          canPlay,
          started,
          duration,
          seekable,
          buffered,
          remotePlaybackInfo,
          playsInline,
          savedState,
        } = this._media.$state;

      if (canPlay()) return;

      const detail = {
        duration: info?.duration ?? duration(),
        seekable: info?.seekable ?? seekable(),
        buffered: info?.buffered ?? buffered(),
        provider: this._media.$provider()!,
      };

      this._notify('can-play', detail, trigger);

      tick();

      if (__DEV__) {
        logger
          ?.infoGroup('-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-')
          .labelledLog('Media', this._media)
          .labelledLog('Trigger Event', trigger)
          .dispatch();
      }

      let provider = this._media.$provider(),
        { storage, qualities } = this._media,
        { muted, volume, clipStartTime, playbackRate } = this._media.$props;

      const savedPlaybackTime = savedState()?.currentTime,
        savedPlayingState = savedState()?.paused === false,
        startTime = savedPlaybackTime ?? (await storage?.getTime()) ?? clipStartTime(),
        shouldAutoPlay =
          savedPlayingState || (savedPlayingState !== false && !started() && autoPlay());

      if (provider) {
        provider.setVolume((await storage?.getVolume()) ?? volume());
        provider.setMuted((await storage?.getMuted()) ?? muted());

        const audioGain = (await storage?.getAudioGain()) ?? 1;
        if (audioGain > 1) provider.audioGain?.setGain?.(audioGain);

        provider.setPlaybackRate?.((await storage?.getPlaybackRate()) ?? playbackRate());
        provider.setPlaysInline?.(playsInline());

        if (startTime > 0) provider.setCurrentTime(startTime);
      }

      const prefQuality = await storage?.getVideoQuality();
      if (prefQuality && qualities.length) {
        let currentQuality: VideoQuality | null = null,
          currentScore = Infinity;

        for (const quality of qualities) {
          const score =
            Math.abs(prefQuality.width - quality.width) +
            Math.abs(prefQuality.height - quality.height) +
            (prefQuality.bitrate ? Math.abs(prefQuality.bitrate - (quality.bitrate ?? 0)) : 0);

          // Lowest score wins (smallest diff between width/height/bitrate).
          if (score < currentScore) {
            currentQuality = quality;
            currentScore = score;
          }
        }

        if (currentQuality) currentQuality.selected = true;
      }

      if (canPlay() && shouldAutoPlay) {
        await this._attemptAutoplay(trigger);
      }

      remotePlaybackInfo.set(null);
    });
  }

  private async _attemptAutoplay(trigger?: Event) {
    const {
      player,
      $state: { autoPlaying, muted },
    } = this._media;

    autoPlaying.set(true);

    const attemptEvent = new DOMEvent<void>('auto-play-attempt', { trigger });

    try {
      await player.play(attemptEvent);
    } catch (error) {
      if (__DEV__ && !seenAutoplayWarning) {
        const muteMsg = !muted()
          ? ' Attempting with volume muted will most likely resolve the issue.'
          : '';

        this._media.logger
          ?.errorGroup('[vidstack] auto-play request failed')
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
