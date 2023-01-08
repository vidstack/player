import { useReactContext } from 'maverick.js/react';
import { useEffect, useState } from 'react';
import { MediaElement, MediaElementContext } from 'vidstack';

/**
 * Returns the nearest parent media element (i.e., `<vds-media>`). This hook can only be used
 * inside a child of the `<Media>` component.
 */
export function useMediaElement(): MediaElement | null {
  const [element, setElement] = useState<MediaElement | null>(null),
    $mediaElement = useReactContext(MediaElementContext);

  if (__DEV__ && !$mediaElement) {
    console.warn(
      '[vidstack] `useMediaElement` can only be called inside a child component of `<Media>`.',
    );
  }

  useEffect(() => {
    if ($mediaElement) setElement($mediaElement());
  }, []);

  return element;
}
