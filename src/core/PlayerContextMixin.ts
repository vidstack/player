import { listen } from '@wcom/events';
import { UpdatingElement } from 'lit-element';
import {
  ProviderBufferedChangeEvent,
  ProviderBufferingChangeEvent,
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
import { MediaType, PlayerContextProvider, ViewType } from './player.types';

export type PlayerContextMixinBase = Constructor<UpdatingElement>;

export type PlayerContextCocktail<T extends PlayerContextMixinBase> = T &
  Constructor<{
    readonly context: PlayerContextProvider;
  }>;

export function PlayerContextMixin<T extends PlayerContextMixinBase>(
  Base: T,
): PlayerContextCocktail<T> {
  class PlayerContextMixin extends Base {
    /**
     * **DO NOT CALL FROM OUTSIDE THE PLAYER.**
     */
    get context(): PlayerContextProvider {
      return this as PlayerContextProvider;
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
    protected uuidCtx = playerContext.uuid.defaultValue;

    @playerContext.volume.provide()
    protected volumeCtx = playerContext.volume.defaultValue;

    @playerContext.currentTime.provide()
    protected currentTimeCtx = playerContext.currentTime.defaultValue;

    @playerContext.paused.provide()
    protected pausedCtx = playerContext.paused.defaultValue;

    @playerContext.controls.provide()
    protected controlsCtx = playerContext.controls.defaultValue;

    @playerContext.poster.provide()
    protected posterCtx = playerContext.poster.defaultValue;

    @playerContext.muted.provide()
    protected mutedCtx = playerContext.muted.defaultValue;

    @playerContext.aspectRatio.provide()
    protected aspectRatioCtx = playerContext.aspectRatio.defaultValue;

    @playerContext.duration.provide()
    protected durationCtx = playerContext.duration.defaultValue;

    @playerContext.buffered.provide()
    protected bufferedCtx = playerContext.buffered.defaultValue;

    @playerContext.device.provide()
    protected deviceCtx = playerContext.device.defaultValue;

    @playerContext.isMobileDevice.provide()
    protected isMobileDeviceCtx = playerContext.isMobileDevice.defaultValue;

    @playerContext.isDesktopDevice.provide()
    protected isDesktopDeviceCtx = playerContext.isDesktopDevice.defaultValue;

    @playerContext.isBuffering.provide()
    protected isBufferingCtx = playerContext.isBuffering.defaultValue;

    @playerContext.isPlaying.provide()
    protected isPlayingCtx = playerContext.isPlaying.defaultValue;

    @playerContext.hasPlaybackStarted.provide()
    protected hasPlaybackStartedCtx =
      playerContext.hasPlaybackStarted.defaultValue;

    @playerContext.hasPlaybackEnded.provide()
    protected hasPlaybackEndedCtx = playerContext.hasPlaybackEnded.defaultValue;

    @playerContext.isProviderReady.provide()
    protected isProviderReadyCtx = playerContext.isProviderReady.defaultValue;

    @playerContext.isPlaybackReady.provide()
    protected isPlaybackReadyCtx = playerContext.isPlaybackReady.defaultValue;

    @playerContext.viewType.provide()
    protected viewTypeCtx = playerContext.viewType.defaultValue;

    @playerContext.isAudioView.provide()
    protected isAudioViewCtx = playerContext.isAudioView.defaultValue;

    @playerContext.isVideoView.provide()
    protected isVideoViewCtx = playerContext.isVideoView.defaultValue;

    @playerContext.mediaType.provide()
    protected mediaTypeCtx = playerContext.mediaType.defaultValue;

    @playerContext.isAudio.provide()
    protected isAudioCtx = playerContext.isAudio.defaultValue;

    @playerContext.isVideo.provide()
    protected isVideoCtx = playerContext.isVideo.defaultValue;
  }

  return PlayerContextMixin;
}
