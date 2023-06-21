import { createDisposalBin, listenEvent } from 'maverick.js/std';
import type { CaptionsRenderer } from 'media-captions';

import type { TextRenderer, TextTrack } from '../../../core';

export class CaptionsTextRenderer implements TextRenderer {
  readonly priority = 10;

  private _track: TextTrack | null = null;
  private _disposal = createDisposalBin();

  constructor(private _renderer: CaptionsRenderer) {}

  attach() {
    // no-op
  }

  canRender(): boolean {
    return true;
  }

  detach(): void {
    this._disposal.empty();
    this._renderer.reset();
    this._track = null;
  }

  changeTrack(track: TextTrack | null): void {
    if (!track || this._track === track) return;

    this._disposal.empty();

    if (track.readyState < 2) {
      this._renderer.reset();
      this._disposal.add(
        listenEvent(track, 'load', () => this._changeTrack(track), { once: true }),
      );
    } else {
      this._changeTrack(track);
    }

    this._disposal.add(
      listenEvent(track, 'add-cue', (event) => {
        this._renderer.addCue(event.detail);
      }),
      listenEvent(track, 'remove-cue', (event) => {
        this._renderer.removeCue(event.detail);
      }),
    );

    this._track = track;
  }

  private _changeTrack(track: TextTrack) {
    this._renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions],
    });
  }
}
