import { computed, effect, provideContext, ReadSignal, signal, Signals } from 'maverick.js';

import { canFullscreen } from '../../../foundation/fullscreen/fullscreen';
import { useLogger } from '../../../foundation/logger/logger';
import type { MediaPlayerElement } from '../../element/types';
import { mediaContext, MediaContext } from '../context';
import type { MediaProviderLoader } from '../providers/types';
import { VideoQualityList } from '../quality/video-quality';
import { MediaRemoteControl } from '../remote-control';
import { mediaStore } from '../store';
import { AudioTrackList } from '../tracks/audio-tracks';
import { TextRenderers } from '../tracks/text/render/text-renderer';
import { TEXT_TRACK_CAN_LOAD } from '../tracks/text/symbols';
import { TextTrack, TextTrackInit } from '../tracks/text/text-track';
import { TextTrackList } from '../tracks/text/text-tracks';
import { useMediaCanLoad } from './can-load';
import { createMediaControllerDelegate } from './controller-delegate';
import { useMediaEventsLogger } from './events-logger';
import { useMediaPropChange } from './prop-change';
import { useMediaProviderDelegate } from './provider-delegate';
import { createMediaRequestManager, MediaRequestContext } from './request-manager';
import { createMediaStateManager } from './state-manager';
import type { MediaControllerProps } from './types';

export function createMediaController(props: Signals<MediaControllerProps>) {
  const context = {
    $player: signal<MediaPlayerElement | null>(null),
    $loader: signal<MediaProviderLoader | null>(null),
    $provider: signal<MediaProvider | null>(null),
    $store: mediaStore.create(),
    qualities: new VideoQualityList(),
    audioTracks: new AudioTrackList(),
  } as MediaContext;

  provideContext(mediaContext, context);

  if (__DEV__) context.logger = useLogger(context.$player);
  context.remote = new MediaRemoteControl(__DEV__ ? context.logger : undefined);

  const $store = context.$store;

  context.$iosControls = computed(
    () =>
      !canFullscreen() &&
      $store.mediaType === 'video' &&
      $store.controls &&
      (!props.$playsinline() || $store.fullscreen),
  );

  setupTextTracks(props.$textTracks, context);

  const requests = new MediaRequestContext(),
    stateManager = createMediaStateManager(context, requests),
    requestManager = createMediaRequestManager(context, stateManager, requests, props),
    delegate = createMediaControllerDelegate(context, stateManager.handle),
    providerDelegate = useMediaProviderDelegate(context, requestManager, props);

  context.delegate = delegate;

  const providedProps = {
    viewType: 'providedViewType',
    streamType: 'providedStreamType',
  };

  // init
  for (const prop of Object.keys(props)) {
    const propName = prop.slice(1);
    if (propName in $store) $store[providedProps[propName] ?? propName] = props[prop]();
  }

  effect(() => {
    $store.providedViewType = props.$viewType();
    $store.providedStreamType = props.$streamType();
  });

  $store.muted = props.$muted() || props.$volume() === 0;
  useMediaPropChange(context, props);
  useMediaCanLoad(context.$player, props.$load, startLoadingMedia);
  if (__DEV__) useMediaEventsLogger(context, context.logger);

  function startLoadingMedia() {
    delegate.dispatch('can-load');
  }

  return {
    _context: context,
    _start: startLoadingMedia,
    _request: requestManager,
    _provider: providerDelegate,
  };
}

function setupTextTracks(
  $textTracks: ReadSignal<MediaControllerProps['textTracks']>,
  context: MediaContext,
) {
  context.textTracks = new TextTrackList();
  context.textRenderers = new TextRenderers(context);

  const stop = effect(() => {
    if (!context.$store.canLoad) return;
    context.textTracks[TEXT_TRACK_CAN_LOAD]();
    stop();
  });

  let prevTextTracks: (TextTrack | TextTrackInit)[] = [];
  effect(() => {
    context.$store.source;

    const newTracks = $textTracks();
    for (const newTrack of newTracks) {
      const id = newTrack.id ?? TextTrack.createId(newTrack);
      if (!context.textTracks.getById(id)) {
        // @ts-expect-error - override readonly
        newTrack.id = id;
        context.textTracks.add(newTrack);
      }
    }

    for (const oldTrack of prevTextTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && context.textTracks.getById(oldTrack.id);
        if (track) context.textTracks.remove(track);
      }
    }

    prevTextTracks = newTracks;
  });
}
