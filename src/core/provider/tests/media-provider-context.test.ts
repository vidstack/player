import { elementUpdated, expect } from '@open-wc/testing';

import {
  buildFakeMediaProvider,
  buildFakeMediaProviderWithFakeConsumer,
} from '../../fakes/fakes.helpers';
import { mediaContext } from '../../media/media.context';
import { createTimeRanges } from '../../time-ranges';
import { ViewType } from '../../ViewType';

describe('provider context', () => {
  it.skip('should have defined all context properties', async () => {
    const provider = await buildFakeMediaProvider();

    Object.keys(mediaContext).forEach(prop => {
      const ctxProp = `${prop}Ctx`;
      const descriptor = Object.getOwnPropertyDescriptor(
        provider.constructor.prototype,
        ctxProp,
      );
      expect(
        descriptor?.get && descriptor?.set,
        `Expected context property [${ctxProp}] to be defined.`,
      ).to.exist;
    });
  });

  it('should update any context', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();
    provider.context.currentSrc = 'apples';
    expect(consumer.currentSrc).to.equal('apples');
  });

  it('should update derived context', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();
    provider.context.viewType = ViewType.Video;
    expect(consumer.isAudioView).to.equal(false);
    expect(consumer.isVideoView).to.equal(true);
    provider.context.viewType = ViewType.Audio;
    expect(consumer.isAudioView).to.equal(true);
    expect(consumer.isVideoView).to.equal(false);
  });

  it('should update multi-part derived context', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();
    provider.context.buffered = createTimeRanges([
      [0, 0],
      [15, 20],
    ]);
    provider.context.duration = 15;
    expect(consumer.bufferedAmount).to.equal(15);
    provider.context.duration = 25;
    expect(consumer.bufferedAmount).to.equal(20);
  });

  it('should soft reset context', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.context.paused = false;
    provider.context.duration = 200;
    await elementUpdated(consumer);

    ((provider as unknown) as {
      softResetMediaContext(): void;
    }).softResetMediaContext();
    await elementUpdated(consumer);

    expect(consumer.paused, 'paused').to.equal(true);
    expect(isNaN(consumer.duration), 'duration').to.be.true;
  });

  it.skip('should hard reset context when provider disconnects', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.context.viewType = ViewType.Video;
    await elementUpdated(consumer);

    provider.disconnectedCallback();
    await elementUpdated(consumer);

    expect(consumer.viewType, 'viewType').to.equal(ViewType.Unknown);
  });
});
