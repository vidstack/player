import { createDisposalBin, listenEvent } from 'maverick.js/std';
import type { CaptionsRenderer } from 'media-captions';

import type { TextRenderer } from '../../../core/tracks/text/render/text-renderer';
import type { TextTrack } from '../../../core/tracks/text/text-track';

export class CaptionsTextRenderer implements TextRenderer {
  readonly priority = 10;

  #track: TextTrack | null = null;
  #disposal = createDisposalBin();
  #renderer: CaptionsRenderer;

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
    this.#disposal.empty();
    this.#renderer.reset();
    this.#track = null;
  }

  changeTrack(track: TextTrack | null): void {
    if (!track || this.#track === track) return;

    this.#disposal.empty();

    if (track.readyState < 2) {
      this.#renderer.reset();
      this.#disposal.add(
        listenEvent(track, 'load', () => this.#changeTrack(track), { once: true }),
      );
    } else {
      this.#changeTrack(track);
    }

    this.#disposal.add(
      listenEvent(track, 'add-cue', (event) => {
        this.#renderer.addCue(event.detail);
      }),
      listenEvent(track, 'remove-cue', (event) => {
        this.#renderer.removeCue(event.detail);
      }),
    );

    this.#track = track;
  }

  #changeTrack(track: TextTrack) {
    this.#renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions],
    });
  }
}
