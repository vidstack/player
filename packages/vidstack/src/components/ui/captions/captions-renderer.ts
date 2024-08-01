import { EventsController } from 'maverick.js/std';
import type { CaptionsRenderer } from 'media-captions';

import type { TextRenderer } from '../../../core/tracks/text/render/text-renderer';
import type { TextTrack } from '../../../core/tracks/text/text-track';

export class CaptionsTextRenderer implements TextRenderer {
  readonly priority = 10;

  #track: TextTrack | null = null;
  #renderer: CaptionsRenderer;
  #events?: EventsController<TextTrack>;

  constructor(renderer: CaptionsRenderer) {
    this.#renderer = renderer;
  }

  attach() {
    // no-op
  }

  canRender(): boolean {
    return true;
  }

  detach(): void {
    this.#events?.abort();
    this.#events = undefined;
    this.#renderer.reset();
    this.#track = null;
  }

  changeTrack(track: TextTrack | null): void {
    if (!track || this.#track === track) return;

    this.#events?.abort();
    this.#events = new EventsController(track);

    if (track.readyState < 2) {
      this.#renderer.reset();
      this.#events.add('load', () => this.#changeTrack(track), { once: true });
    } else {
      this.#changeTrack(track);
    }

    this.#events
      .add('add-cue', (event) => {
        this.#renderer.addCue(event.detail);
      })
      .add('remove-cue', (event) => {
        this.#renderer.removeCue(event.detail);
      });

    this.#track = track;
  }

  #changeTrack(track: TextTrack) {
    this.#renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions],
    });
  }
}
