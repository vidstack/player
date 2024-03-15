import { useReactContext } from 'maverick.js/react';
import { mediaContext } from 'vidstack';

export function useMediaContext() {
  return useReactContext(mediaContext)!;
}
