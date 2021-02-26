import '../vds-player';
import '../provider/vds-mock-media-provider';
import { buildPlayerWithMockProvider, emitEvent } from './helpers';
import { expect, oneEvent } from '@open-wc/testing';
import { ProviderPlaybackReadyEvent } from '../provider';
import { ErrorEvent, PlaybackReadyEvent } from '../player.events';
import { spy, stub } from 'sinon';

describe('provider requests', () => {
  it('should queue request given provider is not ready and flush once ready', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const volumeSpy = spy(provider, 'volume', ['set']);

    // Queue.
    player.volume = 0.53;
    const queue = player.getRequestQueue();
    expect(queue.size, 'queue size').to.equal(1);

    // Flush.
    emitEvent(provider, new ProviderPlaybackReadyEvent());
    await oneEvent(player, PlaybackReadyEvent.TYPE);
    await player.waitForRequestQueueToFlush();

    // Check.
    const newQueue = player.getRequestQueue();
    expect(newQueue.size, 'new queue size').to.equal(0);
    expect(volumeSpy.set).to.have.been.calledWith(0.53);
  });

  it('should make request immediately if provider is ready', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const volumeSpy = spy(provider, 'volume', ['set']);
    stub(provider, 'isPlaybackReady').get(() => true);

    player.volume = 0.53;

    const queue = player.getRequestQueue();
    expect(queue.size, 'queue size').to.equal(0);

    expect(volumeSpy.set).to.have.been.calledWith(0.53);
  });

  it('should overwrite request keys and only call once per "type"', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    const playSpy = spy(provider, 'play');
    const pauseSpy = spy(provider, 'pause');

    player.paused = false;

    setTimeout(() => {
      player.paused = true;
      const queue = player.getRequestQueue();
      expect(queue.size, 'queue size').to.equal(1);
      emitEvent(provider, new ProviderPlaybackReadyEvent());
    });

    await oneEvent(player, PlaybackReadyEvent.TYPE);
    await player.waitForRequestQueueToFlush();

    expect(playSpy).to.not.have.been.called;
    expect(pauseSpy).to.have.been.calledOnce;
  });

  it('should gracefully handle errors when flushing queue', async () => {
    const [player, provider] = await buildPlayerWithMockProvider();
    stub(provider, 'play').throws(new Error('No play.'));
    stub(provider, 'isPlaybackReady').get(() => true);

    setTimeout(() => {
      player.paused = false;
    });

    const { detail } = await oneEvent(player, ErrorEvent.TYPE);
    expect(detail.message).to.equal('No play.');
  });
});
