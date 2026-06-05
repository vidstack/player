import {
  createComponent,
  createScope,
  provideContext,
  root,
  signal,
  type Scope,
} from 'maverick.js';
import { vi } from 'vitest';

import { mediaContext, type MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import type { MediaProviderAdapter, MediaProviderLoader } from '../../providers/types';
import { MediaProvider } from './provider';

beforeEach(() => {
  const raf = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }),
    caf = vi.fn();

  vi.stubGlobal('requestAnimationFrame', raf);
  vi.stubGlobal('cancelAnimationFrame', caf);
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );

  window.requestAnimationFrame = raf;
  window.cancelAnimationFrame = caf;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it('defers loading the provider target until connected', async () => {
  const src: Src = { src: 'https://example.com/audio.custom', type: 'application/custom' },
    events: string[] = [],
    adapter = createAdapter(),
    loader = createLoader(adapter),
    media = createMediaContext(src, events);

  adapter.setup.mockImplementation(() => {
    media.notify('provider-setup', adapter);
  });

  let dispose!: () => void;
  const host = document.createElement('div'),
    target = document.createElement('audio'),
    provider = root((disposer) => {
      dispose = disposer;
      provideContext(mediaContext, media);
      return createComponent(MediaProvider, { props: { loaders: [loader] } });
    });

  provider.$$.setup();
  provider.$$.attach(host);
  provider.load(target);

  expect(target.getAttribute('aria-hidden')).to.equal('true');
  expect(loader.load).not.toHaveBeenCalled();
  expect(events).not.toContain('provider-change');

  provider.$$.connect();

  await vi.waitFor(() => {
    expect(loader.load).toHaveBeenCalledOnce();
    expect(adapter.setup).toHaveBeenCalledOnce();
    expect(adapter.loadSource).toHaveBeenCalledWith(src, 'metadata');
  });

  expect(events).toContain('provider-setup');

  dispose();
  adapter.scope.dispose();
});

function createAdapter(): MediaProviderAdapter & {
  scope: Scope;
  setup: ReturnType<typeof vi.fn>;
  loadSource: ReturnType<typeof vi.fn>;
} {
  let currentSrc: Src | null = null;

  const adapter = {
    scope: createScope(),
    type: 'audio',
    get currentSrc() {
      return currentSrc;
    },
    setup: vi.fn(),
    destroy: vi.fn(),
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    setMuted: vi.fn(),
    setCurrentTime: vi.fn(),
    setVolume: vi.fn(),
    loadSource: vi.fn((src: Src) => {
      currentSrc = src;
      return Promise.resolve();
    }),
  } as unknown as MediaProviderAdapter & {
    scope: Scope;
    setup: ReturnType<typeof vi.fn>;
    loadSource: ReturnType<typeof vi.fn>;
  };

  return adapter;
}

function createLoader(adapter: MediaProviderAdapter): MediaProviderLoader {
  return {
    name: 'custom-audio',
    target: null,
    canPlay: vi.fn((src: Src) => src.type === 'application/custom'),
    mediaType: vi.fn(() => 'audio'),
    preconnect: vi.fn(),
    load: vi.fn(async () => adapter),
  };
}

function createMediaContext(src: Src, events: string[]): MediaContext {
  const state = {
    canLoad: signal(true),
    canLoadPoster: signal(false),
    crossOrigin: signal(null),
    currentTime: signal(0),
    inferredViewType: signal('unknown'),
    mediaType: signal('unknown'),
    paused: signal(true),
    poster: signal(''),
    preload: signal('metadata'),
    providedPoster: signal(false),
    quality: signal(null),
    remotePlaybackLoader: signal(null),
    savedState: signal(null),
    source: signal({ src: '', type: '' } as Src),
    sources: signal([] as Src[]),
    started: signal(false),
  };

  const media = {
    $provider: signal(null),
    $providerSetup: signal(false),
    $props: {
      preferNativeHLS: signal(false),
      src: signal(src),
    },
    $state: state,
    audioTracks: [],
    notify(type: string, detail: any) {
      events.push(type);

      switch (type) {
        case 'provider-change':
          media.$provider.set(detail);
          break;
        case 'sources-change':
          state.sources.set(detail);
          break;
        case 'source-change':
          state.source.set(detail);
          break;
        case 'media-type-change':
          state.mediaType.set(detail);
          break;
      }
    },
    player: null,
    qualities: [],
    storage: null,
    textTracks: {
      add: vi.fn(),
      getById: vi.fn(() => null),
      remove: vi.fn(),
    },
  } as unknown as MediaContext;

  return media;
}
