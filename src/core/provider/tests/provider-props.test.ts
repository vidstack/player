import '../../fakes/vds-fake-media-provider';

import { expect } from '@open-wc/testing';
import sinon, { spy, stub } from 'sinon';

import { buildFakeMediaProvider } from '../../fakes/helpers';
import { playerContext } from '../../player.context';
import { PlayerContext } from '../../player.types';

describe('provider props', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should have defined all provider state props', async () => {
    const provider = await buildFakeMediaProvider();

    ((Object.keys(
      playerContext,
    ) as unknown) as (keyof PlayerContext)[]).forEach(prop => {
      // Skip uuid because it generates a value as the component mounts.
      if (prop === 'uuid') return;
      expect(provider[prop], prop).to.equal(playerContext[prop].defaultValue);
    });
  });

  it('should handle aspect ratio change through setter', async () => {
    const provider = await buildFakeMediaProvider();
    const newAspectRatio = '20:100';
    provider.aspectRatio = newAspectRatio;
    expect(provider.aspectRatio).to.equal(newAspectRatio);
    expect(provider.context.aspectRatioCtx).to.equal(newAspectRatio);
  });

  it('should update provider when volume is set', async () => {
    const provider = await buildFakeMediaProvider();
    const volume = 0.75;
    const volumeSpy = spy(provider, 'setVolume');
    stub(provider, 'isPlaybackReady').get(() => true);
    provider.volume = volume;
    expect(volumeSpy).to.have.been.calledWith(volume);
  });

  it('should update provider when currentTime is set', async () => {
    const provider = await buildFakeMediaProvider();
    const currentTime = 420;
    const currentTimeSpy = spy(provider, 'setCurrentTime');
    stub(provider, 'isPlaybackReady').get(() => true);
    provider.currentTime = currentTime;
    expect(currentTimeSpy).to.have.been.calledWith(currentTime);
  });

  it('should update provider when paused is set', async () => {
    const provider = await buildFakeMediaProvider();
    const paused = false;
    const playSpy = spy(provider, 'play');
    const pauseSpy = spy(provider, 'pause');
    stub(provider, 'isPlaybackReady').get(() => true);
    provider.paused = paused;
    expect(playSpy).to.have.been.calledOnce;
    provider.paused = true;
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should update provider when muted is set', async () => {
    const provider = await buildFakeMediaProvider();
    const muted = true;
    const mutedSpy = spy(provider, 'setMuted');
    stub(provider, 'isPlaybackReady').get(() => true);
    provider.muted = muted;
    expect(mutedSpy).to.have.been.calledWith(muted);
  });
});
