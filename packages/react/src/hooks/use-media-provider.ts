import { effect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import * as React from 'react';
import { mediaContext, type MediaProviderAdapter } from 'vidstack/lib';

/**
 * Returns the current parent media provider.
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state#media-provider}
 */
export function useMediaProvider(): MediaProviderAdapter | null {
  const [provider, setProvider] = React.useState<MediaProviderAdapter | null>(null),
    context = useReactContext(mediaContext);

  if (__DEV__ && !context) {
    throw Error(
      '[vidstack] no media context was found - was this called outside of `<MediaPlayer>`?',
    );
  }

  React.useEffect(() => {
    if (!context) return;
    return effect(() => {
      setProvider(context.$provider());
    });
  }, []);

  return provider;
}
