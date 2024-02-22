import * as React from 'react';

import { useSignal } from 'maverick.js/react';
import { DEFAULT_PLAYBACK_RATES } from 'vidstack';

import { useMediaContext } from '../use-media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-playback-rate-options}
 */
export function usePlaybackRateOptions({
  rates = DEFAULT_PLAYBACK_RATES,
  normalLabel = 'Normal',
}: UsePlaybackRateOptions = {}): PlaybackRateOptions {
  const media = useMediaContext(),
    { playbackRate, canSetPlaybackRate } = media.$state;

  useSignal(playbackRate);
  useSignal(canSetPlaybackRate);

  return React.useMemo(() => {
    const options = rates.map<PlaybackRateOption>((opt) => {
      const label =
          typeof opt === 'number'
            ? opt === 1 && normalLabel
              ? normalLabel
              : opt + 'x'
            : opt.label,
        rate = typeof opt === 'number' ? opt : opt.rate;
      return {
        label,
        value: rate.toString(),
        rate,
        get selected() {
          return playbackRate() === rate;
        },
        select(trigger) {
          media.remote.changePlaybackRate(rate, trigger);
        },
      };
    });

    Object.defineProperty(options, 'disabled', {
      get() {
        return !canSetPlaybackRate() || !options.length;
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        return playbackRate().toString();
      },
    });

    return options as PlaybackRateOptions;
  }, [rates]);
}

export interface UsePlaybackRateOptions {
  rates?: (number | { label: string; rate: number })[];
  normalLabel?: string | null;
}

export type PlaybackRateOptions = PlaybackRateOption[] & {
  readonly disabled: boolean;
  readonly selectedValue: string | undefined;
};

export interface PlaybackRateOption {
  readonly label: string;
  readonly value: string;
  readonly rate: number;
  readonly selected: boolean;
  select(trigger?: Event): void;
}
