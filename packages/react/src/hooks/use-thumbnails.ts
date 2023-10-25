import * as React from 'react';

import { scoped, signal } from 'maverick.js';
import { useReactScope, useSignal } from 'maverick.js/react';
import type { VTTCue } from 'media-captions';
import { findActiveCue, ThumbnailsLoader } from 'vidstack';

export interface ThumbnailData {
  url: string;
  cue: VTTCue;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Fetches and parses a WebVTT file. The function will return the parsed thumbnail
 * data such as the VTTCue, coordinates, dimensions, and url. It's safe to call this hook in
 * multiple places with the same `src` argument as work is de-duped and cached.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-thumbnails}
 */
export function useThumbnails(src: string): ThumbnailData[] {
  const scope = useReactScope(),
    $src = React.useMemo(() => signal(src), []),
    loader = React.useMemo(() => scoped(() => ThumbnailsLoader.create($src), scope)!, []),
    $cues = useSignal(loader.$cues),
    data = React.useMemo(() => {
      const items: ThumbnailData[] = [],
        baseURL = /^https?:/.test(src) || __SERVER__ ? src : location.href;

      for (const cue of $cues) {
        const [url, dataText = ''] = (cue.text || '').split('#'),
          data = resolveThumbnailData(dataText);
        items.push({
          url: resolveThumbnailSrc(url, baseURL),
          cue,
          x: data.x ?? -1,
          y: data.y ?? -1,
          width: data.width ?? -1,
          height: data.height ?? -1,
        });
      }

      return items;
    }, [$cues]);

  if (__DEV__ && !scope) {
    console.warn(
      `[vidstack] \`useThumbnails\` must be called inside a child component of \`<MediaPlayer>\``,
    );
  }

  React.useEffect(() => {
    $src.set(src);
  }, [src]);

  return data;
}

/**
 * Returns the active thumbnail based on the given time.
 *
 * @param thumbnails - thumbnail data returned from called `useThumbnails("...")`.
 * @param time - the current time to determine which thumbnail is active.
 */
export function useActiveThumbnail(
  thumbnails: ThumbnailData[],
  time: number,
): ThumbnailData | null {
  const cues = React.useMemo(() => thumbnails.map((t) => t.cue), [thumbnails]);
  return React.useMemo(() => {
    const cue = findActiveCue(cues, time);
    return thumbnails.find((t) => t.cue === cue) || null;
  }, [thumbnails, cues, time]);
}

function resolveThumbnailSrc(src: string, baseURL: string) {
  return /^https?:/.test(src) ? src : new URL(src, baseURL).href;
}

const propNames = {
  x: 'x',
  y: 'y',
  w: 'width',
  h: 'height',
};

function resolveThumbnailData(data: string) {
  const [props, values] = data.split('='),
    resolvedData: Record<string, number> = {},
    dataValues = values?.split(',');

  if (!props || !values) return {};

  for (let i = 0; i < props.length; i++) {
    resolvedData[propNames[props[i]]] = +dataValues[i];
  }

  return resolvedData;
}
