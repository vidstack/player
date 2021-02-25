import { listen } from '@wcom/events';
import { UpdatingElement } from 'lit-element';
import {
  ProviderBufferedChangeEvent,
  ProviderBufferingChangeEvent,
  ProviderCurrentSrcChangeEvent,
  ProviderDurationChangeEvent,
  ProviderMediaTypeChangeEvent,
  ProviderMutedChangeEvent,
  ProviderPauseEvent,
  ProviderPlaybackEndEvent,
  ProviderPlaybackReadyEvent,
  ProviderPlaybackStartEvent,
  ProviderPlayEvent,
  ProviderPlayingEvent,
  ProviderReadyEvent,
  ProviderTimeChangeEvent,
  ProviderViewTypeChangeEvent,
  ProviderVolumeChangeEvent,
} from './provider/provider.events';
import { Constructor } from '../shared/types';
import { playerContext } from './player.context';
import {
  MediaType,
  PlayerContext,
  PlayerContextProvider,
  ViewType,
} from './player.types';

export type PlayerContextMixinBase = Constructor<UpdatingElement>;

export type PlayerContextCocktail<T extends PlayerContextMixinBase> = T &
  Constructor<{
    readonly context: PlayerContextProvider;
  }>;

export function PlayerContextMixin<T extends PlayerContextMixinBase>(
  Base: T,
): PlayerContextCocktail<T> {
  class PlayerContextMixin extends Base implements PlayerContextProvider {
    [x: string]: unknown;

    /**
     * **DO NOT CALL FROM OUTSIDE THE PLAYER.**
     */
    get context(): PlayerContextProvider {
      return this as PlayerContextProvider;
    }

    /**
     * Context properties that should be reset when media is changed.
     */
    protected resettableCtxProps = new Set<keyof PlayerContext>([
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
     * properties in the `resettableCtxProps` set.
     */
    protected resetPlayerContext() {
      const props = (Object.keys(
        playerContext,
      ) as unknown) as (keyof PlayerContext)[];

      const ctx = this.context;

      props.forEach(prop => {
        if (this.resettableCtxProps.has(prop)) {
          ctx[`${prop}Ctx`] = playerContext[prop].defaultValue;
        }
      });
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Context Updates
     *
     * This section contains the logic for updating context properties when provider events
     * are emitted.
     * -------------------------------------------------------------------------------------------
     */

    @listen(ProviderPlayEvent.TYPE)
    protected handlePlayContextUpdate() {
      this.pausedCtx = false;
    }

    @listen(ProviderPauseEvent.TYPE)
    protected handlePauseContextUpdate() {
      this.pausedCtx = true;
      this.isPlayingCtx = false;
    }

    @listen(ProviderPlayingEvent.TYPE)
    protected handlePlayingContextUpdate() {
      this.pausedCtx = false;
      this.isPlayingCtx = true;
    }

    @listen(ProviderTimeChangeEvent.TYPE)
    protected handleTimeContextUpdate(e: ProviderTimeChangeEvent) {
      this.currentTimeCtx = e.detail;
    }

    @listen(ProviderCurrentSrcChangeEvent.TYPE)
    protected handleCurrentSrcContextUpdate(e: ProviderCurrentSrcChangeEvent) {
      this.currentSrcCtx = e.detail;
      this.resetPlayerContext();
    }

    @listen(ProviderMutedChangeEvent.TYPE)
    protected handleMutedContextUpdate(e: ProviderMutedChangeEvent) {
      this.mutedCtx = e.detail;
    }

    @listen(ProviderVolumeChangeEvent.TYPE)
    protected handleVolumeContextUpdate(e: ProviderVolumeChangeEvent) {
      this.volumeCtx = e.detail;
    }

    @listen(ProviderDurationChangeEvent.TYPE)
    protected handleDurationContextUpdate(e: ProviderDurationChangeEvent) {
      this.durationCtx = e.detail;
    }

    @listen(ProviderBufferedChangeEvent.TYPE)
    protected handleBufferedContextUpdate(e: ProviderBufferedChangeEvent) {
      this.bufferedCtx = e.detail;
    }

    @listen(ProviderBufferingChangeEvent.TYPE)
    protected handleBufferingContextUpdate(e: ProviderBufferingChangeEvent) {
      this.isBufferingCtx = e.detail;
    }

    @listen(ProviderViewTypeChangeEvent.TYPE)
    protected handleViewTypeContextUpdate(e: ProviderViewTypeChangeEvent) {
      const viewType = e.detail;
      this.viewTypeCtx = viewType;
      this.isAudioViewCtx = viewType === ViewType.Audio;
      this.isVideoViewCtx = viewType === ViewType.Video;
    }

    @listen(ProviderMediaTypeChangeEvent.TYPE)
    protected handleMediaTypeContextUpdate(e: ProviderMediaTypeChangeEvent) {
      const mediaType = e.detail;
      this.mediaTypeCtx = mediaType;
      this.isAudioCtx = mediaType === MediaType.Audio;
      this.isVideoCtx = mediaType === MediaType.Video;
    }

    @listen(ProviderReadyEvent.TYPE)
    protected handleReadyContextUpdate() {
      this.isProviderReadyCtx = true;
    }

    @listen(ProviderPlaybackReadyEvent.TYPE)
    protected handlePlaybackReadyContextUpdate() {
      this.isPlaybackReadyCtx = true;
    }

    @listen(ProviderPlaybackStartEvent.TYPE)
    protected handlePlaybackStartContextUpdate() {
      this.hasPlaybackStartedCtx = true;
    }

    @listen(ProviderPlaybackEndEvent.TYPE)
    protected handlePlaybackEndContextUpdate() {
      this.hasPlaybackEndedCtx = true;
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Context Properties
     *
     * This section is responsible for defining context properties. They are mostly updated in the
     * "Context Updates" section above.
     * -------------------------------------------------------------------------------------------
     */

    @playerContext.uuid.provide()
    uuidCtx = playerContext.uuid.defaultValue;

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

    @playerContext.poster.provide()
    posterCtx = playerContext.poster.defaultValue;

    @playerContext.muted.provide()
    mutedCtx = playerContext.muted.defaultValue;

    @playerContext.aspectRatio.provide()
    aspectRatioCtx = playerContext.aspectRatio.defaultValue;

    @playerContext.duration.provide()
    durationCtx = playerContext.duration.defaultValue;

    @playerContext.buffered.provide()
    bufferedCtx = playerContext.buffered.defaultValue;

    @playerContext.device.provide()
    deviceCtx = playerContext.device.defaultValue;

    @playerContext.isMobileDevice.provide()
    isMobileDeviceCtx = playerContext.isMobileDevice.defaultValue;

    @playerContext.isDesktopDevice.provide()
    isDesktopDeviceCtx = playerContext.isDesktopDevice.defaultValue;

    @playerContext.isBuffering.provide()
    isBufferingCtx = playerContext.isBuffering.defaultValue;

    @playerContext.isPlaying.provide()
    isPlayingCtx = playerContext.isPlaying.defaultValue;

    @playerContext.hasPlaybackStarted.provide()
    hasPlaybackStartedCtx = playerContext.hasPlaybackStarted.defaultValue;

    @playerContext.hasPlaybackEnded.provide()
    hasPlaybackEndedCtx = playerContext.hasPlaybackEnded.defaultValue;

    @playerContext.isProviderReady.provide()
    isProviderReadyCtx = playerContext.isProviderReady.defaultValue;

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
