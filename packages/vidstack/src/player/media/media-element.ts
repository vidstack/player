import { effect } from 'maverick.js';
import {
  defineElement,
  defineEvents,
  defineProp,
  InferHostElement,
  onAttach,
  onConnect,
} from 'maverick.js/element';
import {
  camelToKebabCase,
  dispatchEvent,
  DOMEvent,
  mergeProperties,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import type { ScreenOrientationLockType } from '../../foundation/orientation/screen-orientation';
import { IS_IOS } from '../../utils/support';
import type { MediaState } from './context';
import { useMediaController } from './controller/use-media-controller';
import type { MediaRequestEvents } from './request-events';
import { useMediaState } from './store';

declare global {
  interface HTMLElementTagNameMap {
    'vds-media': MediaElement;
  }

  interface MaverickEventRecord {
    'vds-media-connect': MediaElementConnectEvent;
  }
}

export type MediaElement = InferHostElement<typeof MediaElementDefinition>;

/**
 * Fired when the media element `<vds-media>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export type MediaElementConnectEvent = DOMEvent<MediaElement>;

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
export const MediaElementDefinition = defineElement({
  tagName: 'vds-media',
  props: {
    /**
     * The amount of delay in milliseconds while media playback is progressing without user
     * activity to indicate an idle state.
     */
    userIdleDelay: defineProp<number>(0),
    /**
     * This will indicate the orientation to lock the screen to when in fullscreen mode and
     * the Screen Orientation API is available. The default is `undefined` which indicates
     * no screen orientation change.
     */
    fullscreenOrientation: defineProp<ScreenOrientationLockType | undefined>(undefined),
  },
  events: defineEvents<MediaRequestEvents>(),
  setup({ props, accessors }) {
    /**
     * The media controller which is responsible for updating the media state store and satisfying
     * media requests.
     */
    const controller = useMediaController({
        get fullscreenOrientation() {
          return props.fullscreenOrientation;
        },
      }),
      $media = useMediaState();

    onAttach((host) => {
      setAttribute(
        host,
        'hide-ui',
        () => IS_IOS && $media.viewType === 'video' && (!$media.playsinline || $media.fullscreen),
      );

      for (const prop of MEDIA_ATTRIBUTES) {
        setAttribute(host, camelToKebabCase(prop), () => $media[prop]);
      }

      for (const prop of MEDIA_CSS_VARS) {
        setStyle(host, `--${camelToKebabCase(prop)}`, () => $media[prop]);
      }
    });

    effect(() => {
      controller.user.idle.delay = props.userIdleDelay;
    });

    onConnect((host) => {
      dispatchEvent(host, 'vds-media-connect', {
        detail: host as any,
        bubbles: true,
        composed: true,
      });
    });

    return mergeProperties(accessors(), controller);
  },
});
