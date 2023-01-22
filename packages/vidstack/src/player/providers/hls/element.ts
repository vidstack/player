import { Dispose, peek, signal } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';
import { DOMEvent, listenEvent, mergeProperties } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES } from '../../../utils/mime';
import { isHLSSupported } from '../../../utils/support';
import { useMediaStore } from '../../media/context';
import { htmlProviderProps } from '../html/props';
import { ENGINE, IGNORE_NEXT_ABORT } from '../html/use-events';
import { useVideoElement } from '../video/use-element';
import type { HLSVideoElement } from './types';
import { useHLSEngine } from './use-hls-engine';
import { useHLSPreconnect } from './use-hls-preconnect';

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls-video': HLSVideoElement;
  }
}

const JS_DELIVR_CDN = 'https://cdn.jsdelivr.net';
const HLS_JS_SUPPORTED = isHLSSupported();

export const HLSVideoDefinition = defineCustomElement<HLSVideoElement>({
  tagName: 'vds-hls-video',
  props: {
    ...htmlProviderProps,
    hlsConfig: {
      initial: {},
    },
    hlsLibrary: {
      initial: `${JS_DELIVR_CDN}/npm/hls.js@^1.0.0/dist/hls.light${__DEV__ ? '.js' : '.min.js'}`,
    },
  },
  setup({ host, props, accessors }) {
    const $media = useMediaStore(),
      $canLoadLib = signal(false),
      logger = __DEV__ ? useLogger(host.$el) : undefined;

    useHLSPreconnect(props.$hlsLibrary, logger);

    const { delegate, members } = useVideoElement(host.$el, {
      onAbort,
      onLoadedMetadata,
      onSourcesChange,
    });

    const { $ctor, $engine, $attached, $isHLSSource } = useHLSEngine(
      host,
      $media,
      $canLoadLib,
      delegate,
      props,
    );

    function onSourcesChange(sources) {
      // Don't lose initial source because hls.js will overwrite it with blob.
      if (peek($isHLSSource) && !sources.find((src) => src.src === $media.source.src)) {
        if (!$media.canPlay) {
          host.el!.mediaElement![IGNORE_NEXT_ABORT] = true;
          sources.push($media.source);
        } else {
          delegate.srcChange({ src: '' });
        }
      }
    }

    // The boolean we're returning indicates whether we've handled the abort or not. The
    // HTML provider will not handle abort if it's handled here.
    function onAbort(event: Event) {
      if ((event.target as HTMLMediaElement).buffered.length > 0) return false;

      const source =
        HLS_JS_SUPPORTED &&
        $media.sources.find(
          (src) => HLS_VIDEO_TYPES.has(src.type!) || HLS_VIDEO_EXTENSIONS.test(src.src),
        );

      if (source) {
        delegate.srcChange(source);
        event.target![ENGINE] = true;
        $canLoadLib.set(true);
        return true;
      }

      event.target![ENGINE] = false;
      $canLoadLib.set(false);
      return false;
    }

    let removePlayingListener: Dispose | null = null;
    function onLoadedMetadata(event: Event) {
      if ($canLoadLib()) return;

      const media = event.target! as HTMLMediaElement;

      // Native HLS does not reliably fire `canplay` event.
      media.dispatchEvent(new DOMEvent<void>('canplay', { trigger: event }));

      removePlayingListener?.();
      // Seek to live position.
      if ($media.live) {
        removePlayingListener = listenEvent(
          media,
          'playing',
          () => {
            const end = media.seekable.end(0);
            if (Number.isFinite(end)) media.currentTime = end;
            removePlayingListener = null;
          },
          { once: true },
        );
      }
    }

    return mergeProperties(accessors(), members, {
      hls: {
        get ctor() {
          return peek($ctor);
        },
        get engine() {
          return $engine();
        },
        get supported() {
          return HLS_JS_SUPPORTED;
        },
        get attached() {
          return $attached();
        },
      },
      // see https://github.com/vidstack/player/issues/583
      set 'hls-config'(config) {
        accessors().hlsConfig = config;
      },
      set 'hls-library'(lib) {
        accessors().hlsLibrary = lib;
      },
    });
  },
});
