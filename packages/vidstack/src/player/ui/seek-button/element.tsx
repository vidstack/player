import { defineCustomElement, onAttach } from 'maverick.js/element';
import { isKeyboardClick, isKeyboardEvent, listenEvent } from 'maverick.js/std';
import { seekBackwardPaths, seekForwardPaths } from 'media-icons';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { Icon } from '../../../icons/icon';
import { setARIALabel, setAttributeIfEmpty } from '../../../utils/dom';
import { useMedia } from '../../media/context';
import type { MediaSeekButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-seek-button': MediaSeekButtonElement;
  }
}

export const SeekButtonDefinition = defineCustomElement<MediaSeekButtonElement>({
  tagName: 'media-seek-button',
  props: { seconds: { initial: 30 }, defaultAppearance: { initial: false } },
  setup({ host, props: { $seconds, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia();

    useFocusVisible(host.$el);

    onAttach(() => {
      setAttributeIfEmpty(host.el!, 'tabindex', '0');
      setAttributeIfEmpty(host.el!, 'role', 'button');
      setARIALabel(
        host.el!,
        () => `Seek ${$seconds() > 0 ? 'forward' : 'backward'} ${$seconds()} seconds`,
      );
      const clickEvents = ['pointerup', 'keydown'] as const;
      for (const eventType of clickEvents) listenEvent(host.el!, eventType, onPress);
    });

    host.setAttributes({
      seconds: $seconds,
      'data-media-button': true,
      'default-appearance': $defaultAppearance,
      'data-hidden': () => !$media.canSeek,
    });

    function onPress(event: Event) {
      if (isKeyboardEvent(event) && !isKeyboardClick(event)) return;
      remote.seek($media.currentTime + $seconds(), event);
    }

    return () => (
      <>
        <Icon paths={seekBackwardPaths} slot="backward" />
        <Icon paths={seekForwardPaths} slot="forward" />
      </>
    );
  },
});
