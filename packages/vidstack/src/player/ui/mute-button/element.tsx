import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { useMediaStore } from '../../media/context';
import { useMediaRemoteControl } from '../../media/remote-control';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { MuteButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-button': MuteButtonElement;
  }
}

export const MuteButtonDefinition = defineCustomElement<MuteButtonElement>({
  tagName: 'vds-mute-button',
  props: toggleButtonProps,
  setup({ host, props: { $disabled } }) {
    const $media = useMediaStore(),
      $pressed = computed(() => $media.muted || $media.volume === 0),
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      }),
      remote = useMediaRemoteControl(host.$el);

    host.setAttributes({
      muted: $pressed,
      'volume-low': () => !$media.muted && $media.volume > 0 && $media.volume < 0.5,
      'volume-high': () => !$media.muted && $media.volume >= 0.5,
      'aria-label': () => ($pressed() ? 'Unmute' : 'Mute'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed() ? remote.unmute(event) : remote.mute(event);
    }

    return mergeProperties(toggle, {
      $render: () => {
        return (
          <>
            <svg slot="volume-high" width="32px" height="32px" viewBox="0 0 28 28">
              <path
                d="M15.3305 21.577C15.3305 22.0558 14.7856 22.3307 14.4005 22.0462L8.27742 17.5221C8.25735 17.5073 8.23305 17.4993 8.20809 17.4993H4.09334C3.77118 17.4993 3.51001 17.2381 3.51001 16.9159V11.0826C3.51001 10.7604 3.77118 10.4993 4.09334 10.4993H8.20976C8.23472 10.4993 8.25903 10.4913 8.2791 10.4764L14.4005 5.95318C14.7855 5.66865 15.3305 5.94355 15.3305 6.42233L15.3305 21.577Z"
                fill="currentColor"
              />
              <path
                d="M24.0805 8.16669C24.4027 8.16669 24.6638 8.42786 24.6638 8.75003V19.25C24.6638 19.5722 24.4027 19.8334 24.0805 19.8334H22.9138C22.5917 19.8334 22.3305 19.5722 22.3305 19.25V8.75003C22.3305 8.42786 22.5917 8.16669 22.9138 8.16669H24.0805Z"
                fill="currentColor"
              />
              <path
                d="M19.4138 10.5C19.736 10.5 19.9972 10.7612 19.9972 11.0834L19.9972 16.9167C19.9972 17.2389 19.736 17.5 19.4138 17.5H18.2472C17.925 17.5 17.6638 17.2389 17.6638 16.9167V11.0834C17.6638 10.7612 17.925 10.5 18.2472 10.5H19.4138Z"
                fill="currentColor"
              />
            </svg>
            <svg slot="volume-low" width="32px" height="32px" viewBox="0 0 28 28">
              <path
                d="M15.3305 21.577C15.3305 22.0557 14.7856 22.3307 14.4005 22.0461L8.27742 17.522C8.25735 17.5072 8.23305 17.4992 8.20809 17.4992H4.09334C3.77118 17.4992 3.51001 17.238 3.51001 16.9159V11.0825C3.51001 10.7604 3.77118 10.4992 4.09334 10.4992H8.20976C8.23472 10.4992 8.25903 10.4912 8.2791 10.4764L14.4005 5.95313C14.7855 5.6686 15.3305 5.9435 15.3305 6.42228L15.3305 21.577Z"
                fill="currentColor"
              />
              <path
                d="M19.9972 11.0833C19.9972 10.7612 19.736 10.5 19.4138 10.5L18.2472 10.5C17.925 10.5 17.6638 10.7612 17.6638 11.0833V16.9167C17.6638 17.2388 17.925 17.5 18.2472 17.5H19.4138C19.736 17.5 19.9972 17.2388 19.9972 16.9167L19.9972 11.0833Z"
                fill="currentColor"
              />
            </svg>
            <svg slot="volume-muted" width="32px" height="32px" viewBox="0 0 28 28">
              <path
                d="M15.3305 21.577C15.3305 22.0558 14.7856 22.3307 14.4005 22.0461L8.27742 17.5221C8.25735 17.5072 8.23305 17.4992 8.20809 17.4992H4.09334C3.77118 17.4992 3.51001 17.2381 3.51001 16.9159V11.0826C3.51001 10.7604 3.77118 10.4992 4.09334 10.4992H8.20976C8.23472 10.4992 8.25903 10.4912 8.2791 10.4764L14.4005 5.95314C14.7855 5.66861 15.3305 5.94351 15.3305 6.42229L15.3305 21.577Z"
                fill="currentColor"
              />
              <path
                d="M25.2644 11.9369C25.4922 11.7091 25.4922 11.3398 25.2644 11.1119L24.4394 10.287C24.2116 10.0592 23.8422 10.0592 23.6144 10.287L21.6342 12.2672C21.5887 12.3128 21.5148 12.3128 21.4692 12.2672L19.4892 10.2872C19.2614 10.0594 18.8921 10.0594 18.6643 10.2872L17.8393 11.1121C17.6115 11.3399 17.6115 11.7093 17.8393 11.9371L19.8193 13.9171C19.8649 13.9627 19.8649 14.0365 19.8193 14.0821L17.8397 16.0617C17.6119 16.2895 17.6119 16.6588 17.8397 16.8867L18.6647 17.7116C18.8925 17.9394 19.2618 17.9394 19.4897 17.7116L21.4692 15.732C21.5148 15.6865 21.5887 15.6865 21.6342 15.732L23.614 17.7118C23.8418 17.9396 24.2112 17.9396 24.439 17.7118L25.2639 16.8868C25.4917 16.659 25.4917 16.2897 25.2639 16.0619L23.2842 14.0821C23.2386 14.0365 23.2386 13.9627 23.2842 13.9171L25.2644 11.9369Z"
                fill="currentColor"
              />
            </svg>
          </>
        );
      },
    });
  },
});
