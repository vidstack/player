import * as React from 'react';

import { effect } from 'maverick.js';

import { useMediaPlayer } from '../../hooks/use-media-player';

export function useLayoutName(name: string) {
  const player = useMediaPlayer();
  React.useEffect(() => {
    if (!player) return;
    return effect(() => {
      player.$el?.setAttribute('data-layout', name);
      return () => player.$el?.removeAttribute('data-layout');
    });
  }, [player]);
}
