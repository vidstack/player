import { createComponent, provideContext, root, tick } from 'maverick.js';
import { vi } from 'vitest';

import { mediaContext } from '../../../core/api/media-context';
import { mediaState } from '../../../core/api/player-state';
import { Thumbnail } from './thumbnail';

function setupThumbnail(src: string, crossOrigin: 'anonymous' | 'use-credentials' | null = null) {
  let dispose!: () => void;

  const $state = mediaState.create();
  $state.canLoad.set(true);
  $state.providedDuration.set(120);
  $state.crossOrigin.set(crossOrigin);

  const rootEl = document.createElement('div');

  const thumbnail = root((stop) => {
    dispose = stop;
    provideContext(mediaContext, { $state } as any);

    const instance = createComponent(Thumbnail, {
      props: { src, time: 0 },
    }) as any;

    instance.$$.setup();
    instance.$$.attach(rootEl);
    instance.$$.connect();

    return instance;
  }) as any;

  tick();

  return { dispose, thumbnail };
}

describe('Thumbnail cross-origin', function () {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(function () {
    fetchSpy = vi.fn(() =>
      Promise.resolve(new Response('[]', { headers: { 'content-type': 'application/json' } })),
    );

    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(function () {
    vi.unstubAllGlobals();
  });

  it('should request thumbnails once with media cross-origin credentials', function () {
    const src = 'https://cdn.example.com/storyboard-cross-origin.vtt',
      { dispose } = setupThumbnail(src, 'use-credentials');

    try {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(src, { credentials: 'include' });
    } finally {
      dispose();
    }
  });
});
