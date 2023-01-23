import { useReactContext } from 'maverick.js/react';
import { useEffect, useState } from 'react';
import { mediaContext, MediaElement } from 'vidstack';

/**
 * Returns the nearest parent media element (i.e., `<vds-media>`).
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#media-element}
 */
export function useMediaElement(): MediaElement | null {
  const [element, setElement] = useState<MediaElement | null>(null),
    context = useReactContext(mediaContext);

  if (__DEV__ && !context) {
    throw Error('[vidstack] no media context was found - did you forget to provide it?');
  }

  useEffect(() => {
    if (!context) return;
    const media = context.$element()!;
    media.onAttach(() => void setElement(media));
    return () => setElement(null);
  }, []);

  return element;
}
