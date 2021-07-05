import { elementUpdated, expect } from '@open-wc/testing';
import sinon, { spy } from 'sinon';

import { equal } from '../../../utils/unit.js';
import { mediaContext } from '../../context.js';
import { MediaType } from '../../MediaType.js';
import { buildMediaFixture } from '../../test-utils/index.js';
import { ViewType } from '../../ViewType.js';

describe('MediaProviderElement/props', function () {
  afterEach(function () {
    sinon.reset();
  });

  it('should have defined all provider state props', async function () {
    const { provider } = await buildMediaFixture();
    Object.keys(mediaContext).forEach((prop) => {
      expect(
        equal(provider.context[prop], mediaContext[prop].initialValue),
        prop
      ).to.be.true;
    });
  });

  it('should update provider when volume is set', async function () {
    const { provider } = await buildMediaFixture();
    const volume = 0.75;
    const volumeSpy = spy(provider, 'setVolume');
    provider.mediaRequestQueue.serveImmediately = true;
    provider.volume = volume;
    expect(volumeSpy).to.have.been.calledWith(volume);
  });

  it('should update provider when currentTime is set', async function () {
    const { provider } = await buildMediaFixture();
    const currentTime = 420;
    const currentTimeSpy = spy(provider, 'setCurrentTime');
    provider.mediaRequestQueue.serveImmediately = true;
    provider.currentTime = currentTime;
    expect(currentTimeSpy).to.have.been.calledWith(currentTime);
  });

  it('should update provider when paused is set', async function () {
    const { provider } = await buildMediaFixture();
    const paused = false;
    const playSpy = spy(provider, 'play');
    const pauseSpy = spy(provider, 'pause');
    provider.mediaRequestQueue.serveImmediately = true;
    provider.paused = paused;
    expect(playSpy).to.have.been.calledOnce;
    provider.paused = true;
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should update provider when muted is set', async function () {
    const { provider } = await buildMediaFixture();
    const muted = true;
    const mutedSpy = spy(provider, 'setMuted');
    provider.mediaRequestQueue.serveImmediately = true;
    provider.muted = muted;
    expect(mutedSpy).to.have.been.calledWith(muted);
  });

  describe('view type', function () {
    it('should update view type when context is updated [audio]', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.viewType = ViewType.Audio;
      expect(provider.viewType).to.equal(ViewType.Audio);
      expect(provider.context.isAudioView).to.be.true;
      expect(provider.context.isVideoView).to.be.false;
    });

    it('should update view type when context is updated [video]', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.viewType = ViewType.Video;
      expect(provider.viewType).to.equal(ViewType.Video);
      expect(provider.context.isAudioView).to.be.false;
      expect(provider.context.isVideoView).to.be.true;
    });

    it('should update view type when context is updated [unknown]', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.viewType = ViewType.Unknown;
      expect(provider.viewType).to.equal(ViewType.Unknown);
      expect(provider.context.isAudioView).to.be.false;
      expect(provider.context.isVideoView).to.be.false;
    });

    it('should reset when disconnected', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.viewType = ViewType.Unknown;
      provider.disconnectedCallback();
      expect(provider.viewType).to.equal(ViewType.Unknown);
      expect(provider.context.isAudioView).to.be.false;
      expect(provider.context.isVideoView).to.be.false;
    });
  });

  describe('media type', function () {
    it('should update media type when context is updated [audio]', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.mediaType = MediaType.Audio;
      expect(provider.mediaType).to.equal(MediaType.Audio);
      expect(provider.context.isAudio).to.be.true;
      expect(provider.context.isVideo).to.be.false;
    });

    it('should update media type when context is updated [video]', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.mediaType = MediaType.Video;
      expect(provider.mediaType).to.equal(MediaType.Video);
      expect(provider.context.isAudio).to.be.false;
      expect(provider.context.isVideo).to.be.true;
    });

    it('should update media type when context is updated [unknown]', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.mediaType = MediaType.Unknown;
      expect(provider.mediaType).to.equal(MediaType.Unknown);
      expect(provider.context.isAudio).to.be.false;
      expect(provider.context.isVideo).to.be.false;
    });

    it('should reset when disconnected', async function () {
      const { provider } = await buildMediaFixture();
      provider.context.mediaType = MediaType.Video;
      provider.disconnectedCallback();
      await elementUpdated(provider);
      expect(provider.mediaType).to.equal(MediaType.Unknown);
      expect(provider.context.isAudio).to.be.false;
      expect(provider.context.isVideo).to.be.false;
    });
  });
});
