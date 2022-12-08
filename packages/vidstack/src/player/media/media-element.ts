import { effect } from 'maverick.js';
import { defineCustomElement, HTMLCustomElement, onAttach, onConnect } from 'maverick.js/element';
import {
  camelToKebabCase,
  dispatchEvent,
  DOMEvent,
  mergeProperties,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import type { ScreenOrientationLockType } from '../../foundation/orientation/screen-orientation';
import { withConnectedHost } from '../../utils/host';
import { IS_IOS } from '../../utils/support';
import type { MediaState } from './context';
import type { MediaControllerEvents } from './controller/events';
import { UseMediaController, useMediaController } from './controller/use-media-controller';
import { useMediaState } from './store';

declare global {
  interface HTMLElementTagNameMap {
    'vds-media': MediaElement;
  }

  interface HTMLElementEventMap {
    'vds-media-connect': MediaElementConnectEvent;
  }
}

const MEDIA_ATTRIBUTES: (keyof MediaState)[] = [
  'autoplay',
  'autoplayError',
  'canFullscreen',
  'canLoad',
  'canPlay',
  'ended',
  'error',
  'fullscreen',
  'loop',
  'mediaType',
  'muted',
  'paused',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'userIdle',
  'viewType',
  'waiting',
];

const MEDIA_CSS_VARS: (keyof MediaState)[] = [
  'bufferedAmount',
  'currentTime',
  'duration',
  'seekableAmount',
];

export const MediaElementDefinition = defineCustomElement<MediaElement>({
  tagName: 'vds-media',
  props: {
    userIdleDelay: { initial: 2000 },
    fullscreenOrientation: {},
  },
  setup({ props, host, accessors }) {
    /**
     * The media controller which is responsible for updating the media state store and satisfying
     * media requests.
     */
    const $el = withConnectedHost(() => host.el),
      controller = useMediaController($el, {
        $fullscreenOrientation: () => props.fullscreenOrientation,
      }),
      $media = useMediaState();

    onAttach(() => {
      setAttribute(
        host.el!,
        'hide-ui',
        () => IS_IOS && $media.viewType === 'video' && (!$media.playsinline || $media.fullscreen),
      );

      for (const prop of MEDIA_ATTRIBUTES) {
        setAttribute(host.el!, camelToKebabCase(prop as string), () => $media[prop]);
      }

      for (const prop of MEDIA_CSS_VARS) {
        setStyle(host.el!, `--${camelToKebabCase(prop as string)}`, () => $media[prop]);
      }
    });

    effect(() => {
      controller.user.idle.delay = props.userIdleDelay;
    });

    onConnect(() => {
      const el = $el()!;
      dispatchEvent(el, 'vds-media-connect', {
        detail: el,
        bubbles: true,
        composed: true,
      });
    });

    return mergeProperties(accessors(), controller);
  },
});

/**
 * All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
 * media controller, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @tagname vds-media
 * @slot - Used to pass in components that use/manage/provide media state.
 * @example
 * ```html
 * <vds-media>
 *   <vds-video>
 *     <video src="..." />
 *   </vds-video>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media>
 * ```
 */
export interface MediaElement
  extends HTMLCustomElement<MediaElementProps, MediaElementEvents>,
    MediaElementProps,
    UseMediaController {}

export interface MediaElementProps {
  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   */
  userIdleDelay: number;
  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   */
  fullscreenOrientation: ScreenOrientationLockType | undefined;
}

export interface MediaElementEvents extends MediaControllerEvents {
  'vds-media-connect': MediaElementConnectEvent;
}

/**
 * Fired when the media element `<vds-media>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaElementConnectEvent extends DOMEvent<MediaElement> {}
