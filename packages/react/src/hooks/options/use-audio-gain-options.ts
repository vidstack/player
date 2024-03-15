import * as React from 'react';

import { useSignal } from 'maverick.js/react';
import { DEFAULT_AUDIO_GAINS } from 'vidstack';

import { useMediaContext } from '../use-media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-audio-gain-options}
 */
export function useAudioGainOptions({
  gains = DEFAULT_AUDIO_GAINS,
  disabledLabel = 'disabled',
}: UseAudioGainOptions = {}): AudioGainOptions {
  const media = useMediaContext(),
    { audioGain, canSetAudioGain } = media.$state;

  useSignal(audioGain);
  useSignal(canSetAudioGain);

  return React.useMemo(() => {
    const options = gains.map<AudioGainOption>((opt) => {
      const label =
          typeof opt === 'number'
            ? opt === 1 && disabledLabel
              ? disabledLabel
              : opt * 100 + '%'
            : opt.label,
        gain = typeof opt === 'number' ? opt : opt.gain;
      return {
        label,
        value: gain.toString(),
        gain,
        get selected() {
          return audioGain() === gain;
        },
        select(trigger) {
          media.remote.changeAudioGain(gain, trigger);
        },
      };
    });

    Object.defineProperty(options, 'disabled', {
      get() {
        return !canSetAudioGain() || !options.length;
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        return audioGain()?.toString();
      },
    });

    return options as AudioGainOptions;
  }, [gains]);
}

export interface UseAudioGainOptions {
  gains?: (number | { label: string; gain: number })[];
  disabledLabel?: string | null;
}

export type AudioGainOptions = AudioGainOption[] & {
  readonly disabled: boolean;
  readonly selectedValue: string | undefined;
};

export interface AudioGainOption {
  readonly label: string;
  readonly value: string;
  readonly gain: number;
  readonly selected: boolean;
  select(trigger?: Event): void;
}
