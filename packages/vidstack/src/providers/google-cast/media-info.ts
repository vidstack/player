import type { Src } from '../../core/api/src-types';
import type { MediaStreamType } from '../../core/api/types';
import type { TextTrack } from '../../core/tracks/text/text-track';

export class GoogleCastMediaInfoBuilder {
  protected _info: chrome.cast.media.MediaInfo;

  constructor(src: Src<string>) {
    this._info = new chrome.cast.media.MediaInfo(src.src, src.type);
  }

  build() {
    return this._info;
  }

  _setStreamType(streamType: MediaStreamType) {
    if (streamType.includes('live')) {
      this._info.streamType = chrome.cast.media.StreamType.LIVE;
    } else {
      this._info.streamType = chrome.cast.media.StreamType.BUFFERED;
    }

    return this;
  }

  _setTracks(tracks: TextTrack[]) {
    this._info.tracks = tracks.map(this._buildCastTrack);
    return this;
  }

  _setMetadata(title: string, poster: string) {
    this._info.metadata = new chrome.cast.media.GenericMediaMetadata();
    this._info.metadata.title = title;
    this._info.metadata.images = [{ url: poster }];
    return this;
  }

  protected _buildCastTrack(track: TextTrack, trackId: number) {
    const castTrack = new chrome.cast.media.Track(trackId, chrome.cast.media.TrackType.TEXT);

    castTrack.name = track.label;
    castTrack.trackContentId = track.src!;
    castTrack.trackContentType = 'text/vtt';
    castTrack.language = track.language;
    castTrack.subtype = track.kind.toUpperCase() as any;

    return castTrack;
  }
}
