import { effect, type ReadSignal } from 'maverick.js';

import type { MediaContext } from '../api/context';
import { TextTrack, type TextTrackInit } from '../tracks/text/text-track';

export class Tracks {
  private _prevTracks: (TextTrack | TextTrackInit)[] = [];

  constructor(private _domTracks: ReadSignal<TextTrackInit[]>, private _media: MediaContext) {
    effect(this._onTracksChange.bind(this));
  }

  private _onTracksChange() {
    const newTracks = [...this._media.$props.textTracks(), ...this._domTracks()];

    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!this._media.textTracks.getById(id)) {
        // @ts-expect-error - override readonly
        newTrack.id = id;
        this._media.textTracks.add(newTrack);
      }
    }

    for (const oldTrack of this._prevTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && this._media.textTracks.getById(oldTrack.id);
        if (track) this._media.textTracks.remove(track);
      }
    }

    this._prevTracks = newTracks;
  }
}
