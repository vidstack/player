import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { mock, spy, stub } from 'sinon';

import { keysOf } from '../../../utils/object';
import { equal, isFunction } from '../../../utils/unit';
import { CanPlay } from '../../CanPlay';
import { mediaContext } from '../../context';
import { buildMediaFixture } from '../../test-utils';
import { ViewType } from '../../ViewType';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../MediaProviderElement';

describe('MediaProviderElement', function () {
  describe('render', function () {
    it('should render DOM correctly', async function () {
      const { provider } = await buildMediaFixture();
      expect(provider).dom.to.equal(`
        <vds-fake-media-provider></vds-fake-media-provider>
      `);
    });

    it('should render shadow DOM correctly', async function () {
      const { provider } = await buildMediaFixture();
      expect(provider).shadowDom.to.equal('');
    });
  });

  describe('lifecycle', function () {
    it('should dispatch connect event when connected to DOM', async function () {
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

    it('should dispose of disconnect callbacks when disconnected from DOM', async function () {
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
    it('should have defined all ctx props', async function () {
      const { provider } = await buildMediaFixture();

      const ignore = new Set<keyof typeof mediaContext>([
        'canRequestFullscreen'
      ]);

      keysOf(mediaContext).forEach((prop) => {
        if (ignore.has(prop)) return;

        expect(equal(provider.ctx[prop], mediaContext[prop].initialValue), prop)
          .to.be.true;
      });
    });

    it('should have defined ctx props as provider props', async function () {
      const { provider } = await buildMediaFixture();

      const ignore = new Set<keyof typeof mediaContext>([
        'canRequestFullscreen',
        'bufferedAmount',
        'seekableAmount',
        'customControls',
        'idle',
        'isAudio',
        'isVideo',
        'isLiveVideo',
        'isAudioView',
        'isVideoView'
      ]);

      keysOf(mediaContext).forEach((prop) => {
        if (ignore.has(prop)) return;

        expect(equal(provider[prop], mediaContext[prop].initialValue), prop).to
          .be.true;
      });
    });

    it('should update provider when volume is set', async function () {
      const { provider } = await buildMediaFixture();
      const volume = 0.75;
      const volumeSpy = spy(provider, '_setVolume');
      provider.mediaRequestQueue.serveImmediately = true;
      provider.volume = volume;
      expect(volumeSpy).to.have.been.calledWith(volume);
    });

    it('should update provider when currentTime is set', async function () {
      const { provider } = await buildMediaFixture();
      const currentTime = 420;
      const currentTimeSpy = spy(provider, '_setCurrentTime');
      provider.mediaRequestQueue.serveImmediately = true;
      provider.currentTime = currentTime;
      expect(currentTimeSpy).to.have.been.calledWith(currentTime);
    });

    it('should update provider when paused is set', async function () {
      const { provider } = await buildMediaFixture();
      const playSpy = spy(provider, 'play');
      const pauseSpy = spy(provider, 'pause');
      provider.mediaRequestQueue.serveImmediately = true;
      provider.paused = false;
      expect(playSpy).to.have.been.calledOnce;
      provider.paused = true;
      expect(pauseSpy).to.have.been.calledOnce;
    });

    it('should update provider when muted is set', async function () {
      const { provider } = await buildMediaFixture();
      const mutedSpy = spy(provider, '_setMuted');
      provider.mediaRequestQueue.serveImmediately = true;
      provider.muted = true;
      expect(mutedSpy).to.have.been.calledWith(true);
    });
  });

  describe('methods', function () {
    describe('shouldPlayType', function () {
      it('shoudPlayType should return false given canPlay is no', async function () {
        const { provider } = await buildMediaFixture();
        stub(provider, 'canPlayType').callsFake(() => CanPlay.No);
        expect(provider.shouldPlayType('')).to.be.false;
      });

      it('shoudPlayType should return true given canPlay is maybe', async function () {
        const { provider } = await buildMediaFixture();
        stub(provider, 'canPlayType').callsFake(() => CanPlay.Maybe);
        expect(provider.shouldPlayType('')).to.be.true;
      });

      it('shoudPlayType should return true given canPlay is probably', async function () {
        const { provider } = await buildMediaFixture();
        stub(provider, 'canPlayType').callsFake(() => CanPlay.Probably);
        expect(provider.shouldPlayType('')).to.be.true;
      });
    });

    describe('throwIfNotReadyForPlayback', function () {
      it('should throw if not ready', async function () {
        const { provider } = await buildMediaFixture();
        provider.ctx.canPlay = false;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotReadyForPlayback();
        }).to.throw();
      });

      it('should not throw if ready', async function () {
        const { provider } = await buildMediaFixture();
        provider.ctx.canPlay = true;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotReadyForPlayback();
        }).to.not.throw();
      });
    });

    describe('hasPlaybackRoughlyEnded', function () {
      it('should return false if duration is NaN or 0', async function () {
        const { provider } = await buildMediaFixture();

        provider.ctx.duration = NaN;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.false;

        provider.ctx.duration = 0;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.false;
      });

      it('should return true if currentTime is <= .1s near duration', async function () {
        const { provider } = await buildMediaFixture();

        provider.forceMediaReady();

        provider.ctx.currentTime = 8.99;
        provider.ctx.duration = 10;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.false;

        provider.ctx.currentTime = 9.5;
        provider.ctx.duration = 10;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.false;

        provider.ctx.currentTime = 9.89;
        provider.ctx.duration = 9.9;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.true;

        provider.ctx.currentTime = 9.9;
        provider.ctx.duration = 10;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.true;

        provider.ctx.currentTime = 9.95;
        provider.ctx.duration = 9.9;
        // @ts-expect-error Accessing protected property
        expect(provider._hasPlaybackRoughlyEnded()).to.be.true;
      });
    });

    describe('validatePlaybackEndedState', function () {
      it('should set ended to true if playback has roughly ended', async function () {
        const { provider } = await buildMediaFixture();

        provider.ctx.ended = true;
        expect(provider.ended).to.be.true;

        // @ts-expect-error Accessing protected property
        stub(provider, '_hasPlaybackRoughlyEnded').callsFake(() => false);

        // @ts-expect-error Accessing protected property
        provider._validatePlaybackEndedState();

        expect(provider.ended).to.be.false;
      });

      it('should set ended to false if playback has NOT roughly ended', async function () {
        const { provider } = await buildMediaFixture();

        provider.ctx.ended = false;
        provider.ctx.waiting = true;

        expect(provider.ended).to.be.false;
        expect(provider.waiting).to.be.true;

        // @ts-expect-error Accessing protected property
        stub(provider, '_hasPlaybackRoughlyEnded').callsFake(() => true);

        // @ts-expect-error Accessing protected property
        provider._validatePlaybackEndedState();

        expect(provider.ended).to.be.true;
        expect(provider.waiting).to.be.false;
      });
    });

    describe('resetPlayback', function () {
      it('should set currentTime to 0', async function () {
        const { provider } = await buildMediaFixture();

        const setTimeSpy = spy(provider, '_setCurrentTime');

        // @ts-expect-error Accessing protected property
        provider._resetPlayback();

        expect(setTimeSpy).to.have.been.calledOnceWith(0);
      });
    });

    describe('resetPlaybackIfEnded', function () {
      it('should set currentTime to 0 if playback has roughly ended', async function () {
        const { provider } = await buildMediaFixture();

        const setTimeSpy = spy(provider, '_setCurrentTime');

        // @ts-expect-error Accessing protected property
        stub(provider, '_hasPlaybackRoughlyEnded').callsFake(() => true);

        // @ts-expect-error Accessing protected property
        provider._resetPlaybackIfEnded();

        expect(setTimeSpy).to.have.been.calledOnceWith(0);
      });

      it('should NOT set currentTime to 0 if playback has NOT roughly ended', async function () {
        const { provider } = await buildMediaFixture();

        const setTimeSpy = spy(provider, '_setCurrentTime');

        // @ts-expect-error Accessing protected property
        stub(provider, '_hasPlaybackRoughlyEnded').callsFake(() => false);

        // @ts-expect-error Accessing protected property
        provider._resetPlaybackIfEnded();

        expect(setTimeSpy).to.not.have.been.called;
      });
    });

    describe('throwIfNotVideoView', function () {
      it('should throw if view type is not video', async function () {
        const { provider } = await buildMediaFixture();

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

      it('should NOT throw if view type is of type video', async function () {
        const { provider } = await buildMediaFixture();

        provider.ctx.viewType = ViewType.Video;
        expect(() => {
          // @ts-expect-error Accessing protected property
          provider._throwIfNotVideoView();
        }).to.not.throw();
      });
    });
  });

  describe('queue', function () {
    it('should queue request given provider is not ready and flush once ready', async function () {
      const { provider } = await buildMediaFixture();

      const volumeSpy = spy(provider, '_setVolume');

      // Queue.
      provider.volume = 0.53;
      expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);

      // Flush.
      await provider.mediaRequestQueue.flush();

      // Check.
      expect(provider.mediaRequestQueue.size, 'new queue size').to.equal(0);
      expect(volumeSpy).to.have.been.calledWith(0.53);
    });

    it('should make request immediately if provider is ready', async function () {
      const { provider } = await buildMediaFixture();

      const volumeSpy = spy(provider, '_setVolume');

      provider.mediaRequestQueue.serveImmediately = true;

      provider.volume = 0.53;

      await elementUpdated(provider);

      expect(provider.mediaRequestQueue.size, 'queue size').to.equal(0);
      expect(volumeSpy).to.have.been.calledWith(0.53);
    });

    it('should overwrite request keys and only call once per "type"', async function () {
      const { provider } = await buildMediaFixture();

      const playSpy = spy(provider, 'play');
      const pauseSpy = spy(provider, 'pause');

      provider.paused = false;

      setTimeout(() => {
        provider.paused = true;
        expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);
        provider.mediaRequestQueue.flush();
      });

      await provider.mediaRequestQueue.waitForFlush();

      expect(playSpy).to.not.have.been.called;
      expect(pauseSpy).to.have.been.calledOnce;
    });

    // TODO: should this be the case??
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('should gracefully handle errors when flushing queue', async function () {
      const { provider } = await buildMediaFixture();

      stub(provider, 'play').throws(new Error('No play.'));

      provider.mediaRequestQueue.serveImmediately = true;

      setTimeout(() => {
        provider.paused = false;
      });

      const { detail } = await oneEvent(provider, 'vds-error');
      expect(detail.message).to.equal('No play.');
    });
  });
});
