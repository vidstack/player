import { effect } from 'maverick.js';

import { MediaPlayerController } from '../api/player-controller';

/**
 * Sync player props with internal store and dispatch change events.
 */
export class MediaStateSync extends MediaPlayerController {
  protected override onSetup() {
    if (__SERVER__) return;
    if (__DEV__) effect(this._onLogLevelChange.bind(this));
    effect(this._onAutoplayChange.bind(this));
    effect(this._onPosterChange.bind(this));
    effect(this._onLoopChange.bind(this));
    effect(this._onControlsChange.bind(this));
    effect(this._onCrossOriginChange.bind(this));
    effect(this._onPlaysinlineChange.bind(this));
    effect(this._onLiveToleranceChange.bind(this));
    effect(this._onLiveChange.bind(this));
    effect(this._onLiveEdgeChange.bind(this));
    effect(this._onThumbnailsChange.bind(this));
  }

  private _onLogLevelChange() {
    if (!__DEV__) return;
    this.$state.logLevel.set(this.$props.logLevel());
  }

  private _onAutoplayChange() {
    const autoplay = this.$props.autoplay();
    this.$state.autoplay.set(autoplay);
    this.dispatch('autoplay-change', { detail: autoplay });
  }

  private _onLoopChange() {
    const loop = this.$props.loop();
    this.$state.loop.set(loop);
    this.dispatch('loop-change', { detail: loop });
  }

  private _onControlsChange() {
    const controls = this.$props.controls();
    this.$state.controls.set(controls);
  }

  private _onPosterChange() {
    const poster = this.$props.poster();
    this.$state.poster.set(poster);
    this.dispatch('poster-change', { detail: poster });
  }

  private _onCrossOriginChange() {
    this.$state.crossorigin.set(this.$props.crossorigin());
  }

  private _onPlaysinlineChange() {
    const playsinline = this.$props.playsinline();
    this.$state.playsinline.set(playsinline);
    this.dispatch('playsinline-change', { detail: playsinline });
  }

  private _onLiveChange() {
    this.dispatch('live-change', { detail: this.$state.live() });
  }

  private _onLiveToleranceChange() {
    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }

  private _onLiveEdgeChange() {
    this.dispatch('live-edge-change', { detail: this.$state.liveEdge() });
  }

  protected _onThumbnailsChange() {
    this.$state.thumbnails.set(this.$props.thumbnails());
  }
}
