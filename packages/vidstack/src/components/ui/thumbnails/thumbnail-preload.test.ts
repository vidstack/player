import { createComponent, provideContext, root, tick } from 'maverick.js';
import { vi } from 'vitest';

import { mediaContext } from '../../../core/api/media-context';
import { mediaState } from '../../../core/api/player-state';
import { Thumbnail } from './thumbnail';
import type { ThumbnailImageInit } from './thumbnail-loader';

interface Preload {
  src: string;
  crossOrigin: string | null;
}

let preloads: Preload[];

function setupThumbnail(
  src: ThumbnailImageInit[],
  time: number,
  crossOrigin: 'anonymous' | 'use-credentials' | null = null,
) {
  let dispose!: () => void;

  const $state = mediaState.create();
  $state.canLoad.set(true);
  $state.providedDuration.set(120);

  const rootEl = document.createElement('div'),
    img = document.createElement('img');

  Object.defineProperties(img, {
    naturalWidth: { value: 1800 },
    naturalHeight: { value: 1012.5 },
  });

  const thumbnail = root((stop) => {
    dispose = stop;
    provideContext(mediaContext, { $state } as any);

    const instance = createComponent(Thumbnail, {
      props: { src, time, crossOrigin },
    }) as any;

    instance.$$.setup();
    instance.$state.img.set(img);
    instance.$$.attach(rootEl);
    instance.$$.connect();

    return instance;
  }) as any;

  tick();

  return {
    dispose,
    thumbnail,
  };
}

describe(Thumbnail.name, function () {
  beforeEach(function () {
    preloads = [];

    vi.stubGlobal(
      'Image',
      class {
        crossOrigin: string | null = null;
        decoding = '';
        #src = '';

        get src() {
          return this.#src;
        }

        set src(src: string) {
          this.#src = src;
          preloads.push({ src, crossOrigin: this.crossOrigin });
        }
      },
    );
  });

  afterEach(function () {
    vi.unstubAllGlobals();
  });

  it('preloads upcoming sprites in a bounded window', function () {
    const thumbnails: ThumbnailImageInit[] = [
      {
        url: 'https://sprites.example.test/seek/_0.jpg',
        startTime: 0,
        width: 300,
        height: 168.75,
        coords: { x: 0, y: 0 },
      },
      {
        url: 'https://sprites.example.test/seek/_0.jpg',
        startTime: 10,
        width: 300,
        height: 168.75,
        coords: { x: 300, y: 0 },
      },
      {
        url: 'https://sprites.example.test/seek/_1.jpg',
        startTime: 20,
        width: 300,
        height: 168.75,
        coords: { x: 0, y: 0 },
      },
      {
        url: 'https://sprites.example.test/seek/_1.jpg',
        startTime: 30,
        width: 300,
        height: 168.75,
        coords: { x: 300, y: 0 },
      },
      {
        url: 'https://sprites.example.test/seek/_2.jpg',
        startTime: 40,
        width: 300,
        height: 168.75,
        coords: { x: 0, y: 0 },
      },
      {
        url: 'https://sprites.example.test/seek/_3.jpg',
        startTime: 50,
        width: 300,
        height: 168.75,
        coords: { x: 0, y: 0 },
      },
    ];

    const { dispose, thumbnail } = setupThumbnail(thumbnails, 0, 'use-credentials');

    try {
      expect(preloads).to.deep.equal([
        {
          src: 'https://sprites.example.test/seek/_1.jpg',
          crossOrigin: 'use-credentials',
        },
      ]);

      thumbnail.$props.time.set(10);
      tick();

      expect(preloads).to.have.length(1);

      thumbnail.$props.time.set(20);
      tick();

      expect(preloads).to.deep.equal([
        {
          src: 'https://sprites.example.test/seek/_1.jpg',
          crossOrigin: 'use-credentials',
        },
        {
          src: 'https://sprites.example.test/seek/_2.jpg',
          crossOrigin: 'use-credentials',
        },
      ]);
    } finally {
      dispose();
    }
  });
});
