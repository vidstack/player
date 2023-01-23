import {
  effect,
  hasProvidedContext,
  MaybeStopEffect,
  peek,
  provideContext,
  signal,
} from 'maverick.js';
import { AttributesRecord, defineCustomElement, onConnect, onMount } from 'maverick.js/element';
import { camelToKebabCase, dispatchEvent, isNull, mergeProperties, noop } from 'maverick.js/std';

import { useLogPrinter } from '../../../foundation/logger/use-log-printer';
import { Queue } from '../../../foundation/queue/queue';
import { IS_IOS } from '../../../utils/support';
import { mediaContext, useMedia } from '../context';
import { mediaProviderContext } from '../provider/use-media-provider';
import type { MediaState } from '../state';
import type { MediaStore } from '../store';
import { useMediaAdapterDelegate } from './controller/adapter-delegate';
import {
  createMediaControllerDelegate,
  mediaControllerDelegateContext,
} from './controller/controller-delegate';
import type { MediaControllerStore } from './controller/types';
import { useMediaCanLoad } from './controller/use-media-can-load';
import { useMediaEventsLogger } from './controller/use-media-events-logger';
import { useMediaPropChange } from './controller/use-media-prop-change';
import {
  MediaRequestManagerInit,
  useMediaRequestManager,
} from './controller/use-media-request-manager';
import { useMediaStateManager } from './controller/use-media-state-manager';
import { mediaElementProps } from './props';
import type { MediaConnectEvent, MediaElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'vds-media': MediaElement;
  }

  interface HTMLElementEventMap {
    'media-connect': MediaConnectEvent;
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
  'media',
  'muted',
  'paused',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'userIdle',
  'view',
  'waiting',
];

export const MediaDefinition = defineCustomElement<MediaElement>({
  tagName: 'vds-media',
  props: mediaElementProps,
  setup({ host, props, accessors }) {
    if (!hasProvidedContext(mediaContext)) provideContext(mediaContext);

    provideContext(mediaProviderContext);

    const logPrinter = __DEV__ ? useLogPrinter(host.$el) : undefined;
    if (__DEV__) {
      effect(() => {
        logPrinter!.logLevel = props.$logLevel();
      });
    }

    const media = useMedia(),
      $media = media.store,
      requestManagerInit: MediaRequestManagerInit = {
        requestQueue: new Queue(),
        $isLooping: signal(false),
        $isReplay: signal(false),
        $isSeekingRequest: signal(false),
      },
      stateManager = useMediaStateManager(host.$el, $media, requestManagerInit),
      requestManager = useMediaRequestManager(
        host.$el,
        $media,
        stateManager,
        props,
        requestManagerInit,
      );

    const delegate = createMediaControllerDelegate(host.$el, $media, stateManager.handleMediaEvent);
    provideContext(mediaControllerDelegateContext, delegate);

    useMediaPropChange(host.$el, $media, props);
    useMediaCanLoad(host.$el, props.$load, startLoadingMedia);

    useMediaAdapterDelegate(
      () => peek(stateManager.$mediaProvider)?.adapter,
      $media,
      requestManager,
      props,
    );

    if (__DEV__) useMediaEventsLogger(host.$el);

    if (__SERVER__) {
      $media.autoplay = props.$autoplay();
      $media.poster = props.$poster();
      $media.loop = props.$loop();
      $media.controls = props.$controls();
      $media.view = props.$view();
      $media.paused = props.$paused();
      $media.volume = props.$volume();
      $media.muted = props.$muted();
      $media.currentTime = props.$currentTime();
      $media.playsinline = props.$playsinline();
    }

    const $attrs: AttributesRecord = {
      'ios-controls': () =>
        IS_IOS &&
        $media.media.includes('video') &&
        $media.controls &&
        (!props.$playsinline() || $media.fullscreen),
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
      media.element.set(host.$el());
    });

    onConnect(() => {
      dispatchEvent(host.el, 'media-connect', {
        detail: host.el!,
        bubbles: true,
        composed: true,
      });

      window.requestAnimationFrame(() => {
        if (isNull($media.canLoadPoster)) $media.canLoadPoster = true;
      });
    });

    onMount(() => {
      return () => {
        dispatchEvent(host.el, 'destroy');
      };
    });

    function startLoadingMedia() {
      delegate.dispatch('can-load');
    }

    function subscribe(this: keyof MediaStore, callback: (value: any) => MaybeStopEffect) {
      return effect(() => callback($media[this]));
    }

    return mergeProperties(
      {
        get user() {
          return requestManager.user;
        },
        get orientation() {
          return requestManager.orientation;
        },
        get provider() {
          return stateManager.$mediaProvider();
        },
        get $store() {
          return $media;
        },
        state: new Proxy($media, {
          // @ts-expect-error
          set: noop,
        }),
        store: new Proxy($media, {
          get: (_, prop: keyof MediaStore) => ({ subscribe: subscribe.bind(prop) }),
          // @ts-expect-error
          set: noop,
        }) as unknown as MediaControllerStore,
        startLoadingMedia,
        play: requestManager.play,
        pause: requestManager.pause,
        enterFullscreen: requestManager.enterFullscreen,
        exitFullscreen: requestManager.exitFullscreen,
      },
      accessors(),
    );
  },
});
