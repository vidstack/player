import type { Src } from '../../core/api/src-types';
import type { MediaStreamType } from '../../core/api/types';
import type { TextTrack } from '../../core/tracks/text/text-track';

export class GoogleCastMediaInfoBuilder {
  #info: chrome.cast.media.MediaInfo;

  constructor(src: Src<string>) {
    this.#info = new chrome.cast.media.MediaInfo(src.src, src.type);
  }

  build() {
    return this.#info;
  }

  setStreamType(streamType: MediaStreamType) {
    if (streamType.includes('live')) {
      this.#info.streamType = chrome.cast.media.StreamType.LIVE;
    } else {
      this.#info.streamType = chrome.cast.media.StreamType.BUFFERED;
    }

    return this;
  }

  setTracks(tracks: TextTrack[]) {
    this.#info.tracks = tracks.map(this.#buildCastTrack);
    return this;
  }

  setMetadata(title: string, poster: string) {
    this.#info.metadata = new chrome.cast.media.GenericMediaMetadata();
    this.#info.metadata.title = title;
    this.#info.metadata.images = [{ url: poster }];
    return this;
  }

  #buildCastTrack(track: TextTrack, trackId: number) {
    const castTrack = new chrome.cast.media.Track(trackId, chrome.cast.media.TrackType.TEXT);

    castTrack.name = track.label;
    castTrack.trackContentId = track.src!;
    castTrack.trackContentType = 'text/vtt';
    castTrack.language = track.language;
    castTrack.subtype = track.kind.toUpperCase() as any;

    return castTrack;
  }
}
