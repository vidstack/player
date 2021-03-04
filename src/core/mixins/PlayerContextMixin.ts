import { listen } from '@wcom/events';
import { UpdatingElement } from 'lit-element';

import { Constructor } from '../../shared/types';
import { playerContext } from '../player.context';
import {
  BufferedChangeEvent,
  BufferingChangeEvent,
  DisconnectEvent,
  DurationChangeEvent,
  MediaTypeChangeEvent,
  MutedChangeEvent,
  PauseEvent,
  PlaybackEndEvent,
  PlaybackReadyEvent,
  PlaybackStartEvent,
  PlayEvent,
  PlayingEvent,
  PosterChangeEvent,
  SrcChangeEvent,
  TimeChangeEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
} from '../player.events';
import {
  MediaType,
  PlayerContext,
  PlayerContextProvider,
  ViewType,
} from '../player.types';
import { AspectRatioChangeEvent } from './AspectRatioMixin';

export type PlayerContextMixinBase = Constructor<UpdatingElement>;

export type PlayerContextCocktail<T extends PlayerContextMixinBase> = T &
  Constructor<{
    /**
     * **DO NOT CALL FROM OUTSIDE THE PLAYER.**
     *
     * @internal - Used for testing.
     */
    readonly playerContext: PlayerContextProvider;
  }>;

/**
 * Mixes in context properties (providers) and handles updating them when provider events are
 * emitted.
 *
 * @param Base - The constructor to mix into.
 */
