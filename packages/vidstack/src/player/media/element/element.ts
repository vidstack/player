import { effect, MaybeStopEffect, provideContext } from 'maverick.js';
import { AttributesRecord, defineCustomElement, onConnect } from 'maverick.js/element';
import { camelToKebabCase, dispatchEvent, mergeProperties, noop } from 'maverick.js/std';

import { IS_IOS } from '../../../utils/support';
import { useMediaController } from '../controller/use-media-controller';
import type { MediaState } from '../state';
import { MediaStore, useMediaStore } from '../store';
import { MediaElementContext } from './context';
import type { MediaElement, MediaElementConnectEvent } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-media': MediaElement;
  }

  interface HTMLElementEventMap {
    'media-connect': MediaElementConnectEvent;
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
    provideContext(MediaElementContext, host.$el);

    /**
     * The media controller which is responsible for updating the media state store and satisfying
     * media requests.
     */
    const controller = useMediaController(host.$el, {
      $fullscreenOrientation,
    });

    const $media = useMediaStore(),
      $attrs: AttributesRecord = {
        'ios-fullscreen': () =>
          IS_IOS && $media.viewType === 'video' && (!$media.playsinline || $media.fullscreen),
      };

    for (const prop of MEDIA_ATTRIBUTES) {
      $attrs[camelToKebabCase(prop as string)] = () => $media[prop] as string | number;
    }

    host.setAttributes($attrs);

    host.setCSSVars({
      '--media-buffered-amount': () => $media.bufferedAmount,
      '--media-current-time': () => $media.currentTime,
      '--media-duration': () => $media.duration,
      '--media-seekable-amount': () => $media.seekableAmount,
    });

    effect(() => {
      controller.logLevel = $logLevel();
    });

    effect(() => {
      controller.user.idle.delay = $userIdleDelay();
    });

    onConnect(() => {
      dispatchEvent(host.el!, 'media-connect', {
        detail: host.el!,
        bubbles: true,
        composed: true,
      });
    });

    function subscribe(this: keyof MediaStore, callback: (value: any) => MaybeStopEffect) {
      return effect(() => callback($media[this]));
    }

    return mergeProperties(accessors(), controller, {
      get $store() {
        return $media;
      },
      get provider() {
        return controller.provider;
      },
      state: new Proxy($media, {
        // @ts-expect-error
        set: noop,
      }),
      store: new Proxy($media, {
        get: (_, prop: keyof MediaStore) => ({ subscribe: subscribe.bind(prop) }),
        // @ts-expect-error
        set: noop,
      }),
    });
  },
});
