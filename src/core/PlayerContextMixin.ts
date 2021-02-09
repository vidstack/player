/* eslint-disable max-classes-per-file */

import { UpdatingElement } from 'lit-element';
import { Constructor } from '../shared/types';
import { playerContext } from './context';
import { PlayerState } from './types';

export type PlayerContextMix = {
  [P in keyof PlayerState as `${P}Ctx`]: PlayerState[P];
};

// TODO: document.
export function PlayerContextMixin<T extends Constructor<UpdatingElement>>(
  constructor: T,
): T & Constructor<PlayerContextMix> {
  class PlayerElement extends constructor {
    @playerContext.src.provide()
    srcCtx = playerContext.src.defaultValue;

    @playerContext.volume.provide()
    volumeCtx = playerContext.volume.defaultValue;

    @playerContext.currentTime.provide()
    currentTimeCtx = playerContext.currentTime.defaultValue;

    @playerContext.paused.provide()
    pausedCtx = playerContext.paused.defaultValue;

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

    @playerContext.isMobile.provide()
    isMobileCtx = playerContext.isMobile.defaultValue;

    @playerContext.isTouch.provide()
    isTouchCtx = playerContext.isTouch.defaultValue;

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

    // TODO: wire up listening to provider events to update context.
  }

  return PlayerElement;
}
