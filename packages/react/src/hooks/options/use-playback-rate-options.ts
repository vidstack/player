import { useReactContext, useSignal } from 'maverick.js/react';
import * as React from 'react';
import { mediaContext } from 'vidstack/lib';

const DEFAULT_RATES = [0.25, 0.5, 0.75, { label: 'Normal', rate: 1 }, 1.25, 1.5, 1.75, 2];

export function usePlaybackRateOptions({
  rates = DEFAULT_RATES,
}: UsePlaybackRateOptions = {}): PlaybackRateOptions {
  const media = useReactContext(mediaContext)!,
    { playbackRate } = media.$state;

  useSignal(playbackRate);

  return React.useMemo(() => {
    const options = rates.map<PlaybackRateOption>((opt) => {
      const label = typeof opt === 'number' ? opt + '' : opt.label,
        rate = typeof opt === 'number' ? opt : opt.rate;
      return {
        label,
        value: rate + '',
        rate,
        get selected() {
          return playbackRate() === rate;
        },
        select(trigger) {
          media.remote.changePlaybackRate(rate, trigger);
        },
      };
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        return playbackRate() + '';
      },
    });

    return options as PlaybackRateOptions;
  }, [rates]);
}

export interface UsePlaybackRateOptions {
  rates?: (number | { label: string; rate: number })[];
}

export type PlaybackRateOptions = PlaybackRateOption[] & {
  readonly selectedValue: string | undefined;
};

export interface PlaybackRateOption {
  readonly label: string;
  readonly value: string;
  readonly rate: number;
  readonly selected: boolean;
  select(trigger?: Event): void;
}
