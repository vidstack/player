import { effect, getScope, onDispose, scoped, signal } from 'maverick.js';
import { AttributesRecord, defineCustomElement, onAttach, onConnect } from 'maverick.js/element';
import {
  camelToKebabCase,
  dispatchEvent,
  isNull,
  listenEvent,
  mergeProperties,
  noop,
} from 'maverick.js/std';

import { createLogPrinter } from '../../foundation/logger/log-printer';
import { useFocusVisible } from '../../foundation/observers/use-focus-visible';
import { IS_IOS } from '../../utils/support';
import { createMediaController } from '../media/controller/create-controller';
import { useSourceSelection } from '../media/controller/source-selection';
import type { AnyMediaProvider } from '../media/controller/types';
import type { MediaState } from '../media/state';
import { useKeyboard } from './keyboard';
import { mediaPlayerProps } from './props';
import type { MediaPlayerConnectEvent, MediaPlayerElement } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'media-player': MediaPlayerElement;
  }

  interface HTMLElementEventMap {
    'media-player-connect': MediaPlayerConnectEvent;
  }
}

const MEDIA_ATTRIBUTES: (keyof MediaState)[] = [
  'autoplay',
  'autoplayError',
  'canFullscreen',
  'canLoad',
  'canPlay',
  'canSeek',
  'ended',
  'error',
  'fullscreen',
  'loop',
  'live',
  'liveEdge',
  'mediaType',
  'muted',
  'paused',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'streamType',
  'userIdle',
  'viewType',
  'waiting',
];

export const HLS_LISTENERS = Symbol(__DEV__ ? 'HLS_LISTENERS' : 0);

export const PlayerDefinition = defineCustomElement<MediaPlayerElement>({
  tagName: 'media-player',
  props: mediaPlayerProps,
  construct(this: MediaPlayerElement) {
    this[HLS_LISTENERS] = signal<string[]>([]);
    const addEventListener = this.addEventListener;
    this.addEventListener = function (type, handler, options) {
      if (type.startsWith('hls-')) this[HLS_LISTENERS].set((x) => [...x, type]);
      return addEventListener.call(this, type, handler, options);
    };
  },
  setup({ host, props, accessors }) {
    const scope = getScope()!,
      controller = createMediaController(props),
      context = controller._context,
      $media = context.$store;

    if (__DEV__) {
      const logPrinter = createLogPrinter(host.$el);
      effect(() => void (logPrinter.logLevel = props.$logLevel()));
    }

    onAttach(() => {
      host.el!.setAttribute('tabindex', '0');
      if (!host.el!.hasAttribute('aria-label')) {
        host.el!.setAttribute('aria-label', 'Media Player');
      }

      context.$player.set(host.el);
      context.remote.setTarget(host.el!);
      context.remote.setPlayer(host.el!);
      listenEvent(host.el!, 'find-media-player', ({ detail }) => detail(host.el));
    });

    onConnect(() => {
      dispatchEvent(host.el, 'media-player-connect', {
        detail: host.el!,
        bubbles: true,
        composed: true,
      });

      window.requestAnimationFrame(() => {
        if (isNull($media.canLoadPoster)) $media.canLoadPoster = true;
      });
    });

    context.ariaKeys = {};
    context.$keyShortcuts = props.$keyShortcuts;
    useKeyboard(context, props);
    useFocusVisible(host.$el);
    useSourceSelection(props.$src, props.$preferNativeHLS, controller._context);

    const $attrs: AttributesRecord = {
      'aspect-ratio': props.$aspectRatio,
      'data-ios-controls': () =>
        IS_IOS &&
        $media.mediaType === 'video' &&
        $media.controls &&
        (!props.$playsinline() || $media.fullscreen),
    };

    for (const prop of MEDIA_ATTRIBUTES) {
      $attrs['data-' + camelToKebabCase(prop as string)] = () => $media[prop] as string | number;
    }

    host.setAttributes($attrs);

    host.setCSSVars({
      '--media-aspect-ratio': () => {
        const ratio = props.$aspectRatio();
        return ratio ? +ratio.toFixed(4) : null;
      },
      '--media-buffered': () => +$media.bufferedEnd.toFixed(3),
      '--media-current-time': () => +$media.currentTime.toFixed(3),
      '--media-duration': () =>
        Number.isFinite($media.duration) ? +$media.duration.toFixed(3) : 0,
    });

    onDispose(() => {
      dispatchEvent(host.el, 'destroy');
    });

    return mergeProperties(
      {
        get user() {
          return controller._request._user;
        },
        get orientation() {
          return controller._request._orientation;
        },
        get provider() {
          return context.$provider() as AnyMediaProvider;
        },
        get qualities() {
          return context.qualities;
        },
        get $store() {
          return $media;
        },
        state: new Proxy($media, {
          // @ts-expect-error
          set: noop,
        }),
        subscribe: (callback) => scoped(() => effect(() => callback($media)), scope)!,
        startLoading: controller._start,
        play: controller._request._play,
        pause: controller._request._pause,
        seekToLiveEdge: controller._request._seekToLiveEdge,
        enterFullscreen: controller._request._enterFullscreen,
        exitFullscreen: controller._request._exitFullscreen,
      },
      accessors(),
      controller._provider,
    );
  },
});
