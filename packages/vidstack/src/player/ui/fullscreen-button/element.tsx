import { defineCustomElement } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';

import { useMediaStore } from '../../media/context';
import { useMediaRemoteControl } from '../../media/remote-control';
import { toggleButtonProps } from '../toggle-button/props';
import { useToggleButton } from '../toggle-button/use-toggle-button';
import type { FullscreenButtonElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-fullscreen-button': FullscreenButtonElement;
  }
}

export const FullscreenButtonDefinition = defineCustomElement<FullscreenButtonElement>({
  tagName: 'vds-fullscreen-button',
  props: {
    ...toggleButtonProps,
    target: { initial: 'prefer-media' },
  },
  setup({ host, props: { $target, $disabled }, accessors }) {
    const $media = useMediaStore(),
      $pressed = () => $media.fullscreen,
      toggle = useToggleButton(host, {
        $props: { $pressed, $disabled },
        onPress,
      }),
      remote = useMediaRemoteControl(host.$el);

    host.setAttributes({
      hidden: () => !$media.canFullscreen,
      fullscreen: () => $media.fullscreen,
      'aria-label': () => ($media.fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'),
    });

    function onPress(event: Event) {
      if ($disabled()) return;
      $pressed()
        ? remote.exitFullscreen($target(), event)
        : remote.enterFullscreen($target(), event);
    }

    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return (
          <>
            <svg slot="enter" width="32px" height="32px" viewBox="0 0 29 28">
              <path
                d="M15.1634 10.9249L18.5802 7.50814C18.6537 7.43464 18.6016 7.30897 18.4977 7.30897H15.7765C15.4543 7.30897 15.1931 7.04781 15.1931 6.72564V5.20897C15.1931 4.88681 15.4543 4.62564 15.7765 4.62564H22.7765C23.0986 4.62564 23.3604 4.88681 23.3604 5.20897L23.3604 12.209C23.3604 12.5311 23.0992 12.7923 22.7771 12.7923H21.2604C20.9382 12.7923 20.6771 12.5311 20.6771 12.209V9.48772C20.6771 9.38378 20.5514 9.33173 20.4779 9.40522L17.0608 12.8223C16.833 13.0501 16.4637 13.0501 16.2359 12.8223L15.1634 11.7498C14.9356 11.522 14.9356 11.1527 15.1634 10.9249Z"
                fill="currentColor"
              />
              <path
                d="M5.36086 23.3743H12.3609C12.683 23.3743 12.9442 23.1132 12.9442 22.791V21.2743C12.9442 20.9522 12.683 20.691 12.3609 20.691H9.63963C9.53569 20.691 9.48364 20.5653 9.55713 20.4918L12.9739 17.0751C13.2017 16.8473 13.2017 16.4779 12.9739 16.2501L11.9014 15.1777C11.6736 14.9499 11.3043 14.9499 11.0765 15.1777L7.65941 18.5948C7.58592 18.6683 7.46025 18.6162 7.46025 18.5123L7.46025 15.791C7.46025 15.4688 7.19908 15.2077 6.87692 15.2077H5.36025C5.03809 15.2077 4.77692 15.4688 4.77692 15.791V22.791C4.77692 23.1132 5.03869 23.3743 5.36086 23.3743Z"
                fill="currentColor"
              />
            </svg>
            <svg slot="exit" width="32px" height="32px" viewBox="0 0 28 28">
              <path
                d="M17.4339 5.65098V8.37214C17.4339 8.47608 17.5596 8.52814 17.6331 8.45464L21.0501 5.03761C21.2779 4.80981 21.6473 4.80981 21.8751 5.03761L22.9475 6.11006C23.1753 6.33787 23.1753 6.70721 22.9475 6.93502L19.5307 10.3518C19.4572 10.4253 19.5093 10.551 19.6132 10.551H22.3345C22.6567 10.551 22.9179 10.8121 22.9179 11.1343V12.651C22.9179 12.9731 22.6567 13.2343 22.3345 13.2343H16.851C16.8511 13.2343 16.8508 13.2343 16.851 13.2343H15.3345C15.0124 13.2343 14.7506 12.9731 14.7506 12.651V5.65098C14.7506 5.32881 15.0118 5.06765 15.3339 5.06765H16.8506C17.1727 5.06765 17.4339 5.32881 17.4339 5.65098Z"
                fill="currentColor"
              />
              <path
                d="M8.52426 17.4489C8.6282 17.4489 8.68025 17.5746 8.60676 17.6481L5.18996 21.0649C4.96215 21.2927 4.96215 21.662 5.18996 21.8898L6.2624 22.9623C6.49021 23.1901 6.85956 23.1901 7.08736 22.9623L10.5044 19.5452C10.5779 19.4717 10.7036 19.5238 10.7036 19.6277V22.3489C10.7036 22.6711 10.9647 22.9322 11.2869 22.9322H12.8036C13.1257 22.9322 13.3869 22.6711 13.3869 22.3489L13.3869 15.3489C13.3869 15.0267 13.1257 14.7656 12.8036 14.7656H5.80294C5.48078 14.7656 5.21961 15.0267 5.21961 15.3489V16.8656C5.21961 17.1877 5.48078 17.4489 5.80294 17.4489H8.52426Z"
                fill="currentColor"
              />
            </svg>
          </>
        );
      },
    });
  },
});
