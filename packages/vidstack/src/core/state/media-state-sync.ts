import { effect } from 'maverick.js';

import { MediaPlayerController } from '../api/player-controller';
import type { MediaPlayerProps } from '../api/player-props';

/**
 * Sync player props with internal store and dispatch change events.
 */
export class MediaStateSync extends MediaPlayerController {
  protected override onSetup() {
    this.#init();

    if (__SERVER__) return;

    if (__DEV__) effect(this.#watchLogLevel.bind(this));

    const effects = [
      this.#watchMetadata,
      this.#watchAutoplay,
      this.#watchClipStartTime,
      this.#watchClipEndTime,
      this.#watchControls,
      this.#watchCrossOrigin,
      this.#watchDuration,
      this.#watchLive,
      this.#watchLiveEdge,
      this.#watchLiveTolerance,
      this.#watchLoop,
      this.#watchPlaysInline,
      this.#watchPoster,
      this.#watchProvidedTypes,
      this.#watchTitle,
    ];

    for (const callback of effects) {
      effect(callback.bind(this));
    }
  }

  #init() {
    const providedProps = {
      duration: 'providedDuration',
      loop: 'providedLoop',
      poster: 'providedPoster',
      streamType: 'providedStreamType',
      title: 'providedTitle',
      viewType: 'providedViewType',
    };

    const skip = new Set<keyof MediaPlayerProps>([
      'currentTime',
      'paused',
      'playbackRate',
      'volume',
    ]);

    for (const prop of Object.keys(this.$props) as (keyof MediaPlayerProps)[]) {
      if (skip.has(prop)) continue;
      this.$state[providedProps[prop] ?? prop]?.set(this.$props[prop]());
    }

    this.$state.muted.set(this.$props.muted() || this.$props.volume() === 0);
  }

  // Sync "provided" props with internal state. Provided props are used to differentiate from
  // provider inferred values.
  #watchProvidedTypes() {
    const { viewType, streamType, title, poster, loop } = this.$props,
      $state = this.$state;
    $state.providedPoster.set(poster());
    $state.providedStreamType.set(streamType());
    $state.providedViewType.set(viewType());
    $state.providedTitle.set(title());
    $state.providedLoop.set(loop());
  }

  #watchLogLevel() {
    if (!__DEV__) return;
    this.$state.logLevel.set(this.$props.logLevel());
  }

  #watchMetadata() {
    const { artist, artwork } = this.$props;
    this.$state.artist.set(artist());
    this.$state.artwork.set(artwork());
  }

  #watchTitle() {
    const { title } = this.$state;
    this.dispatch('title-change', { detail: title() });
  }

  #watchAutoplay() {
    // autoplay prop is deprecated, we're syncing for backwards compatibility.
    const autoPlay = this.$props.autoPlay() || this.$props.autoplay();
    this.$state.autoPlay.set(autoPlay);
    this.dispatch('auto-play-change', { detail: autoPlay });
  }

  #watchLoop() {
    const loop = this.$state.loop();
    this.dispatch('loop-change', { detail: loop });
  }

  #watchControls() {
    const controls = this.$props.controls();
    this.$state.controls.set(controls);
  }

  #watchPoster() {
    const { poster } = this.$state;
    this.dispatch('poster-change', { detail: poster() });
  }

  #watchCrossOrigin() {
    // crossorigin prop is deprecated, we're syncing for backwards compatibility.
    const crossOrigin = this.$props.crossOrigin() ?? this.$props.crossorigin(),
      value = crossOrigin === true ? '' : (crossOrigin as '');
    this.$state.crossOrigin.set(value);
  }

  #watchDuration() {
    const { duration } = this.$props;
    this.dispatch('media-duration-change-request', {
      detail: duration(),
    });
  }

  #watchPlaysInline() {
    // playsinline prop is deprecated, we're syncing for backwards compatibility.
    const inline = this.$props.playsInline() || this.$props.playsinline();
    this.$state.playsInline.set(inline);
    this.dispatch('plays-inline-change', { detail: inline });
  }

  #watchClipStartTime() {
    const { clipStartTime } = this.$props;
    this.dispatch('media-clip-start-change-request', {
      detail: clipStartTime(),
    });
  }

  #watchClipEndTime() {
    const { clipEndTime } = this.$props;
    this.dispatch('media-clip-end-change-request', {
      detail: clipEndTime(),
    });
  }

  #watchLive() {
    this.dispatch('live-change', { detail: this.$state.live() });
  }

  #watchLiveTolerance() {
    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }

  #watchLiveEdge() {
    this.dispatch('live-edge-change', { detail: this.$state.liveEdge() });
  }
}
