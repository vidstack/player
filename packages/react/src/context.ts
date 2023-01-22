import { createReactContextProvider } from 'maverick.js/react';
import { mediaContext } from 'vidstack';

/**
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#setup}
 */
export const MediaProvider = createReactContextProvider(mediaContext);
