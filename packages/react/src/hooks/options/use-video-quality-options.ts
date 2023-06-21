import { useReactContext, useSignal } from 'maverick.js/react';
import * as React from 'react';
import { mediaContext, type VideoQuality } from 'vidstack/lib';

export function useVideoQualityOptions({
  sort = 'descending',
}: UseVideoQualityOptions = {}): VideoQualityOptions {
  const media = useReactContext(mediaContext)!,
    { qualities, quality, autoQuality } = media.$state,
    $qualities = useSignal(qualities);

  useSignal(autoQuality);
  useSignal(quality);

  return React.useMemo(() => {
    const options = [...$qualities]
      .sort(sort === 'descending' ? sortDescending : sortAscending)
      .map<VideoQualityOption>((_quality) => {
        return {
          quality: _quality,
          label: _quality.height + 'p',
          value: getQualityValue(_quality),
          bitrateText: `${(_quality.bitrate / 1000000).toFixed(2)} Mbps`,
          get selected() {
            return _quality === quality();
          },
          get autoSelected() {
            return autoQuality();
          },
          select(trigger) {
            const index = qualities().indexOf(_quality);
            if (index >= 0) media.remote.changeQuality(index, trigger);
          },
        };
      });

    Object.defineProperty(options, 'selectedQuality', {
      get() {
        return quality();
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const $quality = quality();
        return $quality ? getQualityValue($quality) : undefined;
      },
    });

    return options as VideoQualityOptions;
  }, [$qualities, sort]);
}

export interface UseVideoQualityOptions {
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
  readonly selectedQuality: VideoQuality | null;
  readonly selectedValue: string | undefined;
};

export interface VideoQualityOption {
  readonly quality: VideoQuality;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  readonly autoSelected: boolean;
  readonly bitrateText: string;
  select(trigger?: Event): void;
}

function sortAscending(a: VideoQuality, b: VideoQuality) {
  return a.height === b.height ? a.bitrate - b.bitrate : a.height - b.height;
}

function sortDescending(a: VideoQuality, b: VideoQuality) {
  return b.height === a.height ? b.bitrate - a.bitrate : b.height - a.height;
}

function getQualityValue(quality: VideoQuality) {
  return quality.height + '_' + quality.bitrate;
}
