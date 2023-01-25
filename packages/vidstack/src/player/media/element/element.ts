import {
  effect,
  hasProvidedContext,
  MaybeStopEffect,
  onDispose,
  peek,
  provideContext,
  signal,
} from 'maverick.js';
import { AttributesRecord, defineCustomElement, onConnect } from 'maverick.js/element';
import { camelToKebabCase, dispatchEvent, isNull, mergeProperties, noop } from 'maverick.js/std';

import { useLogPrinter } from '../../../foundation/logger/use-log-printer';
import { Queue } from '../../../foundation/queue/queue';
import { IS_IOS } from '../../../utils/support';
import { mediaContext, useMedia } from '../context';
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

    const logPrinter = __DEV__ ? useLogPrinter(host.$el) : undefined;
    if (__DEV__) {
      effect(() => {
        logPrinter!.logLevel = props.$logLevel();
      });
    }

    const context = useMedia(),
      $media = context.$store,
      requestManagerInit: MediaRequestManagerInit = {
        requestQueue: new Queue(),
        $isLooping: signal(false),
        $isReplay: signal(false),
        $isSeekingRequest: signal(false),
      },
      stateManager = useMediaStateManager(host.$el, context, requestManagerInit),
      requestManager = useMediaRequestManager(
        host.$el,
        context,
        stateManager,
        props,
        requestManagerInit,
      );

    const delegate = createMediaControllerDelegate(host.$el, $media, stateManager.handleMediaEvent);
    provideContext(mediaControllerDelegateContext, delegate);

    // init
    for (const prop of Object.keys(props)) {
      const propName = prop.slice(1);
      if (propName in $media) $media[propName] = props[prop]();
    }

    $media.muted = props.$muted() || props.$volume() === 0;

    useMediaPropChange(host.$el, $media, props);
    useMediaCanLoad(host.$el, props.$load, startLoading);
    useMediaAdapterDelegate(() => peek(context.$provider)?.adapter, $media, requestManager, props);

    if (__DEV__) useMediaEventsLogger(host.$el);

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

    const userIdle = requestManager.user.idle;
    $attrs['user-idle'] = () => userIdle.idling;

    host.setAttributes($attrs);

    host.setCSSVars({
      '--media-buffered-amount': () => $media.bufferedAmount,
      '--media-current-time': () => $media.currentTime,
      '--media-duration': () => $media.duration,
      '--media-seekable-amount': () => $media.seekableAmount,
    });

    effect(() => {
      context.$element.set(host.$el());
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

    onDispose(() => {
      dispatchEvent(host.el, 'destroy');
    });

    function startLoading() {
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
          return context.$provider();
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
        startLoading,
        play: requestManager.play,
        pause: requestManager.pause,
        enterFullscreen: requestManager.enterFullscreen,
        exitFullscreen: requestManager.exitFullscreen,
      },
      accessors(),
    );
  },
});
