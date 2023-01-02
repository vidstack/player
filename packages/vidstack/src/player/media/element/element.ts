import { effect } from 'maverick.js';
import { AttributesRecord, defineCustomElement, onConnect } from 'maverick.js/element';
import { camelToKebabCase, dispatchEvent, mergeProperties } from 'maverick.js/std';

import { IS_IOS } from '../../../utils/support';
import { useMediaController } from '../controller/use-media-controller';
import type { MediaState } from '../state';
import { useMediaStore } from '../store';
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

export const MediaDefinition = defineCustomElement<MediaElement>({
  tagName: 'vds-media',
  props: {
    logLevel: { initial: 'silent' },
    userIdleDelay: { initial: 2000 },
    fullscreenOrientation: {},
  },
  setup({ props: { $logLevel, $userIdleDelay, $fullscreenOrientation }, host, accessors }) {
    /**
     * The media controller which is responsible for updating the media state store and satisfying
     * media requests.
     */
    const controller = useMediaController(host.$el, {
      $fullscreenOrientation,
    });

    const $media = useMediaStore(),
      $attrs: AttributesRecord = {
        'hide-ui': () =>
          IS_IOS && $media.viewType === 'video' && (!$media.playsinline || $media.fullscreen),
      };

    for (const prop of MEDIA_ATTRIBUTES) {
      $attrs[camelToKebabCase(prop as string)] = () => $media[prop] as string | number;
    }

    host.setAttributes($attrs);

    host.setCSSVars({
      '--vds-buffered-amount': () => $media.bufferedAmount,
      '--vds-current-time': () => $media.currentTime,
      '--vds-duration': () => $media.duration,
      '--vds-seekable-amount': () => $media.seekableAmount,
    });

    effect(() => {
      controller.logLevel = $logLevel();
    });

    effect(() => {
      controller.user.idle.delay = $userIdleDelay();
    });

    onConnect(() => {
      dispatchEvent(host.el!, 'vds-media-connect', {
        detail: host.el!,
        bubbles: true,
        composed: true,
      });
    });

    return mergeProperties(accessors(), controller);
  },
});

export default MediaDefinition;
