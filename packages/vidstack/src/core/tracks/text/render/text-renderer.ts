import { effect, onDispose } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../../api/media-context';
import { TextTrackSymbol } from '../symbols';
import { isTrackCaptionKind, TextTrack } from '../text-track';
import type { TextTrackAddEvent, TextTrackList, TextTrackRemoveEvent } from '../text-tracks';
import { NativeTextRenderer } from './native-text-renderer';

export class TextRenderers {
  private _video: HTMLVideoElement | null = null;
  private _textTracks: TextTrackList;
  private _renderers: TextRenderer[] = [];

  private _nativeDisplay = false;
  private _nativeRenderer: NativeTextRenderer | null = null;
  private _customRenderer: TextRenderer | null = null;

  constructor(private _media: MediaContext) {
    const textTracks = _media.textTracks;
    this._textTracks = textTracks;
    effect(this._watchControls.bind(this));
    onDispose(this._detach.bind(this));
    listenEvent(textTracks, 'add', this._onAddTrack.bind(this));
    listenEvent(textTracks, 'remove', this._onRemoveTrack.bind(this));
    listenEvent(textTracks, 'mode-change', this._update.bind(this));
  }

  private _watchControls() {
    const { $state, $iosControls } = this._media;
    this._nativeDisplay = $state.controls() || $iosControls();
    this._update();
  }

  add(renderer: TextRenderer) {
    this._renderers.push(renderer);
    this._update();
  }

  remove(renderer: TextRenderer) {
    renderer.detach();
    this._renderers.splice(this._renderers.indexOf(renderer), 1);
    this._update();
  }

  /* @internal */
  _attachVideo(video: HTMLVideoElement | null) {
    requestAnimationFrame(() => {
      this._video = video;

      if (video) {
        this._nativeRenderer = new NativeTextRenderer();
        this._nativeRenderer.attach(video);
        for (const track of this._textTracks) this._addNativeTrack(track);
      }

      this._update();
    });
  }

  private _addNativeTrack(track: TextTrack) {
    if (!isTrackCaptionKind(track)) return;
    this._nativeRenderer?.addTrack(track);
  }

  private _removeNativeTrack(track: TextTrack) {
    if (!isTrackCaptionKind(track)) return;
    this._nativeRenderer?.removeTrack(track);
  }

  private _onAddTrack(event: TextTrackAddEvent) {
    this._addNativeTrack(event.detail);
  }

  private _onRemoveTrack(event: TextTrackRemoveEvent) {
    this._removeNativeTrack(event.detail);
  }

  private _update() {
    if (!this._video) {
      this._detach();
      return;
    }

    const currentTrack = this._textTracks.selected;

    // We identify text tracks that were embedded in HLS playlists and loaded natively (e.g., iOS
    // Safari) because we can't toggle mode to hidden and still get cue updates for some reason.
    // See `native-hls-text-tracks.ts` for discovery.
    if (this._nativeDisplay || currentTrack?.[TextTrackSymbol._nativeHLS]) {
      this._customRenderer?.changeTrack(null);
      this._nativeRenderer?.setDisplay(true);
      this._nativeRenderer?.changeTrack(currentTrack);
      return;
    }

    this._nativeRenderer?.setDisplay(false);
    this._nativeRenderer?.changeTrack(null);

    if (!currentTrack) {
      this._customRenderer?.changeTrack(null);
      return;
    }

    const customRenderer = this._renderers
      .sort((a, b) => a.priority - b.priority)
      .find((loader) => loader.canRender(currentTrack));

    if (this._customRenderer !== customRenderer) {
      this._customRenderer?.detach();
      customRenderer?.attach(this._video);
      this._customRenderer = customRenderer ?? null;
    }

    customRenderer?.changeTrack(currentTrack);
  }

  private _detach() {
    this._nativeRenderer?.detach();
    this._nativeRenderer = null;
    this._customRenderer?.detach();
    this._customRenderer = null;
  }
}

export interface TextRenderer {
  readonly priority: number;
  canRender(track: TextTrack): boolean;
  attach(video: HTMLVideoElement);
  detach(): void;
  changeTrack(track: TextTrack | null): void;
}
