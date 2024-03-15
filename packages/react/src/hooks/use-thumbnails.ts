import * as React from 'react';

import { useReactScope, useSignal } from 'maverick.js/react';
import {
  ThumbnailsLoader,
  type MediaCrossOrigin,
  type ThumbnailImage,
  type ThumbnailSrc,
} from 'vidstack';

import { createSignal, useScoped } from './use-signals';

/**
 * The function will return the resolved thumbnail images given a thumbnail resource. It's safe to
 * call this hook in multiple places with the same `src` argument as work is de-duped and cached
 * internally.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-thumbnails}
 */
export function useThumbnails(
  src: ThumbnailSrc,
  crossOrigin: MediaCrossOrigin | null = null,
): ThumbnailImage[] {
  const scope = useReactScope(),
    $src = createSignal(src),
    $crossOrigin = createSignal(crossOrigin),
    loader = useScoped(() => ThumbnailsLoader.create($src, $crossOrigin));

  if (__DEV__ && !scope) {
    console.warn(
      `[vidstack] \`useThumbnails\` must be called inside a child component of \`<MediaPlayer>\``,
    );
  }

  React.useEffect(() => {
    $src.set(src);
  }, [src]);

  React.useEffect(() => {
    $crossOrigin.set(crossOrigin);
  }, [crossOrigin]);

  return useSignal(loader.$images);
}

/**
 * Returns the active thumbnail image based on the given time.
 *
 * @param thumbnails - thumbnail images.
 * @param time - the current time to determine which thumbnail is active.
 */
export function useActiveThumbnail(
  thumbnails: ThumbnailImage[],
  time: number,
): ThumbnailImage | null {
  return React.useMemo(() => {
    let activeIndex = -1;

    for (let i = thumbnails.length - 1; i >= 0; i--) {
      const image = thumbnails[i];
      if (time >= image.startTime && (!image.endTime || time < image.endTime)) {
        activeIndex = i;
        break;
      }
    }

    return thumbnails[activeIndex] || null;
  }, [thumbnails, time]);
}
