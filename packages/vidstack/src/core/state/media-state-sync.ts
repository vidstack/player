import { effect } from 'maverick.js';

import { MediaPlayerController } from '../api/player-controller';
import type { MediaPlayerProps } from '../api/player-props';

/**
 * Sync player props with internal store and dispatch change events.
 */
export class MediaStateSync extends MediaPlayerController {
  protected override onSetup() {
    this._init();

    if (__SERVER__) return;

    if (__DEV__) effect(this._watchLogLevel.bind(this));
    effect(this._watchArtist.bind(this));
    effect(this._watchAutoplay.bind(this));
    effect(this._watchClipTimes.bind(this));
    effect(this._watchControls.bind(this));
    effect(this._watchCrossOrigin.bind(this));
    effect(this._watchDuration.bind(this));
    effect(this._watchLive.bind(this));
    effect(this._watchLiveEdge.bind(this));
    effect(this._watchLiveTolerance.bind(this));
    effect(this._watchLoop.bind(this));
    effect(this._watchPlaysInline.bind(this));
    effect(this._watchPoster.bind(this));
    effect(this._watchProvidedTypes.bind(this));
    effect(this._watchTitle.bind(this));
  }

  private _init() {
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
  private _watchProvidedTypes() {
    const { viewType, streamType, title, poster, loop } = this.$props,
      $state = this.$state;
    $state.providedPoster.set(poster());
    $state.providedStreamType.set(streamType());
    $state.providedViewType.set(viewType());
    $state.providedTitle.set(title());
    $state.providedLoop.set(loop());
  }

  private _watchLogLevel() {
    if (!__DEV__) return;
    this.$state.logLevel.set(this.$props.logLevel());
  }

  private _watchArtist() {
    const { artist } = this.$props;
    this.$state.artist.set(artist());
  }

  private _watchTitle() {
    const { title } = this.$state;
    this.dispatch('title-change', { detail: title() });
  }

  private _watchAutoplay() {
    // autoplay prop is deprecated, we're syncing for backwards compatibility.
    const autoPlay = this.$props.autoPlay() || this.$props.autoplay();
    this.$state.autoPlay.set(autoPlay);
    this.dispatch('auto-play-change', { detail: autoPlay });
  }

  private _watchLoop() {
    const loop = this.$state.loop();
    this.dispatch('loop-change', { detail: loop });
  }

  private _watchControls() {
    const controls = this.$props.controls();
    this.$state.controls.set(controls);
  }

  private _watchPoster() {
    const { poster } = this.$state;
    this.dispatch('poster-change', { detail: poster() });
  }

  private _watchCrossOrigin() {
    // crossorigin prop is deprecated, we're syncing for backwards compatibility.
    const _crossOrigin = this.$props.crossOrigin() ?? this.$props.crossorigin(),
      value = _crossOrigin === true ? '' : (_crossOrigin as '');
    this.$state.crossOrigin.set(value);
  }

  private _watchDuration() {
    const { providedDuration } = this.$state;
    providedDuration.set(this.$props.duration());
  }

  private _watchPlaysInline() {
    // playsinline prop is deprecated, we're syncing for backwards compatibility.
    const inline = this.$props.playsInline() || this.$props.playsinline();
    this.$state.playsInline.set(inline);
    this.dispatch('plays-inline-change', { detail: inline });
  }

  private _watchClipTimes() {
    const { clipStartTime, clipEndTime } = this.$props;
    this.$state.clipStartTime.set(clipStartTime());
    this.$state.clipEndTime.set(clipEndTime());
  }

  private _watchLive() {
    this.dispatch('live-change', { detail: this.$state.live() });
  }

  private _watchLiveTolerance() {
    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }

  private _watchLiveEdge() {
    this.dispatch('live-edge-change', { detail: this.$state.liveEdge() });
  }
}
