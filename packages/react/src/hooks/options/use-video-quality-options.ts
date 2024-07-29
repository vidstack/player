import * as React from 'react';

import { useSignal } from 'maverick.js/react';
import { isString } from 'maverick.js/std';
import { sortVideoQualities, type VideoQuality } from 'vidstack';

import { useMediaContext } from '../use-media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-video-quality-options}
 */
export function useVideoQualityOptions({
  auto = true,
  sort = 'descending',
}: UseVideoQualityOptions = {}): VideoQualityOptions {
  const media = useMediaContext(),
    { qualities, quality, autoQuality, canSetQuality } = media.$state,
    $qualities = useSignal(qualities);

  // Trigger updates.
  useSignal(quality);
  useSignal(autoQuality);
  useSignal(canSetQuality);

  return React.useMemo(() => {
    const sortedQualities = sortVideoQualities($qualities, sort === 'descending'),
      options = sortedQualities.map<VideoQualityOption>((q) => {
        return {
          quality: q,
          label: q.height + 'p',
          value: getQualityValue(q),
          bitrateText:
            q.bitrate && q.bitrate > 0 ? `${(q.bitrate / 1000000).toFixed(2)} Mbps` : null,
          get selected() {
            return q === quality();
          },
          get autoSelected() {
            return autoQuality();
          },
          select(trigger) {
            const index = qualities().indexOf(q);
            if (index >= 0) media.remote.changeQuality(index, trigger);
          },
        };
      });

    if (auto) {
      options.unshift({
        quality: null,
        label: isString(auto) ? auto : 'Auto',
        value: 'auto',
        bitrateText: null,
        get selected() {
          return autoQuality();
        },
        get autoSelected() {
          return autoQuality();
        },
        select(trigger) {
          media.remote.requestAutoQuality(trigger);
        },
      });
    }

    Object.defineProperty(options, 'disabled', {
      get() {
        return !canSetQuality() || $qualities.length <= 1;
      },
    });

    Object.defineProperty(options, 'selectedQuality', {
      get() {
        return quality();
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const $quality = quality();
        return !autoQuality() && $quality ? getQualityValue($quality) : 'auto';
      },
    });

    return options as VideoQualityOptions;
  }, [$qualities, sort]);
}

export interface UseVideoQualityOptions {
  /**
   * Whether an auto option should be included. A string can be provided to specify the label.
   */
  auto?: boolean | string;
  /**
   * Specifies how the options should be sorted. The sorting algorithm looks at both the quality
   * resolution and bitrate.
   *
   * - Ascending: 480p, 720p, 720p (higher bitrate), 1080p
   * - Descending: 1080p, 720p (higher bitrate), 720p, 480p
   *
   * @default 'descending'
   */
  sort?: 'ascending' | 'descending';
}

export type VideoQualityOptions = VideoQualityOption[] & {
  readonly disabled: boolean;
  readonly selectedQuality: VideoQuality | null;
  readonly selectedValue: string;
};

export interface VideoQualityOption {
  readonly quality: VideoQuality | null;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  readonly autoSelected: boolean;
  readonly bitrateText: string | null;
  select(trigger?: Event): void;
}

function getQualityValue(quality: VideoQuality) {
  return quality.height + '_' + quality.bitrate;
}
