import * as React from 'react';
import { useReactContext, useSignal } from 'maverick.js/react';
import { isTrackCaptionKind, mediaContext, type TextTrack } from 'vidstack/lib';

export function useCaptionOptions(): CaptionOptions {
  const media = useReactContext(mediaContext)!,
    { textTracks, textTrack } = media.$state,
    $textTracks = useSignal(textTracks);

  useSignal(textTrack);

  return React.useMemo(() => {
    const options = $textTracks.filter(isTrackCaptionKind).map<CaptionOption>((track) => ({
      track,
      label: track.label,
      value: getTrackValue(track),
      get selected() {
        return textTrack() === track;
      },
      select(trigger) {
        const index = textTracks().indexOf(track);
        if (index >= 0) media.remote.changeTextTrackMode(index, 'showing', trigger);
      },
    }));

    Object.defineProperty(options, 'selectedTrack', {
      get() {
        return textTrack();
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const track = textTrack();
        return track ? getTrackValue(track) : undefined;
      },
    });

    return options as CaptionOptions;
  }, [$textTracks]);
}

export type CaptionOptions = CaptionOption[] & {
  readonly selectedTrack: TextTrack | null;
  readonly selectedValue: string | undefined;
};

export interface CaptionOption {
  readonly track: TextTrack;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  select(trigger?: Event): void;
}

function getTrackValue(track: TextTrack) {
  return track.label.toLowerCase();
}
