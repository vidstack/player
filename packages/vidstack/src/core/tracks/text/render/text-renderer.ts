import { effect, onDispose, untrack } from 'maverick.js';
import { EventsController, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../../api/media-context';
import { TextTrackSymbol } from '../symbols';
import { isTrackCaptionKind, TextTrack } from '../text-track';
import type { TextTrackAddEvent, TextTrackList, TextTrackRemoveEvent } from '../text-tracks';
import { NativeTextRenderer } from './native-text-renderer';

export class TextRenderers {
  #video: HTMLVideoElement | null = null;
  #textTracks: TextTrackList;
  #renderers: TextRenderer[] = [];
  #media: MediaContext;

  #nativeDisplay = false;
  #nativeRenderer: NativeTextRenderer | null = null;
  #customRenderer: TextRenderer | null = null;

  constructor(media: MediaContext) {
    this.#media = media;

    const textTracks = media.textTracks;
    this.#textTracks = textTracks;

    effect(this.#watchControls.bind(this));

    onDispose(this.#detach.bind(this));

    new EventsController(textTracks)
      .add('add', this.#onAddTrack.bind(this))
      .add('remove', this.#onRemoveTrack.bind(this))
      .add('mode-change', this.#update.bind(this));
  }

  #watchControls() {
    const { nativeControls } = this.#media.$state;
    this.#nativeDisplay = nativeControls();
    this.#update();
  }

  add(renderer: TextRenderer) {
    this.#renderers.push(renderer);
    untrack(this.#update.bind(this));
  }

  remove(renderer: TextRenderer) {
    renderer.detach();
    this.#renderers.splice(this.#renderers.indexOf(renderer), 1);
    untrack(this.#update.bind(this));
  }

  /** @internal */
  attachVideo(video: HTMLVideoElement | null) {
    requestAnimationFrame(() => {
      this.#video = video;

      if (video) {
        this.#nativeRenderer = new NativeTextRenderer();
        this.#nativeRenderer.attach(video);
        for (const track of this.#textTracks) this.#addNativeTrack(track);
      }

      this.#update();
    });
  }

  #addNativeTrack(track: TextTrack) {
    if (!isTrackCaptionKind(track)) return;
    this.#nativeRenderer?.addTrack(track);
  }

  #removeNativeTrack(track: TextTrack) {
    if (!isTrackCaptionKind(track)) return;
    this.#nativeRenderer?.removeTrack(track);
  }

  #onAddTrack(event: TextTrackAddEvent) {
    this.#addNativeTrack(event.detail);
  }

  #onRemoveTrack(event: TextTrackRemoveEvent) {
    this.#removeNativeTrack(event.detail);
  }

  #update() {
    const currentTrack = this.#textTracks.selected;

    // We identify text tracks that were embedded in HLS playlists and loaded natively (e.g., iOS
    // Safari) because we can't toggle mode to hidden and still get cue updates for some reason.
    // See `native-hls-text-tracks.ts` for discovery.
    if (this.#video && (this.#nativeDisplay || currentTrack?.[TextTrackSymbol.nativeHLS])) {
      this.#customRenderer?.changeTrack(null);
      this.#nativeRenderer?.setDisplay(true);
      this.#nativeRenderer?.changeTrack(currentTrack);
      return;
    }

    this.#nativeRenderer?.setDisplay(false);
    this.#nativeRenderer?.changeTrack(null);

    if (!currentTrack) {
      this.#customRenderer?.changeTrack(null);
      return;
    }

    const customRenderer = this.#renderers
      .sort((a, b) => a.priority - b.priority)
      .find((renderer) => renderer.canRender(currentTrack, this.#video));

    if (this.#customRenderer !== customRenderer) {
      this.#customRenderer?.detach();
      customRenderer?.attach(this.#video);
      this.#customRenderer = customRenderer ?? null;
    }

    customRenderer?.changeTrack(currentTrack);
  }

  #detach() {
    this.#nativeRenderer?.detach();
    this.#nativeRenderer = null;
    this.#customRenderer?.detach();
    this.#customRenderer = null;
  }
}

export interface TextRenderer {
  readonly priority: number;
  canRender(track: TextTrack, video: HTMLVideoElement | null): boolean;
  attach(video: HTMLVideoElement | null);
  detach(): void;
  changeTrack(track: TextTrack | null): void;
}
