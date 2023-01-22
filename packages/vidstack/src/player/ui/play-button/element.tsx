import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { useMediaStore } from '../../media/context';
import { useMediaRemoteControl } from '../../media/remote-control';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { PlayButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-play-button': PlayButtonElement;
  }
}

export const PlayButtonDefinition = defineCustomElement<PlayButtonElement>({
  tagName: 'vds-play-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled } }) {
    const $media = useMediaStore(),
      $pressed = () => !$media.paused,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      }),
      remote = useMediaRemoteControl(host.$el);

    host.setAttributes({
      paused: () => $media.paused,
      'aria-label': () => ($media.paused ? 'Play' : 'Pause'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.pause(event) : remote.play(event);
    }

    return mergeProperties(toggle, {
      $render: () => {
        return (
          <>
            <svg width="32px" height="32px" viewBox="0 0 28 28" slot="play">
              <path
                d="M9.34339 5.82294C9.34339 5.34417 9.8883 5.06927 10.2734 5.35378L21.34 13.5304C21.6555 13.7636 21.6556 14.2356 21.34 14.4687L10.2734 22.6461C9.88832 22.9307 9.34338 22.6558 9.34338 22.177L9.34339 5.82294Z"
                fill="currentColor"
              />
            </svg>
            <svg width="32px" height="32px" viewBox="0 0 28 28" slot="pause">
              <path
                d="M7.59334 5.83334C7.27118 5.83334 7.01001 6.09451 7.01001 6.41668V21.5833C7.01001 21.9055 7.27118 22.1667 7.59334 22.1667H11.0933C11.4155 22.1667 11.6767 21.9055 11.6767 21.5833V6.41668C11.6767 6.09451 11.4155 5.83334 11.0933 5.83334H7.59334Z"
                fill="currentColor"
              />
              <path
                d="M16.9267 5.83334C16.6045 5.83334 16.3433 6.09451 16.3433 6.41668V21.5833C16.3433 21.9055 16.6045 22.1667 16.9267 22.1667H20.4267C20.7488 22.1667 21.01 21.9055 21.01 21.5833V6.41668C21.01 6.09451 20.7488 5.83334 20.4267 5.83334H16.9267Z"
                fill="currentColor"
              />
            </svg>
          </>
        );
      },
    });
  },
});
