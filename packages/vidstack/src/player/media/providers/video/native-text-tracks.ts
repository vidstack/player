import { onDispose } from 'maverick.js';
import { createDisposalBin } from 'maverick.js/std';

import { TEXT_TRACK_PROXY, TEXT_TRACK_READY_STATE } from '../../tracks/text/symbols';
import { TextTrack as VdsTextTrack } from '../../tracks/text/text-track';
import type { MediaSetupContext } from '../types';

/**
 * This is used to discover text tracks that were found by the native playback engine. For example,
 * Safari will load text tracks that were embedded in the HLS playlist.
 */
export function discoverNativeTextTracks(video: HTMLVideoElement, context: MediaSetupContext) {
  const disposal = createDisposalBin();

  const onAddTrack = (nativeTrack: TextTrack, event?: Event) => {
    // Skip tracks the `NativeTextRenderer` has added.
    if (findTextTrackElement(video, nativeTrack)) return;

    const track = new VdsTextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label,
      language: nativeTrack.language,
      type: 'vtt',
    });

    track[TEXT_TRACK_PROXY] = { track: nativeTrack };
    track[TEXT_TRACK_READY_STATE] = 2;

    let lastIndex = 0;
    nativeTrack.oncuechange = (event) => {
      for (let i = lastIndex; i < nativeTrack.cues!.length; i++) {
        track.addCue(nativeTrack.cues![i] as VTTCue, event);
        lastIndex++;
      }
    };

    disposal.add(() => (nativeTrack.oncuechange = null));
    context.textTracks.add(track, event);
    track.mode = nativeTrack.mode;
  };

  video.textTracks.onaddtrack = (event) => event.track && onAddTrack(event.track, event);

  onDispose(() => {
    video.textTracks.onaddtrack = null;
    disposal.empty();
  });
}

function findTextTrackElement(video: HTMLVideoElement, track) {
  return Array.from(video.children).find((el) => (el as HTMLTrackElement).track === track);
}
