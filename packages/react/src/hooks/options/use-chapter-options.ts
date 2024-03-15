import * as React from 'react';

import { effect, type StopEffect } from 'maverick.js';
import { useSignal } from 'maverick.js/react';
import type { VTTCue } from 'media-captions';
import { formatSpokenTime, formatTime } from 'vidstack';

import { useActiveTextCues } from '../use-active-text-cues';
import { useActiveTextTrack } from '../use-active-text-track';
import { useMediaContext } from '../use-media-context';
import { useTextCues } from '../use-text-cues';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-chapter-options}
 */
export function useChapterOptions(): ChapterOptions {
  const media = useMediaContext(),
    track = useActiveTextTrack('chapters'),
    cues = useTextCues(track),
    $startTime = useSignal(media.$state.clipStartTime),
    $endTime = useSignal(media.$state.clipEndTime) || Infinity;

  useActiveTextCues(track);

  return React.useMemo(() => {
    const options = track
      ? cues
          .filter((cue) => cue.startTime <= $endTime && cue.endTime >= $startTime)
          .map<ChapterOption>((cue, i) => {
            let currentRef: HTMLElement | null = null,
              stopProgressEffect: StopEffect | undefined;
            return {
              cue,
              label: cue.text,
              value: i.toString(),
              startTimeText: formatTime(Math.max(0, cue.startTime - $startTime)),
              durationText: formatSpokenTime(
                Math.min($endTime, cue.endTime) - Math.max($startTime, cue.startTime),
              ),
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
                  const { realCurrentTime } = media.$state,
                    time = realCurrentTime(),
                    cueStartTime = Math.max($startTime, cue.startTime),
                    duration = Math.min($endTime, cue.endTime) - cueStartTime,
                    progress = (Math.max(0, time - cueStartTime) / duration) * 100;

                  ref.style.setProperty('--progress', progress.toFixed(3) + '%');
                });
              },
              select(trigger) {
                media.remote.seek(cue.startTime - $startTime, trigger);
              },
            };
          })
      : [];

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const index = options.findIndex((option) => option.selected);
        return (index >= 0 ? index : 0).toString();
      },
    });

    return options as ChapterOptions;
  }, [cues, $startTime, $endTime]);
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
