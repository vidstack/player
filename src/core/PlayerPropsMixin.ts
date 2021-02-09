import { property, UpdatingElement } from 'lit-element';
import { Constructor } from '../shared/types';
import { playerContext } from './context';
import { PlayerContextMix } from './PlayerContextMixin';
import { MediaType, PlayerState, ViewType } from './types';

export type PlayerPropsMix = PlayerState;

// TODO: document.
export function PlayerPropsMixin<
  T extends Constructor<PlayerContextMix & UpdatingElement>,
>(constructor: T): Constructor<PlayerPropsMix & UpdatingElement> {
  // TODO: ensure readonly properties are typed as such.
  class PlayerElement extends constructor {
    @property({ type: String })
    get src() {
      // TODO: return property from provider.
      return playerContext.src.defaultValue;
    }

    set src(newSrc) {
      // TODO: call appropriate function.
      console.log('New src', newSrc);
    }

    @property({ type: Number })
    get volume() {
      // TODO: return property from provider.
      return playerContext.volume.defaultValue;
    }

    set volume(newVolume) {
      // TODO: set value on provider.
      console.log('New volume', newVolume);
    }

    @property({ type: Number })
    get currentTime() {
      // TODO: return property from provider.
      return playerContext.currentTime.defaultValue;
    }

    set currentTime(newCurrentTime) {
      // TODO: set value on provider.
      console.log('New currentTime', newCurrentTime);
    }

    @property({ type: Boolean })
    get paused() {
      // TODO: return property from provider.
      return playerContext.paused.defaultValue;
    }

    set paused(newPaused) {
      // TODO: set value on provider.
      console.log('New paused', newPaused);
    }

    @property({ type: String })
    get poster() {
      // TODO: return property from provider.
      return playerContext.poster.defaultValue;
    }

    set poster(newPoster) {
      // TODO: set value on provider.
      console.log('New poster', newPoster);
    }

    @property({ type: String, attribute: 'aspect-ratio' })
    get aspectRatio() {
      // TODO: return property from provider.
      return playerContext.aspectRatio.defaultValue;
    }

    set aspectRatio(newAspectRatio) {
      // TODO: set value on provider.
      console.log('New aspectRatio', newAspectRatio);
    }

    get duration() {
      // TODO: return property from provider.
      return playerContext.duration.defaultValue;
    }

    @property({ type: Boolean })
    get muted() {
      // TODO: return property from provider.
      return playerContext.muted.defaultValue;
    }

    set muted(newMuted) {
      // TODO: set value on provider.
      console.log('New muted', newMuted);
    }

    get buffered() {
      // TODO: return property from provider.
      return playerContext.buffered.defaultValue;
    }

    get isMobile() {
      // TODO: return property from provider.
      return playerContext.isMobile.defaultValue;
    }

    get isTouch() {
      // TODO: return property from provider.
      return playerContext.isTouch.defaultValue;
    }

    get isBuffering() {
      // TODO: return property from provider.
      return playerContext.isBuffering.defaultValue;
    }

    get isPlaying() {
      // TODO: return property from provider.
      return playerContext.isPlaying.defaultValue;
    }

    get hasPlaybackStarted() {
      // TODO: return property from provider.
      return playerContext.hasPlaybackStarted.defaultValue;
    }

    get hasPlaybackEnded() {
      // TODO: return property from provider.
      return playerContext.hasPlaybackEnded.defaultValue;
    }

    get isProviderReady() {
      // TODO: return property from provider.
      return playerContext.isProviderReady.defaultValue;
    }

    get isPlaybackReady() {
      // TODO: return property from provider.
      return playerContext.isPlaybackReady.defaultValue;
    }

    get viewType() {
      // TODO: return property from provider.
      return playerContext.viewType.defaultValue;
    }

    get isAudioView() {
      return this.viewType === ViewType.Audio;
    }

    get isVideoView() {
      return this.viewType === ViewType.Video;
    }

    get mediaType() {
      // TODO: return property from provider.
      return playerContext.mediaType.defaultValue;
    }

    get isAudio() {
      return this.mediaType === MediaType.Audio;
    }

    get isVideo() {
      return this.mediaType === MediaType.Video;
    }

    // TODO: Listen for attribute changes to call corresponding provider setter.
  }

  return PlayerElement;
}
