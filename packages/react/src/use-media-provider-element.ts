import { effect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import { useEffect, useState } from 'react';
import { mediaContext, MediaProviderElement } from 'vidstack';

/**
 * Returns the nearest parent media provider element (e.g., `<vds-video>` or `<vds-hls-video>`).
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#media-provider}
 */
export function useMediaProviderElement(): MediaProviderElement | null {
  const [element, setElement] = useState<MediaProviderElement | null>(null),
    context = useReactContext(mediaContext);

  if (__DEV__ && !context) {
    throw Error('[vidstack] no media context was found - did you forget to provide it?');
  }

  useEffect(() => {
    if (!context) return;
    return effect(() => {
      const provider = context.$provider()!;
      provider?.onAttach(() => void setElement(provider));
    });
  }, []);

  return element;
}
