import type { ReadSignal } from 'maverick.js';
import { mergeProperties } from 'maverick.js/std';

import { useHTMLMediaElement, UseHTMLMediaElementProps } from '../html/use-element';
import { useVideoPresentation } from './presentation/use-video-presentation';
import type { VideoElement } from './types';

export function useVideoElement(
  $target: ReadSignal<VideoElement | null>,
  props: UseHTMLMediaElementProps = {},
) {
  const { members, delegate } = useHTMLMediaElement($target, props);

  const videoAdapter = mergeProperties(members.adapter, {
    fullscreen: useVideoPresentation($target, delegate),
  });

  return {
    members: mergeProperties(members, {
      get adapter() {
        return videoAdapter;
      },
    }),
    delegate,
  };
}
