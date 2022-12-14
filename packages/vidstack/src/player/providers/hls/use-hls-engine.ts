import type * as HLS from 'hls.js';
import { effect, ReadSignal, signal } from 'maverick.js';
import type { CustomElementHost } from 'maverick.js/element';
import { dispatchEvent, DOMEvent } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES } from '../../../utils/mime';
import type { MediaState } from '../../media/state';
import type { MediaType } from '../../media/types';
import { loadHLSLibrary } from './loader';
import type { HLSConstructor, HLSProviderProps, HLSVideoElement } from './types';
import { useHLSAttach } from './use-hls-attach';
import { useHLSEvents } from './use-hls-events';

export function useHLSEngine(
  host: CustomElementHost<HLSVideoElement>,
  $target: ReadSignal<HLSVideoElement | null>,
  $canLoadLib: ReadSignal<boolean>,
  $media: MediaState,
  props: HLSProviderProps,
) {
  const $isHLSSource = () =>
    HLS_VIDEO_TYPES.has($media.source.type!) || HLS_VIDEO_EXTENSIONS.test($media.source.src);

  const $ctor = signal<HLSConstructor | null>(null),
    $engine = signal<HLS.default | null>(null),
    $attached = useHLSAttach($ctor, $target, $engine, $isHLSSource, $media, onLevelLoaded),
    events = useHLSEvents(host, $engine),
    logger = __DEV__ ? useLogger($target) : undefined;

  // Load `hlsLibrary`
  effect(() => {
    if (!$canLoadLib()) return;
    const lib = props.hlsLibrary;
    loadHLSLibrary(host.el!, lib, logger).then((ctor) => {
      if (props.hlsLibrary !== lib) return;
      $ctor.set(ctor);
    });
  });

  // Create `hls.js` engine and attach listeners
  effect(() => {
    const ctor = $ctor(),
      video = $target()?.mediaElement;

    if (!ctor || !video || !$canLoadLib()) return;

    const engine = new ctor(props.hlsConfig);
    $engine.set(engine);
    attachHLSEventListeners(ctor, engine);
    dispatchEvent(host.el, 'vds-hls-instance', { detail: engine });

    return () => {
      engine.destroy();
      $engine.set(null);
      if (__DEV__) logger?.info('🏗️ Destroyed HLS engine');
    };
  });

  function attachHLSEventListeners(ctor: HLSConstructor, engine: HLS.default): void {
    engine.on(ctor.Events.ERROR, onError);
    for (const { type, listener, options } of events.listeners) {
      engine[options?.once ? 'once' : 'on'](type, listener, options?.context);
    }
  }

  function onLevelLoaded(eventType: string, data: HLS.LevelLoadedData): void {
    if ($media.canPlay) return;

    const { live, totalduration: duration } = data.details;

    const event = new DOMEvent(eventType, { detail: data });
    const mediaType: MediaType = live ? 'live-video' : 'video';

    dispatchEvent(host.el, 'vds-media-type-change', { detail: mediaType, triggerEvent: event });
    dispatchEvent(host.el, 'vds-duration-change', { detail: duration, triggerEvent: event });

    const engine = $engine()!;
    const media = engine.media!;
    media.dispatchEvent(new DOMEvent<void>('canplay', { triggerEvent: event }));

    if (!$media.autoplay && live && engine.liveSyncPosition) {
      media.currentTime = engine.liveSyncPosition;
    }
  }

  function onError(eventType: string, data: HLS.ErrorData) {
    if (__DEV__) {
      logger
        ?.errorGroup(`HLS error \`${eventType}\``)
        .labelledLog('Video Element', $engine()?.media)
        .labelledLog('HLS Engine', $engine())
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', $media.source)
        .labelledLog('Media', { ...$media })
        .dispatch();
    }

    if (data.fatal) {
      switch (data.type) {
        case 'networkError':
          $engine()?.startLoad();
          break;
        case 'mediaError':
          $engine()?.recoverMediaError();
          break;
        default:
          // We can't recover here - better course of action?
          $engine()?.destroy();
          $engine.set(null);
          break;
      }
    }
  }

  return { $ctor, $engine, $attached, $isHLSSource };
}
