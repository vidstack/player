import { elementUpdated, expect } from '@open-wc/testing';

import {
  buildFakeMediaProvider,
  buildFakeMediaProviderWithFakeConsumer,
} from '../../fakes/helpers';
import { playerContext } from '../../player.context';
import { ViewType } from '../../ViewType';

describe('provider context', () => {
  it.skip('should have defined all context properties', async () => {
    const provider = await buildFakeMediaProvider();

    Object.keys(playerContext).forEach(prop => {
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

  it('should soft reset context', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.context.paused = false;
    provider.context.duration = 200;
    await elementUpdated(consumer);

    ((provider as unknown) as { softResetContext(): void }).softResetContext();
    await elementUpdated(consumer);

    expect(consumer.paused, 'paused').to.equal(true);
    expect(consumer.duration, 'duration').to.equal(-1);
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
