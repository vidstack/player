import { elementUpdated, expect, fixture, oneEvent } from '@open-wc/testing';
import { mock, spy, stub, useFakeTimers } from 'sinon';

import { safelyDefineCustomElement } from '../../../utils/dom';
import { keysOf } from '../../../utils/object';
import { equal, isFunction } from '../../../utils/unit';
import { CanPlay } from '../../CanPlay';
import { mediaContext, MediaContextRecord } from '../../MediaContext';
import {
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
} from '../../test-utils';
import { ViewType } from '../../ViewType';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../MediaProviderElement';

safelyDefineCustomElement(
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
);

describe('MediaProviderElement', function () {
  async function buildFixture() {
    const provider = await fixture<FakeMediaProviderElement>(
      `<vds-fake-media-provider></vds-fake-media-provider>`
    );

    return { provider };
  }

  describe('render', function () {
    test('it should render DOM correctly', async function () {
      const { provider } = await buildFixture();
      expect(provider).dom.to.equal(`
        <vds-fake-media-provider></vds-fake-media-provider>
      `);
    });

    test('it should render shadow DOM correctly', async function () {
      const { provider } = await buildFixture();
      expect(provider).shadowDom.to.equal('');
    });
  });

  describe('lifecycle', function () {
    test('it should dispatch connect event when connected to DOM', async function () {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } = (await oneEvent(
        document,
        'vds-media-provider-connect'
      )) as MediaProviderConnectEvent;

      expect(detail.element).to.be.instanceOf(MediaProviderElement);
      expect(isFunction(detail.onDisconnect)).to.be.true;
    });

    test('it should dispose of disconnect callbacks when disconnected from DOM', async function () {
      const provider = document.createElement('vds-fake-media-provider');

      setTimeout(() => {
        window.document.body.append(provider);
      });

      const { detail } = (await oneEvent(
        document,
        'vds-media-provider-connect'
      )) as MediaProviderConnectEvent;

      const callback = mock();
      detail.onDisconnect(callback);

      provider.remove();
      expect(callback).to.have.been.calledOnce;
    });
  });

  describe('props', function () {
    test('it should update provider when volume is set', async function () {
      const { provider } = await buildFixture();
      const volume = 0.75;
      const volumeSpy = spy(provider, '_setVolume');
      provider.mediaRequestQueue.start();
      provider.volume = volume;
      expect(volumeSpy).to.have.been.calledWith(volume);
    });

    test('it should update provider when currentTime is set', async function () {
      const { provider } = await buildFixture();
      const currentTime = 420;
      const currentTimeSpy = spy(provider, '_setCurrentTime');
      provider.mediaRequestQueue.start();
      provider.currentTime = currentTime;
      expect(currentTimeSpy).to.have.been.calledWith(currentTime);
    });

    test('it should update provider when paused is set', async function () {
      const { provider } = await buildFixture();
      const playSpy = spy(provider, 'play');
      const pauseSpy = spy(provider, 'pause');
      provider.mediaRequestQueue.start();
      provider.paused = false;
      expect(playSpy).to.have.been.calledOnce;
      provider.paused = true;
      expect(pauseSpy).to.have.been.calledOnce;
    });

    test('it should update provider when muted is set', async function () {
      const { provider } = await buildFixture();
      const mutedSpy = spy(provider, '_setMuted');
      provider.mediaRequestQueue.start();
      provider.muted = true;
      expect(mutedSpy).to.have.been.calledWith(true);
    });
  });

  describe('methods', function () {
    describe('shouldPlayType', function () {
      it('shoudPlayType should return false given canPlay is no', async function () {
        const { provider } = await buildFixture();
        stub(provider, 'canPlayType').callsFake(() => CanPlay.No);
        expect(provider.shouldPlayType('')).to.be.false;
      });

      it('shoudPlayType should return true given canPlay is maybe', async function () {
        const { provider } = await buildFixture();
        stub(provider, 'canPlayType').callsFake(() => CanPlay.Maybe);
        expect(provider.shouldPlayType('')).to.be.true;
      });

      it('shoudPlayType should return true given canPlay is probably', async function () {
        const { provider } = await buildFixture();
        stub(provider, 'canPlayType').callsFake(() => CanPlay.Probably);
        expect(provider.shouldPlayType('')).to.be.true;
      });
    });

    describe('throwIfNotReadyForPlayback', function () {
      test('it should throw if not ready', async function () {
        const { provider } = await buildFixture();
        provider.ctx.canPlay = false;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotReadyForPlayback();
        }).to.throw();
      });

      test('it should not throw if ready', async function () {
        const { provider } = await buildFixture();
        provider.ctx.canPlay = true;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotReadyForPlayback();
        }).to.not.throw();
      });
    });

    describe('resetPlayback', function () {
      test('it should set currentTime to 0', async function () {
        const { provider } = await buildFixture();

        const setTimeSpy = spy(provider, '_setCurrentTime');

        // @ts-expect-error Accessing protected property
        provider._resetPlayback();

        expect(setTimeSpy).to.have.been.calledOnceWith(0);
      });
    });

    describe('throwIfNotVideoView', function () {
      test('it should throw if view type is not video', async function () {
        const { provider } = await buildFixture();

        provider.ctx.viewType = ViewType.Unknown;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotVideoView();
        }).to.throw();

        provider.ctx.viewType = ViewType.Audio;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotVideoView();
        }).to.throw();
      });

      test('it should NOT throw if view type is of type video', async function () {
        const { provider } = await buildFixture();

        provider.ctx.viewType = ViewType.Video;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotVideoView();
        }).to.not.throw();
      });
    });

    describe('attemptAutoplay', function () {
      test('it should not call play if autoplay is false', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = false;
        provider.ctx.canPlay = true;

        const playSpy = spy(provider, 'play');

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy).to.not.have.been.called;
      });

      test('it should not call play if not ready for playback', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = true;
        provider.ctx.canPlay = false;

        const playSpy = spy(provider, 'play');

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy).to.not.have.been.called;
      });

      test('it should not call play if playback has started', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = true;
        provider.ctx.canPlay = true;
        provider.ctx.started = true;

        const playSpy = spy(provider, 'play');

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy).to.not.have.been.called;
      });

      test('it should not call play if reached max attempts', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = true;
        provider.ctx.canPlay = true;

        // @ts-expect-error Accessing protected properties
        provider._autoplayRetryCount = provider._maxAutoplayRetries;

        const playSpy = spy(provider, 'play');

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy).to.not.have.been.called;
      });

      test('it should not retry if successful', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = true;
        provider.ctx.canPlay = true;

        const playSpy = spy(provider, 'play');

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy).to.have.been.calledOnce;

        // @ts-expect-error Accessing protected property
        expect(provider._autoplayRetryCount).to.equal(0);
      });

      test('it should give up after 2 attempts', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = true;
        provider.ctx.canPlay = true;

        const playSpy = stub(provider, 'play');

        playSpy.callsFake(() => {
          throw Error('');
        });

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy.getCalls()).to.have.length(2);
      });

      test('it should try muted on last attempt', async function () {
        const { provider } = await buildFixture();

        provider.autoplay = true;
        provider.ctx.canPlay = true;

        // @ts-expect-error Accessing protected properties
        provider._autoplayRetryCount = provider._maxAutoplayRetries - 1;

        const playSpy = stub(provider, 'play');
        playSpy.callsFake(() => {
          throw Error('');
        });

        const mutedSpy = spy(provider, '_setMuted');

        // @ts-expect-error Accessing protected property
        await provider._attemptAutoplay();

        expect(playSpy.getCalls()).to.have.length(1);
        expect(mutedSpy).to.have.been.calledOnceWith(true);
      });
    });
  });

  describe('queue', function () {
    test('it should queue request given provider is not ready and flush once ready', async function () {
      const { provider } = await buildFixture();

      const volumeSpy = spy(provider, '_setVolume');

      // Queue.
      provider.volume = 0.53;
      expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);

      // Flush.
      await provider.mediaRequestQueue.start();

      // Check.
      expect(provider.mediaRequestQueue.size, 'new queue size').to.equal(0);
      expect(volumeSpy).to.have.been.calledWith(0.53);
    });

    test('it should make request immediately if provider is ready', async function () {
      const { provider } = await buildFixture();

      const volumeSpy = spy(provider, '_setVolume');

      provider.mediaRequestQueue.start();

      provider.volume = 0.53;

      await elementUpdated(provider);

      expect(provider.mediaRequestQueue.size, 'queue size').to.equal(0);
      expect(volumeSpy).to.have.been.calledWith(0.53);
    });

    test('it should overwrite request keys and only call once per "type"', async function () {
      const { provider } = await buildFixture();

      const playSpy = spy(provider, 'play');
      const pauseSpy = spy(provider, 'pause');

      provider.paused = false;

      setTimeout(() => {
        provider.paused = true;
        expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);
        provider.mediaRequestQueue.start();
      });

      await provider.mediaRequestQueue.waitForFlush();

      expect(playSpy).to.not.have.been.called;
      expect(pauseSpy).to.have.been.calledOnce;
    });
  });
});
