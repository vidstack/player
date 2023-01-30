import { provideContext, signal, Signals } from 'maverick.js';

import { useLogger } from '../../../foundation/logger/logger';
import type { MediaPlayerElement } from '../../element/types';
import { mediaContext, MediaContext } from '../context';
import type { MediaProviderLoader } from '../providers/types';
import { mediaStore } from '../store';
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
  } as MediaContext;

  provideContext(mediaContext, context);

  if (__DEV__) {
    context.logger = useLogger(context.$player);
  }

  const requests = new MediaRequestContext(),
    stateManager = createMediaStateManager(context, requests),
    requestManager = createMediaRequestManager(context, stateManager, requests, props),
    delegate = createMediaControllerDelegate(context, stateManager.handle),
    providerDelegate = useMediaProviderDelegate(context, requestManager, props);

  context.delegate = delegate;

  // init
  for (const prop of Object.keys(props)) {
    const propName = prop.slice(1);
    if (propName in context.$store) context.$store[propName] = props[prop]();
  }

  context.$store.muted = props.$muted() || props.$volume() === 0;
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
