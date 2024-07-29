import { onDispose } from 'maverick.js';

import type { MediaContext } from '../../core/api/media-context';
import { TextTrackSymbol } from '../../core/tracks/text/symbols';
import { TextTrack as VdsTextTrack } from '../../core/tracks/text/text-track';

/**
 * This is used to discover text tracks that were found by the native playback engine. For example,
 * Safari will load text tracks that were embedded in the HLS playlist.
 */
export class NativeHLSTextTracks {
  readonly #video: HTMLVideoElement;
  readonly #ctx: MediaContext;

  constructor(video: HTMLVideoElement, ctx: MediaContext) {
    this.#video = video;
    this.#ctx = ctx;

    video.textTracks.onaddtrack = this.#onAddTrack.bind(this);

    onDispose(this.#onDispose.bind(this));
  }

  #onAddTrack(event: TrackEvent) {
    const nativeTrack = event.track;

    // Skip tracks the `NativeTextRenderer` has added.
    if (!nativeTrack || findTextTrackElement(this.#video, nativeTrack)) return;

    const track = new VdsTextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label ?? '',
      language: nativeTrack.language,
      type: 'vtt',
    });

    track[TextTrackSymbol.native] = { track: nativeTrack };
    track[TextTrackSymbol.readyState] = 2;
    track[TextTrackSymbol.nativeHLS] = true;

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

    this.#ctx.textTracks.add(track, event);
    track.setMode(nativeTrack.mode, event);
  }

  #onDispose() {
    this.#video.textTracks.onaddtrack = null;
    for (const track of this.#ctx.textTracks) {
      const nativeTrack = track[TextTrackSymbol.native]?.track as TextTrack | undefined;
      if (nativeTrack?.oncuechange) nativeTrack.oncuechange = null;
    }
  }
}

function findTextTrackElement(video: HTMLVideoElement, track) {
  return Array.from(video.children).find((el) => (el as HTMLTrackElement).track === track);
}
