import { effect } from 'maverick.js';

import { MediaPlayerController } from '../api/player-controller';

/**
 * Sync player props with internal store and dispatch change events.
 */
export class MediaStateSync extends MediaPlayerController {
  protected override onSetup() {
    this._init();

    if (__SERVER__) return;

    if (__DEV__) effect(this._watchLogLevel.bind(this));
    effect(this._watchProvidedTypes.bind(this));
    effect(this._watchTitle.bind(this));
    effect(this._watchAutoplay.bind(this));
    effect(this._watchPoster.bind(this));
    effect(this._watchLoop.bind(this));
    effect(this._watchControls.bind(this));
    effect(this._watchCrossOrigin.bind(this));
    effect(this._watchPlaysinline.bind(this));
    effect(this._watchLiveTolerance.bind(this));
    effect(this._watchLive.bind(this));
    effect(this._watchLiveEdge.bind(this));
  }

  private _init() {
    const providedProps = {
      poster: 'providedPoster',
      streamType: 'providedStreamType',
      title: 'providedTitle',
      viewType: 'providedViewType',
    };

    for (const prop of Object.keys(this.$props)) {
      this.$state[providedProps[prop] ?? prop]?.set(this.$props[prop]());
    }

    this.$state.muted.set(this.$props.muted() || this.$props.volume() === 0);
  }

  // Sync "provided" props with internal state. Provided props are used to differentiate from
  // provider inferred values.
  private _watchProvidedTypes() {
    const { viewType, streamType, title, poster } = this.$props;
    this.$state.providedPoster.set(poster());
    this.$state.providedStreamType.set(streamType());
    this.$state.providedViewType.set(viewType());
    this.$state.providedTitle.set(title());
  }

  private _watchLogLevel() {
    if (!__DEV__) return;
    this.$state.logLevel.set(this.$props.logLevel());
  }

  private _watchTitle() {
    const { title } = this.$state;
    this.dispatch('title-change', { detail: title() });
  }

  private _watchAutoplay() {
    const autoplay = this.$props.autoplay();
    this.$state.autoplay.set(autoplay);
    this.dispatch('autoplay-change', { detail: autoplay });
  }

  private _watchLoop() {
    const loop = this.$props.loop();
    this.$state.loop.set(loop);
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
    const crossorigin = this.$props.crossorigin();
    this.$state.crossorigin.set(crossorigin === true ? '' : crossorigin);
  }

  private _watchPlaysinline() {
    const playsinline = this.$props.playsinline();
    this.$state.playsinline.set(playsinline);
    this.dispatch('playsinline-change', { detail: playsinline });
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
