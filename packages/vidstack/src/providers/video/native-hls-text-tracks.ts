import { onDispose } from 'maverick.js';

import { TextTrackSymbol } from '../../core/tracks/text/symbols';
import { TextTrack as VdsTextTrack } from '../../core/tracks/text/text-track';
import type { MediaSetupContext } from '../types';

/**
 * This is used to discover text tracks that were found by the native playback engine. For example,
 * Safari will load text tracks that were embedded in the HLS playlist.
 */
export class NativeHLSTextTracks {
  constructor(
    private _video: HTMLVideoElement,
    private _ctx: MediaSetupContext,
  ) {
    _video.textTracks.onaddtrack = this._onAddTrack.bind(this);
    onDispose(this._onDispose.bind(this));
  }

  private _onAddTrack(event: TrackEvent) {
    const nativeTrack = event.track;

    // Skip tracks the `NativeTextRenderer` has added.
    if (!nativeTrack || findTextTrackElement(this._video, nativeTrack)) return;

    const track = new VdsTextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label,
      language: nativeTrack.language,
      type: 'vtt',
    });

    track[TextTrackSymbol._native] = { track: nativeTrack };
    track[TextTrackSymbol._readyState] = 2;
    track[TextTrackSymbol._nativeHLS] = true;

    let lastIndex = 0;
    const onCueChange = (event: Event) => {
      if (!nativeTrack.cues) return;
      for (let i = lastIndex; i < nativeTrack.cues.length; i++) {
        track.addCue(nativeTrack.cues[i] as VTTCue, event);
        lastIndex++;
      }
    };

    onCueChange(event);
    nativeTrack.oncuechange = onCueChange;

    this._ctx.textTracks.add(track, event);
    track.setMode(nativeTrack.mode, event);
  }

  private _onDispose() {
    this._video.textTracks.onaddtrack = null;
    for (const track of this._ctx.textTracks) {
      const nativeTrack = track[TextTrackSymbol._native]?.track as TextTrack | undefined;
      if (nativeTrack?.oncuechange) nativeTrack.oncuechange = null;
    }
  }
}

function findTextTrackElement(video: HTMLVideoElement, track) {
  return Array.from(video.children).find((el) => (el as HTMLTrackElement).track === track);
}
