import '../../fakes/vds-fake-media-provider';

import { expect, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';

import { buildFakeMediaProvider, emitEvent } from '../../fakes/helpers';
import { ErrorEvent, PlaybackReadyEvent } from '../../player.events';

describe('request mixin', () => {
  it('should queue request given provider is not ready and flush once ready', async () => {
    const provider = await buildFakeMediaProvider();
    const volumeSpy = spy(provider, 'setVolume');

    // Queue.
    provider.volume = 0.53;
    const queue = provider.getRequestQueue();
    expect(queue.size, 'queue size').to.equal(1);

    // Flush.
    emitEvent(provider, new PlaybackReadyEvent());
    await oneEvent(provider, PlaybackReadyEvent.TYPE);
    await provider.waitForRequestQueueToFlush();

    // Check.
    const newQueue = provider.getRequestQueue();
    expect(newQueue.size, 'new queue size').to.equal(0);
    expect(volumeSpy).to.have.been.calledWith(0.53);
  });

  it('should make request immediately if provider is ready', async () => {
    const provider = await buildFakeMediaProvider();
    const volumeSpy = spy(provider, 'setVolume');
    stub(provider, 'isPlaybackReady').get(() => true);

    provider.volume = 0.53;

    const queue = provider.getRequestQueue();
    expect(queue.size, 'queue size').to.equal(0);

    expect(volumeSpy).to.have.been.calledWith(0.53);
  });

  it('should overwrite request keys and only call once per "type"', async () => {
    const provider = await buildFakeMediaProvider();
    const playSpy = spy(provider, 'play');
    const pauseSpy = spy(provider, 'pause');

    provider.paused = false;

    setTimeout(() => {
      provider.paused = true;
      const queue = provider.getRequestQueue();
      expect(queue.size, 'queue size').to.equal(1);
      emitEvent(provider, new PlaybackReadyEvent());
    });

    await oneEvent(provider, PlaybackReadyEvent.TYPE);
    await provider.waitForRequestQueueToFlush();

    expect(playSpy).to.not.have.been.called;
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should gracefully handle errors when flushing queue', async () => {
    const provider = await buildFakeMediaProvider();
    stub(provider, 'play').throws(new Error('No play.'));
    stub(provider, 'isPlaybackReady').get(() => true);

    setTimeout(() => {
      provider.paused = false;
    });

    const { detail } = await oneEvent(provider, ErrorEvent.TYPE);
    expect(detail.message).to.equal('No play.');
  });
});