export function PlayerContextMixin<T extends PlayerContextMixinBase>(
  Base: T,
): PlayerContextCocktail<T> {
  class PlayerContextMixin extends Base implements PlayerContextProvider {
    [x: string]: unknown;

    get playerContext(): PlayerContextProvider {
      return this as PlayerContextProvider;
    }

    /**
     * Context properties that should be reset when media is changed.
     */
    protected softResettableCtxProps = new Set<keyof PlayerContext>([
      'paused',
      'currentTime',
      'duration',
      'buffered',
      'isPlaying',
      'isBuffering',
      'isPlaybackReady',
      'hasPlaybackStarted',
      'hasPlaybackEnded',
      'mediaType',
    ]);

    /**
     * When the `currentSrc` is changed this method is called to update any context properties
     * that need to be reset. Important to note that not all properties are reset, only the
     * properties in the `softResettableCtxProps` set.
     */
    protected softResetPlayerContext() {
      const props = (Object.keys(
        playerContext,
      ) as unknown) as (keyof PlayerContext)[];

      const ctx = this.playerContext;

      props.forEach(prop => {
        if (this.softResettableCtxProps.has(prop)) {
          ctx[`${prop}Ctx`] = playerContext[prop].defaultValue;
        }
      });
    }

    /**
     * Called when the provider disconnects, resets the player context completely.
     */
    protected hardResetPlayerContext() {
      const props = (Object.keys(
        playerContext,
      ) as unknown) as (keyof PlayerContext)[];

      const ctx = this.playerContext;

      props.forEach(prop => {
        ctx[`${prop}Ctx`] = playerContext[prop].defaultValue;
      });
    }

    // -------------------------------------------------------------------------------------------
    // Context Updates
    // -------------------------------------------------------------------------------------------

    @listen(AspectRatioChangeEvent.TYPE)
    protected handleAspectRatioContextUpdate(e: AspectRatioChangeEvent) {
      this.aspectRatioCtx = e.detail;
    }

    @listen(DisconnectEvent.TYPE)
    protected handleDisconnectContextUpdate() {
      this.hardResetPlayerContext();
    }

    @listen(PlayEvent.TYPE)
    protected handlePlayContextUpdate() {
      this.pausedCtx = false;
    }

    @listen(PauseEvent.TYPE)
    protected handlePauseContextUpdate() {
      this.pausedCtx = true;
      this.isPlayingCtx = false;
    }

    @listen(PlayingEvent.TYPE)
    protected handlePlayingContextUpdate() {
      this.pausedCtx = false;
      this.isPlayingCtx = true;
    }

    @listen(TimeChangeEvent.TYPE)
    protected handleTimeContextUpdate(e: TimeChangeEvent) {
      this.currentTimeCtx = e.detail;
    }

    @listen(SrcChangeEvent.TYPE)
    protected handleCurrentSrcContextUpdate(e: SrcChangeEvent) {
      this.currentSrcCtx = e.detail;
      this.softResetPlayerContext();
    }

    @listen(PosterChangeEvent.TYPE)
    protected handlePosterContextUpdate(e: PosterChangeEvent) {
      this.currentPosterCtx = e.detail;
    }

    @listen(MutedChangeEvent.TYPE)
    protected handleMutedContextUpdate(e: MutedChangeEvent) {
      this.mutedCtx = e.detail;
    }

    @listen(VolumeChangeEvent.TYPE)
    protected handleVolumeContextUpdate(e: VolumeChangeEvent) {
      this.volumeCtx = e.detail;
    }

    @listen(DurationChangeEvent.TYPE)
    protected handleDurationContextUpdate(e: DurationChangeEvent) {
      this.durationCtx = e.detail;
    }

    @listen(BufferedChangeEvent.TYPE)
    protected handleBufferedContextUpdate(e: BufferedChangeEvent) {
      this.bufferedCtx = e.detail;
    }

    @listen(BufferingChangeEvent.TYPE)
    protected handleBufferingContextUpdate(e: BufferingChangeEvent) {
      this.isBufferingCtx = e.detail;
    }

    @listen(ViewTypeChangeEvent.TYPE)
    protected handleViewTypeContextUpdate(e: ViewTypeChangeEvent) {
      const viewType = e.detail;
      this.viewTypeCtx = viewType;
      this.isAudioViewCtx = viewType === ViewType.Audio;
      this.isVideoViewCtx = viewType === ViewType.Video;
    }

    @listen(MediaTypeChangeEvent.TYPE)
    protected handleMediaTypeContextUpdate(e: MediaTypeChangeEvent) {
      const mediaType = e.detail;
      this.mediaTypeCtx = mediaType;
      this.isAudioCtx = mediaType === MediaType.Audio;
      this.isVideoCtx = mediaType === MediaType.Video;
    }

    @listen(PlaybackReadyEvent.TYPE)
    protected handlePlaybackReadyContextUpdate() {
      this.isPlaybackReadyCtx = true;
    }

    @listen(PlaybackStartEvent.TYPE)
    protected handlePlaybackStartContextUpdate() {
      this.hasPlaybackStartedCtx = true;
    }

    @listen(PlaybackEndEvent.TYPE)
    protected handlePlaybackEndContextUpdate() {
      this.hasPlaybackEndedCtx = true;
    }

    // -------------------------------------------------------------------------------------------
    // Context Properties
    // -------------------------------------------------------------------------------------------

    @playerContext.currentSrc.provide()
    currentSrcCtx = playerContext.currentSrc.defaultValue;

    @playerContext.volume.provide()
    volumeCtx = playerContext.volume.defaultValue;

    @playerContext.currentTime.provide()
    currentTimeCtx = playerContext.currentTime.defaultValue;

    @playerContext.paused.provide()
    pausedCtx = playerContext.paused.defaultValue;

    @playerContext.controls.provide()
    controlsCtx = playerContext.controls.defaultValue;

    @playerContext.currentPoster.provide()
    currentPosterCtx = playerContext.currentPoster.defaultValue;

    @playerContext.muted.provide()
    mutedCtx = playerContext.muted.defaultValue;

    @playerContext.aspectRatio.provide()
    aspectRatioCtx = playerContext.aspectRatio.defaultValue;

    @playerContext.duration.provide()
    durationCtx = playerContext.duration.defaultValue;

    @playerContext.buffered.provide()
    bufferedCtx = playerContext.buffered.defaultValue;

    @playerContext.isBuffering.provide()
    isBufferingCtx = playerContext.isBuffering.defaultValue;

    @playerContext.isPlaying.provide()
    isPlayingCtx = playerContext.isPlaying.defaultValue;

    @playerContext.hasPlaybackStarted.provide()
    hasPlaybackStartedCtx = playerContext.hasPlaybackStarted.defaultValue;

    @playerContext.hasPlaybackEnded.provide()
    hasPlaybackEndedCtx = playerContext.hasPlaybackEnded.defaultValue;

    @playerContext.isPlaybackReady.provide()
    isPlaybackReadyCtx = playerContext.isPlaybackReady.defaultValue;

    @playerContext.viewType.provide()
    viewTypeCtx = playerContext.viewType.defaultValue;

    @playerContext.isAudioView.provide()
    isAudioViewCtx = playerContext.isAudioView.defaultValue;

    @playerContext.isVideoView.provide()
    isVideoViewCtx = playerContext.isVideoView.defaultValue;

    @playerContext.mediaType.provide()
    mediaTypeCtx = playerContext.mediaType.defaultValue;

    @playerContext.isAudio.provide()
    isAudioCtx = playerContext.isAudio.defaultValue;

    @playerContext.isVideo.provide()
    isVideoCtx = playerContext.isVideo.defaultValue;
  }

  return PlayerContextMixin;
}
