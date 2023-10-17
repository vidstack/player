import * as React from 'react';

import { effect, type StopEffect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import type { VTTCue } from 'media-captions';
import { formatSpokenTime, formatTime, mediaContext } from 'vidstack';

import { useActiveTextCues } from '../use-active-text-cues';
import { useActiveTextTrack } from '../use-active-text-track';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-chapter-options}
 */
export function useChapterOptions(): ChapterOptions {
  const media = useReactContext(mediaContext)!,
    track = useActiveTextTrack('chapters');

  useActiveTextCues(track);

  return React.useMemo(() => {
    const options = track
      ? track.cues.map<ChapterOption>((cue, i) => {
          let currentRef: HTMLElement | null = null,
            stopProgressEffect: StopEffect | undefined;
          return {
            cue,
            label: cue.text,
            value: i + '',
            startTimeText: formatTime(cue.startTime, false),
            durationText: formatSpokenTime(cue.endTime - cue.startTime),
            get selected() {
              return cue === track.activeCues[0];
            },
            setProgressVar(ref) {
              if (!ref || cue !== track.activeCues[0]) {
                stopProgressEffect?.();
                stopProgressEffect = undefined;
                ref?.style.setProperty('--progress', '0%');
                currentRef = null;
                return;
              }

              if (currentRef === ref) return;
              currentRef = ref;

              stopProgressEffect?.();
              stopProgressEffect = effect(() => {
                const { currentTime } = media.$state,
                  time = currentTime(),
                  progress =
                    Math.min((time - cue.startTime) / (cue.endTime - cue.startTime), 1) * 100;
                ref.style.setProperty('--progress', progress.toFixed(3) + '%');
              });
            },
            select(trigger) {
              media.remote.seek(cue.startTime, trigger);
            },
          };
        })
      : [];

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const index = options.findIndex((option) => option.selected);
        return (index >= 0 ? index : 0) + '';
      },
    });

    return options as ChapterOptions;
  }, [track]);
}

export type ChapterOptions = ChapterOption[] & {
  readonly selectedValue: string | undefined;
};

export interface ChapterOption {
  readonly cue: VTTCue;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  readonly startTimeText: string;
  readonly durationText: string;
  select(trigger?: Event): void;
  setProgressVar(ref: HTMLElement | null): void;
}
