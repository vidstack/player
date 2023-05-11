import { effect } from 'maverick.js';
import { ComponentController } from 'maverick.js/element';

import type { PlayerAPI } from '../player';

/**
 * Sync player props with internal store and dispatch change events.
 */
export class MediaStoreSync extends ComponentController<PlayerAPI> {
  protected override onAttach(el: HTMLElement): void {
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
    effect(this._onTitleChange.bind(this));
  }

  private _onLogLevelChange() {
    if (!__DEV__) return;
    this.$store.logLevel.set(this.$props.logLevel());
  }

  private _onAutoplayChange() {
    const autoplay = this.$props.autoplay();
    this.$store.autoplay.set(autoplay);
    this.dispatch('autoplay-change', { detail: autoplay });
  }

  private _onLoopChange() {
    const loop = this.$props.loop();
    this.$store.loop.set(loop);
    this.dispatch('loop-change', { detail: loop });
  }

  private _onControlsChange() {
    const controls = this.$props.controls();
    this.$store.controls.set(controls);
    this.dispatch('controls-change', { detail: controls });
  }

  private _onPosterChange() {
    const poster = this.$props.poster();
    this.$store.poster.set(poster);
    this.dispatch('poster-change', { detail: poster });
  }

  private _onCrossOriginChange() {
    this.$store.crossorigin.set(this.$props.crossorigin());
  }

  private _onPlaysinlineChange() {
    const playsinline = this.$props.playsinline();
    this.$store.playsinline.set(playsinline);
    this.dispatch('playsinline-change', { detail: playsinline });
  }

  private _onLiveChange() {
    this.dispatch('live-change', { detail: this.$store.live() });
  }

  private _onLiveToleranceChange() {
    this.$store.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$store.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }

  private _onLiveEdgeChange() {
    this.dispatch('live-edge-change', { detail: this.$store.liveEdge() });
  }

  protected _onThumbnailsChange() {
    this.$store.thumbnails.set(this.$props.thumbnails());
  }

  protected _onTitleChange() {
    this.$store.title.set(this.$props.title());
  }
}
