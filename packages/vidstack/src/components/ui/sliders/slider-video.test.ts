import { createComponent, provideContext, root, tick } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';
import { vi } from 'vitest';

import { mediaContext } from '../../../core/api/media-context';
import { mediaState } from '../../../core/api/player-state';
import { SliderVideo } from './slider-video';
import { Slider } from './slider/slider';

function setupSliderVideo(sameHost = true) {
  let dispose!: () => void;
  const $state = mediaState.create(),
    $slider = Slider.state.create(),
    video = document.createElement('video'),
    host = sameHost ? video : document.createElement('div'),
    errors: DOMEvent[] = [];

  $state.canLoad.set(true);
  $state.providedDuration.set(120);
  if (!sameHost) host.append(video);

  // Bound the pre-fix recursion so the regression fails without overflowing the test runner.
  host.addEventListener(
    'error',
    (event) => {
      if ('trigger' in event) {
        errors.push(event as DOMEvent);
        if (errors.length > 1) event.stopImmediatePropagation();
      }
    },
    { capture: true },
  );

  const preview = root((stop) => {
    dispose = stop;
    provideContext(mediaContext, { $state } as any);
    provideContext(Slider.state, $slider);
    const instance = createComponent(SliderVideo, {
      props: { src: '/preview.mp4' },
    }) as any;
    // Vitest resolves Maverick's node export, where dispatch is a no-op.
    // Reproduce its browser dispatch on the actual host (a video in React).
    vi.spyOn(instance, 'dispatch').mockImplementation((type, init) => {
      const event = new Event(type as string);
      Object.defineProperties(event, {
        target: { get: () => instance },
        trigger: { value: (init as { trigger?: Event })?.trigger },
      });
      return host.dispatchEvent(event);
    });
    instance.$$.setup();
    instance.$state.video.set(video);
    instance.$$.attach(host);
    instance.$$.connect();
    return instance;
  }) as any;
  tick();
  return { preview, host, video, errors, $slider, dispose };
}

describe(SliderVideo.name, function () {
  it('does not mark a valid, loaded preview as errored or hidden', function () {
    const { video, preview, dispose } = setupSliderVideo();
    try {
      video.dispatchEvent(new Event('canplay'));
      tick();
      expect(preview.$state.canPlay()).to.be.true;
      expect(preview.$state.hidden()).to.be.false;
      expect(preview.$$.attrs['data-error']()).to.be.false;
      expect(preview.$$.attrs['data-loading']()).to.be.false;
    } finally {
      dispose();
    }
  });

  for (const sameHost of [true, false]) {
    it(`dispatches one error when video ${sameHost ? 'is' : 'is inside'} the host`, function () {
      const { video, preview, errors, dispose } = setupSliderVideo(sameHost);
      try {
        const error = new Event('error');
        video.dispatchEvent(error);
        tick();
        expect(errors).to.have.length(1);
        expect(errors[0].trigger).to.equal(error);
        expect(preview.$state.error()).to.equal(error);
        expect(preview.$state.canPlay()).to.be.false;
        expect(preview.$$.attrs['data-error']()).to.be.true;
        expect(preview.$state.hidden()).to.be.true;
      } finally {
        dispose();
      }
    });
  }

  it('clears an error and restores the preview after the source changes', function () {
    const { video, preview, dispose } = setupSliderVideo(false);
    try {
      video.dispatchEvent(new Event('error'));
      tick();
      preview.$props.src.set('/replacement.mp4');
      tick();
      expect(preview.$state.error()).to.equal(null);
      expect(preview.$$.attrs['data-error']()).to.be.false;
      expect(preview.$state.hidden()).to.be.false;
      expect(preview.$$.attrs['data-loading']()).to.be.true;
      video.dispatchEvent(new Event('canplay'));
      tick();
      expect(preview.$$.attrs['data-loading']()).to.be.false;
    } finally {
      dispose();
    }
  });

  it('keeps seeking the preview to the slider pointer position', function () {
    const { video, $slider, dispose } = setupSliderVideo();
    try {
      $slider.pointerValue.set(25);
      video.dispatchEvent(new Event('canplay'));
      tick();
      expect(video.currentTime).to.equal(30);
      $slider.pointerValue.set(75);
      tick();
      expect(video.currentTime).to.equal(90);
    } finally {
      dispose();
    }
  });
});
