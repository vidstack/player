import { effect } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';
import { isKeyboardClick, isKeyboardEvent, listenEvent } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { useMedia } from '../../media/context';
import type { MediaLiveIndicatorElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-live-indicator': MediaLiveIndicatorElement;
  }
}

export const LiveIndicatorDefinition = defineCustomElement<MediaLiveIndicatorElement>({
  tagName: 'media-live-indicator',
  setup({ host }) {
    const { $store: $media, remote } = useMedia();

    useFocusVisible(host.$el);

    host.setAttributes({
      tabindex: () => ($media.live ? 0 : null),
      role: () => ($media.live ? 'button' : null),
      live: () => $media.live,
      'live-edge': () => $media.liveEdge,
      'aria-label': () => ($media.live ? 'Go live' : null),
    });

    effect(() => {
      const target = host.$el();
      if (!target) return;
      const clickEvents = ['pointerup', 'keydown'] as const;
      for (const eventType of clickEvents) listenEvent(target, eventType, onPress);
    });

    function onPress(event: Event) {
      if ($media.liveEdge || (isKeyboardEvent(event) && !isKeyboardClick(event))) return;
      remote.seekToLiveEdge(event);
    }

    return () => (
      <div part="container">
        <div part="text">LIVE</div>
      </div>
    );
  },
});
