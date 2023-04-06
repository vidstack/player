import type * as HLS from 'hls.js';
import { effect, peek } from 'maverick.js';
import { camelToKebabCase, dispatchEvent, DOMEvent } from 'maverick.js/std';

import { createRAFLoop } from '../../../../foundation/hooks/raf-loop';
import { LIST_ADD, LIST_SELECT } from '../../../../foundation/list/symbols';
import { ENABLE_AUTO_QUALITY, SET_AUTO_QUALITY } from '../../quality/symbols';
import { TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_READY_STATE } from '../../tracks/text/symbols';
import { TextTrack } from '../../tracks/text/text-track';
import type { MediaSetupContext } from '../types';
import type { HLSProvider } from './provider';
import type { HLSInstanceCallback } from './types';

const toDOMEventType = (type: string) => camelToKebabCase(type);

export function setupHLS(
  provider: HLSProvider,
  { player, logger, delegate, $store, qualities, audioTracks, textTracks }: MediaSetupContext,
  callbacks: Set<HLSInstanceCallback>,
) {
  // Create `hls.js` instance and attach listeners
  effect(() => {
    const ctor = provider.$ctor();
    if (!ctor) return;

    const isLive = peek(() => $store.streamType).includes('live'),
      isLiveLowLatency = peek(() => $store.streamType).includes('ll-');

    const instance = new ctor({
      lowLatencyMode: isLiveLowLatency,
      backBufferLength: isLiveLowLatency ? 4 : isLive ? 8 : undefined,
      renderTextTracksNatively: false,
      ...provider.config,
    });

    for (const event of Object.values(ctor.Events)) instance.on(event, dispatchHLSEvent);

    instance.on(ctor.Events.ERROR, onError);
    provider.$instance.set(instance);
    for (const callback of callbacks) callback(instance);
    dispatchEvent(player, 'hls-instance', { detail: instance });

    instance.attachMedia(provider.media);
    instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, onAudioTrackSwitched);
    instance.on(ctor.Events.LEVEL_SWITCHED, onLevelSwitched);
    instance.on(ctor.Events.LEVEL_LOADED, onLevelLoaded);

    instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, (eventType, data) => {
      const event = new DOMEvent<HLS.NonNativeTextTracksData>(eventType, { detail: data });

      let currentTrack = -1;
      for (let i = 0; i < data.tracks.length; i++) {
        const nonNativeTrack = data.tracks[i],
          init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions,
          track = new TextTrack({
            id: `hls-${nonNativeTrack!.kind}${i}`,
            src: init?.url,
            label: nonNativeTrack!.label,
            language: init?.lang,
            kind: nonNativeTrack!.kind as TextTrackKind,
          });

        track[TEXT_TRACK_READY_STATE] = 2;
        track[TEXT_TRACK_ON_MODE_CHANGE] = () => {
          if (track.mode === 'showing') {
            instance.subtitleTrack = i;
            currentTrack = i;
          } else if (currentTrack === i) {
            instance.subtitleTrack = -1;
            currentTrack = -1;
          }
        };

        if (nonNativeTrack.default) track.mode = 'showing';
        textTracks.add(track, event);
      }
    });

    instance.on(ctor.Events.CUES_PARSED, (eventType, data) => {
      const track = textTracks.getById(`hls-${data.track}`);
      if (!track) return;
      const event = new DOMEvent<HLS.CuesParsedData>(eventType, { detail: data });
      for (const cue of data.cues) {
        cue.positionAlign = 'auto';
        track.addCue(cue, event);
      }
    });

    qualities[ENABLE_AUTO_QUALITY] = () => {
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
      qualities[ENABLE_AUTO_QUALITY] = undefined;
      instance.destroy();
      provider.$instance.set(null);
      if (__DEV__) logger?.info('🏗️ Destroyed HLS instance');
    };
  });

  effect(() => {
    if (!$store.live) return;

    const instance = provider.$instance()!;
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

  function onAudioTrackSwitched(eventType: string, data: HLS.AudioTrackSwitchedData) {
    const track = audioTracks[data.id];
    if (track) {
      audioTracks[LIST_SELECT](track, true, new DOMEvent(eventType, { detail: data }));
    }
  }

  function onLevelSwitched(eventType: string, data: HLS.LevelSwitchedData) {
    const quality = qualities[data.level];
    if (quality) {
      qualities[LIST_SELECT](quality, true, new DOMEvent(eventType, { detail: data }));
    }
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

    const instance = provider.instance!;
    const media = instance.media!;

    if (instance.currentLevel === -1) {
      qualities[SET_AUTO_QUALITY](true, event);
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
        .labelledLog('Media Element', provider.instance?.media)
        .labelledLog('HLS Instance', provider.instance)
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', $store.source)
        .labelledLog('Media Store', { ...$store })
        .dispatch();
    }

    if (data.fatal) {
      switch (data.type) {
        case 'networkError':
          provider.instance?.startLoad();
          break;
        case 'mediaError':
          provider.instance?.recoverMediaError();
          break;
        default:
          // We can't recover here - better course of action?
          provider.instance?.destroy();
          provider.$instance.set(null);
          break;
      }
    }
  }
}
