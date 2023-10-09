import * as React from 'react';

import { useReactContext, useSignal } from 'maverick.js/react';
import { isString } from 'maverick.js/std';
import { isTrackCaptionKind, mediaContext, type TextTrack } from 'vidstack';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-caption-options}
 */
export function useCaptionOptions({ off = true }: UseCaptionOptions = {}): CaptionOptions {
  const media = useReactContext(mediaContext)!,
    { textTracks, textTrack } = media.$state,
    $textTracks = useSignal(textTracks);

  useSignal(textTrack);

  return React.useMemo(() => {
    const captionTracks = $textTracks.filter(isTrackCaptionKind),
      options = captionTracks.map<CaptionOption>((track) => ({
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

    if (off) {
      options.unshift({
        track: null,
        label: isString(off) ? off : 'Off',
        value: 'off',
        get selected() {
          return !textTrack();
        },
        select(trigger) {
          media.remote.toggleCaptions(trigger);
        },
      });
    }

    Object.defineProperty(options, 'disabled', {
      get() {
        return !captionTracks.length;
      },
    });

    Object.defineProperty(options, 'selectedTrack', {
      get() {
        return textTrack();
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const track = textTrack();
        return track ? getTrackValue(track) : 'off';
      },
    });

    return options as CaptionOptions;
  }, [$textTracks]);
}

export interface UseCaptionOptions {
  /**
   * Whether an option should be included for turning off all captions. A string can be provided
   * to specify the label.
   */
  off?: boolean | string;
}

export type CaptionOptions = CaptionOption[] & {
  readonly disabled: boolean;
  readonly selectedTrack: TextTrack | null;
  readonly selectedValue: string;
};

export interface CaptionOption {
  readonly track: TextTrack | null;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  select(trigger?: Event): void;
}

function getTrackValue(track: TextTrack) {
  return track.label.toLowerCase();
}
