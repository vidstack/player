import { effect } from 'maverick.js';
import { defineCustomElement, onAttach, onConnect } from 'maverick.js/element';
import {
  camelToKebabCase,
  dispatchEvent,
  mergeProperties,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import { IS_IOS } from '../../../utils/support';
import { useMediaController } from '../controller/use-media-controller';
import type { MediaState } from '../state';
import { useMediaState } from '../store';
import type { MediaElement, MediaElementConnectEvent } from './types';

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
    logLevel: { initial: 'silent' },
    userIdleDelay: { initial: 2000 },
    fullscreenOrientation: {},
  },
  setup({ props, host, accessors }) {
    /**
     * The media controller which is responsible for updating the media state store and satisfying
     * media requests.
     */
    const $target = () => (host.$connected ? host.el : null),
      controller = useMediaController($target, {
        $fullscreenOrientation: () => props.fullscreenOrientation,
      });

    const $media = useMediaState();

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
      controller.logLevel = props.logLevel;
    });

    effect(() => {
      controller.user.idle.delay = props.userIdleDelay;
    });

    onConnect(() => {
      const el = $target()!;
      dispatchEvent(el, 'vds-media-connect', {
        detail: el,
        bubbles: true,
        composed: true,
      });
    });

    return mergeProperties(accessors(), controller);
  },
});
