import { effect, type ReadSignal } from 'maverick.js';

import type { MediaContext } from '../../core/api/media-context';
import { TextTrack, type TextTrackInit } from '../../core/tracks/text/text-track';

export class Tracks {
  private _prevTracks: (TextTrack | TextTrackInit)[] = [];

  constructor(
    private _domTracks: ReadSignal<TextTrackInit[]>,
    private _media: MediaContext,
  ) {
    effect(this._onTracksChange.bind(this));
  }

  private _onTracksChange() {
    const newTracks = this._domTracks();

    for (const oldTrack of this._prevTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && this._media.textTracks.getById(oldTrack.id);
        if (track) this._media.textTracks.remove(track);
      }
    }

    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!this._media.textTracks.getById(id)) {
        newTrack.id = id;
        this._media.textTracks.add(newTrack);
      }
    }

    this._prevTracks = newTracks;
  }
}
