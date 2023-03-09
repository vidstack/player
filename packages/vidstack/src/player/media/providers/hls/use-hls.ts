import type * as HLS from 'hls.js';
import { effect, peek, ReadSignal, WriteSignal } from 'maverick.js';
import { camelToKebabCase, dispatchEvent, DOMEvent, kebabToCamelCase } from 'maverick.js/std';

import { createRAFLoop } from '../../../../foundation/hooks/raf-loop';
import {
  LIST_ADD,
  LIST_AUTO_SELECT,
  LIST_SET_AUTO,
  LIST_SET_SELECTED,
} from '../../../../foundation/list/symbols';
import { HLS_LISTENERS } from '../../../element/element';
import type { MediaSetupContext } from '../types';
import type { HLSProvider } from './provider';
import type { HLSConstructor, HLSInstanceCallback } from './types';

const toDOMEventType = (type: string) => camelToKebabCase(type);
const toHLSEventType = (type: string) => kebabToCamelCase(type) as HLS.Events;

export function useHLS(
  provider: HLSProvider,
  config: Partial<HLS.HlsConfig>,
  $ctor: ReadSignal<HLSConstructor | null>,
  $instance: WriteSignal<HLS.default | null>,
  { player, logger, delegate, $store, qualities, audioTracks }: MediaSetupContext,
  callbacks: Set<HLSInstanceCallback>,
) {
  const listening = new Set<string>();

  // Create `hls.js` instance and attach listeners
  effect(() => {
    const ctor = $ctor();
    if (!ctor) return;

    const isLowLatencyStream = peek(() => $store.streamType).includes('ll-');

    const instance = new ctor({
      lowLatencyMode: isLowLatencyStream,
      ...config,
    });

    effect(() => void attachEventListeners(instance, player[HLS_LISTENERS]()));
    instance.on(ctor.Events.ERROR, onError);
    $instance.set(instance);
    for (const callback of callbacks) callback(instance);
    dispatchEvent(player, 'hls-instance', { detail: instance });

    instance.attachMedia(provider.media);
    instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, onAudioTrackSwitched);
    instance.on(ctor.Events.LEVEL_SWITCHED, onLevelSwitched);
    instance.on(ctor.Events.LEVEL_LOADED, onLevelLoaded);

    qualities[LIST_AUTO_SELECT] = () => {
      instance.currentLevel = -1;
    };

    qualities.addEventListener('change', () => {
      if (qualities.auto) return;
      instance[qualities.switch + 'Level'] = qualities.selectedIndex;
    });

    audioTracks.addEventListener('change', () => {
      instance.audioTrack = audioTracks.selectedIndex;
    });

    delegate.dispatch('provider-setup', { detail: provider });

    return () => {
      qualities[LIST_AUTO_SELECT] = undefined;
      listening.clear();
      instance.destroy();
      $instance.set(null);
      if (__DEV__) logger?.info('🏗️ Destroyed HLS instance');
    };
  });

  effect(() => {
    if (!$store.live) return;

    const instance = $instance()!;
    if (!instance) return;

    const rafLoop = createRAFLoop(() => {
      $store.liveSyncPosition = instance.liveSyncPosition ?? Infinity;
    });

    rafLoop.start();
    return rafLoop.stop;
  });

  function dispatchHLSEvent(eventType: string, detail: any) {
    player.dispatchEvent(new DOMEvent(toDOMEventType(eventType), { detail }));
  }

  function attachEventListeners(instance: HLS.default, listeners: string[]) {
    for (const type of listeners) {
      if (!listening.has(type)) {
        instance.on(toHLSEventType(type), dispatchHLSEvent);
        listening.add(type);
      }
    }
  }

  function onAudioTrackSwitched(eventType: string, data: HLS.AudioTrackSwitchedData) {
    audioTracks[LIST_SET_SELECTED](
      audioTracks.at(data.id)!,
      true,
      new DOMEvent(eventType, { detail: data }),
    );
  }

  function onLevelSwitched(eventType: string, data: HLS.LevelSwitchedData) {
    qualities[LIST_SET_SELECTED](
      qualities.at(data.level)!,
      true,
      new DOMEvent(eventType, { detail: data }),
    );
  }

  function onLevelLoaded(eventType: string, data: HLS.LevelLoadedData): void {
    if ($store.canPlay) return;

    const { type, live, totalduration: duration } = data.details;
    const event = new DOMEvent(eventType, { detail: data });

    delegate.dispatch('stream-type-change', {
      detail: live
        ? type === 'EVENT' && Number.isFinite(duration)
          ? 'live:dvr'
          : 'live'
        : 'on-demand',
      trigger: event,
    });

    delegate.dispatch('duration-change', { detail: duration, trigger: event });

    const instance = $instance()!;
    const media = instance.media!;

    if (instance.currentLevel === -1) {
      qualities[LIST_SET_AUTO](true, event);
    }

    for (const track of instance.audioTracks) {
      audioTracks[LIST_ADD](
        {
          id: track.id + '',
          label: track.name,
          language: track.lang || '',
          kind: 'main',
        },
        event,
      );
    }

    for (const level of instance.levels) {
      qualities[LIST_ADD](
        {
          width: level.width,
          height: level.height,
          codec: level.codecSet,
          bitrate: level.bitrate,
        },
        event,
      );
    }

    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger: event }));
  }

  function onError(eventType: string, data: HLS.ErrorData) {
    if (__DEV__) {
      logger
        ?.errorGroup(`HLS error \`${eventType}\``)
        .labelledLog('Media Element', $instance()?.media)
        .labelledLog('HLS Instance', $instance())
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', $store.source)
        .labelledLog('Media Store', { ...$store })
        .dispatch();
    }

    if (data.fatal) {
      switch (data.type) {
        case 'networkError':
          $instance()?.startLoad();
          break;
        case 'mediaError':
          $instance()?.recoverMediaError();
          break;
        default:
          // We can't recover here - better course of action?
          $instance()?.destroy();
          $instance.set(null);
          break;
      }
    }
  }
}
