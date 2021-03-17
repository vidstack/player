import { expect } from '@open-wc/testing';
import sinon, { spy, stub } from 'sinon';

import { buildFakeMediaProvider } from '../../fakes/helpers';
import { MediaType } from '../../MediaType';
import { playerContext } from '../../player.context';
import { ViewType } from '../../ViewType';

describe('provider props', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should have defined all provider state props', async () => {
    const provider = await buildFakeMediaProvider();

    Object.keys(playerContext).forEach(prop => {
      if (prop === 'duration') return;
      expect(provider.context[prop], prop).to.equal(
        playerContext[prop].defaultValue,
      );
    });
  });

  it('should update provider when volume is set', async () => {
    const provider = await buildFakeMediaProvider();
    const volume = 0.75;
    const volumeSpy = spy(provider, 'setVolume');
    stub(provider, 'canPlay').get(() => true);
    provider.volume = volume;
    expect(volumeSpy).to.have.been.calledWith(volume);
  });

  it('should update provider when currentTime is set', async () => {
    const provider = await buildFakeMediaProvider();
    const currentTime = 420;
    const currentTimeSpy = spy(provider, 'setCurrentTime');
    stub(provider, 'canPlay').get(() => true);
    provider.currentTime = currentTime;
    expect(currentTimeSpy).to.have.been.calledWith(currentTime);
  });

  it('should update provider when paused is set', async () => {
    const provider = await buildFakeMediaProvider();
    const paused = false;
    const playSpy = spy(provider, 'play');
    const pauseSpy = spy(provider, 'pause');
    stub(provider, 'canPlay').get(() => true);
    provider.paused = paused;
    expect(playSpy).to.have.been.calledOnce;
    provider.paused = true;
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should update provider when muted is set', async () => {
    const provider = await buildFakeMediaProvider();
    const muted = true;
    const mutedSpy = spy(provider, 'setMuted');
    stub(provider, 'canPlay').get(() => true);
    provider.muted = muted;
    expect(mutedSpy).to.have.been.calledWith(muted);
  });
});

describe('view type', () => {
  it('should update view type when context is updated [audio]', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.viewType = ViewType.Audio;
    expect(provider.viewType).to.equal(ViewType.Audio);
    expect(provider.context.isAudioView).to.be.true;
    expect(provider.context.isVideoView).to.be.false;
  });

  it('should update view type when context is updated [video]', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.viewType = ViewType.Video;
    expect(provider.viewType).to.equal(ViewType.Video);
    expect(provider.context.isAudioView).to.be.false;
    expect(provider.context.isVideoView).to.be.true;
  });

  it('should update view type when context is updated [unknown]', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.viewType = ViewType.Unknown;
    expect(provider.viewType).to.equal(ViewType.Unknown);
    expect(provider.context.isAudioView).to.be.false;
    expect(provider.context.isVideoView).to.be.false;
  });

  it('should reset when disconnected', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.viewType = ViewType.Unknown;
    provider.disconnectedCallback();
    expect(provider.viewType).to.equal(ViewType.Unknown);
    expect(provider.context.isAudioView).to.be.false;
    expect(provider.context.isVideoView).to.be.false;
  });
});

describe('media type', () => {
  it('should update media type when context is updated [audio]', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.mediaType = MediaType.Audio;
    expect(provider.mediaType).to.equal(MediaType.Audio);
    expect(provider.context.isAudio).to.be.true;
    expect(provider.context.isVideo).to.be.false;
  });

  it('should update media type when context is updated [video]', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.mediaType = MediaType.Video;
    expect(provider.mediaType).to.equal(MediaType.Video);
    expect(provider.context.isAudio).to.be.false;
    expect(provider.context.isVideo).to.be.true;
  });

  it('should update media type when context is updated [unknown]', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.mediaType = MediaType.Unknown;
    expect(provider.mediaType).to.equal(MediaType.Unknown);
    expect(provider.context.isAudio).to.be.false;
    expect(provider.context.isVideo).to.be.false;
  });

  it('should reset when disconnected', async () => {
    const provider = await buildFakeMediaProvider();
    provider.context.mediaType = MediaType.Video;
    provider.disconnectedCallback();
    expect(provider.mediaType).to.equal(MediaType.Unknown);
    expect(provider.context.isAudio).to.be.false;
    expect(provider.context.isVideo).to.be.false;
  });
});
