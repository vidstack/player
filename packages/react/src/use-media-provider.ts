import { effect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import { useEffect, useState } from 'react';
import { mediaContext, MediaProvider } from 'vidstack';

/**
 * Returns the current parent media provider.
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#media-provider}
 */
export function useMediaProvider(): MediaProvider | null {
  const [provider, setProvider] = useState<MediaProvider | null>(null),
    context = useReactContext(mediaContext);

  if (__DEV__ && !context) {
    throw Error(
      '[vidstack] no media context was found - was this called outside of `<MediaPlayer`?',
    );
  }

  useEffect(() => {
    if (!context) return;
    return effect(() => {
      setProvider(context.$provider());
    });
  }, []);

  return provider;
}
