import { elementUpdated, expect } from '@open-wc/testing';
import sinon, { spy } from 'sinon';

import { keysOf } from '../../../utils/object';
import { equal } from '../../../utils/unit';
import { mediaContext } from '../../context';
import { MediaType } from '../../MediaType';
import { buildMediaFixture } from '../../test-utils';
import { ViewType } from '../../ViewType';

describe('MediaProviderElement/props', function () {
  afterEach(function () {
    sinon.reset();
  });

  it('should have defined all provider state props', async function () {
    const { provider } = await buildMediaFixture();
    keysOf(mediaContext).forEach((prop) => {
      // IGNORE
      if (prop === 'canRequestFullscreen') return;
      expect(equal(provider.ctx[prop], mediaContext[prop].initialValue), prop)
        .to.be.true;
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

  describe('view type', function () {
    it('should update view type when context is updated [audio]', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.viewType = ViewType.Audio;
      expect(provider.viewType).to.equal(ViewType.Audio);
      expect(provider.ctx.isAudioView).to.be.true;
      expect(provider.ctx.isVideoView).to.be.false;
    });

    it('should update view type when context is updated [video]', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.viewType = ViewType.Video;
      expect(provider.viewType).to.equal(ViewType.Video);
      expect(provider.ctx.isAudioView).to.be.false;
      expect(provider.ctx.isVideoView).to.be.true;
    });

    it('should update view type when context is updated [unknown]', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.viewType = ViewType.Unknown;
      expect(provider.viewType).to.equal(ViewType.Unknown);
      expect(provider.ctx.isAudioView).to.be.false;
      expect(provider.ctx.isVideoView).to.be.false;
    });

    it('should reset when disconnected', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.viewType = ViewType.Unknown;
      provider.disconnectedCallback();
      expect(provider.viewType).to.equal(ViewType.Unknown);
      expect(provider.ctx.isAudioView).to.be.false;
      expect(provider.ctx.isVideoView).to.be.false;
    });
  });

  describe('media type', function () {
    it('should update media type when context is updated [audio]', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.mediaType = MediaType.Audio;
      expect(provider.mediaType).to.equal(MediaType.Audio);
      expect(provider.ctx.isAudio).to.be.true;
      expect(provider.ctx.isVideo).to.be.false;
    });

    it('should update media type when context is updated [video]', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.mediaType = MediaType.Video;
      expect(provider.mediaType).to.equal(MediaType.Video);
      expect(provider.ctx.isAudio).to.be.false;
      expect(provider.ctx.isVideo).to.be.true;
    });

    it('should update media type when context is updated [unknown]', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.mediaType = MediaType.Unknown;
      expect(provider.mediaType).to.equal(MediaType.Unknown);
      expect(provider.ctx.isAudio).to.be.false;
      expect(provider.ctx.isVideo).to.be.false;
    });

    it('should reset when disconnected', async function () {
      const { provider } = await buildMediaFixture();
      provider.ctx.mediaType = MediaType.Video;
      provider.disconnectedCallback();
      await elementUpdated(provider);
      expect(provider.mediaType).to.equal(MediaType.Unknown);
      expect(provider.ctx.isAudio).to.be.false;
      expect(provider.ctx.isVideo).to.be.false;
    });
  });
});
