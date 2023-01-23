import type * as HLS from 'hls.js';
import { effect, ReadSignal, signal, Signals } from 'maverick.js';
import type { CustomElementHost } from 'maverick.js/element';
import { dispatchEvent, DOMEvent } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES } from '../../../utils/mime';
import type { MediaControllerDelegate } from '../../media/element/controller/controller-delegate';
import type { MediaStore } from '../../media/store';
import type { MediaType } from '../../media/types';
import { loadHLSLibrary } from './loader';
import type { HLSConstructor, HLSProviderProps, HLSVideoElement } from './types';
import { useHLSAttach } from './use-hls-attach';
import { useHLSEvents } from './use-hls-events';

export function useHLSEngine(
  host: CustomElementHost<HLSVideoElement>,
  $media: MediaStore,
  $canLoadLib: ReadSignal<boolean>,
  delegate: MediaControllerDelegate,
  { $library, $config }: Signals<HLSProviderProps>,
) {
  const $isHLSSource = () =>
    HLS_VIDEO_TYPES.has($media.source.type!) || HLS_VIDEO_EXTENSIONS.test($media.source.src);

  const $ctor = signal<HLSConstructor | null>(null),
    $engine = signal<HLS.default | null>(null),
    $attached = useHLSAttach($ctor, host.$el, $engine, $isHLSSource, $media, onLevelLoaded),
    logger = __DEV__ ? useLogger(host.$el) : undefined;

  useHLSEvents(host, $ctor, $engine);

  // Load HLS library
  effect(() => {
    if (!$canLoadLib()) return;
    const lib = $library();
    loadHLSLibrary(host.el!, lib, delegate, logger).then((ctor) => {
      if ($library() !== lib) return;
      $ctor.set(() => ctor);
    });
  });

  // Create `hls.js` engine and attach listeners
  effect(() => {
    const ctor = $ctor(),
      video = host.$el()?.mediaElement;

    if (!ctor || !video || !$canLoadLib()) return;

    const engine = new ctor($config());
    engine.on(ctor.Events.ERROR, onError);
    $engine.set(engine);
    dispatchEvent(host.el, 'instance', { detail: engine });

    return () => {
      engine.destroy();
      $engine.set(null);
      if (__DEV__) logger?.info('🏗️ Destroyed HLS engine');
    };
  });

  function onLevelLoaded(eventType: string, data: HLS.LevelLoadedData): void {
    if ($media.canPlay) return;

    const { live, totalduration: duration } = data.details;

    const event = new DOMEvent(eventType, { detail: data });
    const mediaType: MediaType = live ? 'live-video' : 'video';

    delegate.dispatch('media-change', { detail: mediaType, trigger: event });
    delegate.dispatch('duration-change', { detail: duration, trigger: event });

    const engine = $engine()!;
    const media = engine.media!;
    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger: event }));

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

  return {
    $ctor,
    $engine,
    $attached,
    $isHLSSource,
  };
}
