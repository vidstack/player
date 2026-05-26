import { createComponent, provideContext, root, tick } from 'maverick.js';

import { mediaContext } from '../../../core/api/media-context';
import { mediaState } from '../../../core/api/player-state';
import { Thumbnail } from './thumbnail';
import type { ThumbnailImageInit } from './thumbnail-loader';

function setupThumbnail(src: ThumbnailImageInit[], time: number) {
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
      props: { src, time },
    }) as any;

    instance.$$.setup();
    instance.$state.img.set(img);
    instance.$$.attach(rootEl);
    instance.$$.connect();

    return instance;
  }) as any;

  tick();
  img.dispatchEvent(new Event('load'));
  tick();

  return {
    dispose,
    img,
    rootEl,
    thumbnail,
  };
}

describe(Thumbnail.name, function () {
  it('keeps crop styles when switching to a later sprite at a zero offset', function () {
    const thumbnails: ThumbnailImageInit[] = [
      {
        url: 'https://cdn.example.com/seek/_0.jpg',
        startTime: 68.497,
        width: 300,
        height: 168.75,
        coords: { x: 1500, y: 843.75 },
      },
      {
        url: 'https://cdn.example.com/seek/_1.jpg',
        startTime: 70.454,
        width: 300,
        height: 168.75,
        coords: { x: 0, y: 0 },
      },
    ];

    const { dispose, img, rootEl, thumbnail } = setupThumbnail(thumbnails, 68.497);

    try {
      expect(thumbnail.$state.src()).to.equal('https://cdn.example.com/seek/_0.jpg');
      expect(img.style.transform).to.equal('translate(-1500px, -843.75px)');

      thumbnail.$props.time.set(70.454);
      tick();

      expect(thumbnail.$state.src()).to.equal('https://cdn.example.com/seek/_1.jpg');
      expect(thumbnail.$state.activeThumbnail()?.coords).to.deep.equal({ x: 0, y: 0 });
      expect(rootEl.style.getPropertyValue('--thumbnail-width')).to.equal('300px');
      expect(rootEl.style.getPropertyValue('--thumbnail-height')).to.equal('168.75px');
      expect(img.style.transform).to.equal('translate(-0px, -0px)');
    } finally {
      dispose();
    }
  });
});
