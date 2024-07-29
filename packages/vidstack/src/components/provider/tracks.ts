import { effect, type ReadSignal } from 'maverick.js';

import type { MediaContext } from '../../core/api/media-context';
import { TextTrack, type TextTrackInit } from '../../core/tracks/text/text-track';

export class Tracks {
  #domTracks: ReadSignal<TextTrackInit[]>;
  #media: MediaContext;
  #prevTracks: (TextTrack | TextTrackInit)[] = [];

  constructor(domTracks: ReadSignal<TextTrackInit[]>, media: MediaContext) {
    this.#domTracks = domTracks;
    this.#media = media;
    effect(this.#onTracksChange.bind(this));
  }

  #onTracksChange() {
    const newTracks = this.#domTracks();

    for (const oldTrack of this.#prevTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && this.#media.textTracks.getById(oldTrack.id);
        if (track) this.#media.textTracks.remove(track);
      }
    }

    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!this.#media.textTracks.getById(id)) {
        newTrack.id = id;
        this.#media.textTracks.add(newTrack);
      }
    }

    this.#prevTracks = newTracks;
  }
}
