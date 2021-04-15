import { elementUpdated, expect, html } from '@open-wc/testing';

import { safelyDefineCustomElement } from '../../../../utils/dom';
import { buildMediaFixture, MediaFixture } from '../../../fakes/fakes.helpers';
import { mediaContext } from '../../media.context';
import { createTimeRanges } from '../../time-ranges';
import { ViewType } from '../../ViewType';

class FakeMediaConsumerElement extends HTMLElement {
  @mediaContext.paused.consume()
  paused = mediaContext.paused.defaultValue;

  @mediaContext.duration.consume()
  duration = mediaContext.duration.defaultValue;

  @mediaContext.currentSrc.consume()
  currentSrc = mediaContext.currentSrc.defaultValue;

  @mediaContext.viewType.consume()
  viewType = mediaContext.viewType.defaultValue;

  @mediaContext.isAudioView.consume()
  isAudioView = mediaContext.isAudioView.defaultValue;

  @mediaContext.isVideoView.consume()
  isVideoView = mediaContext.isVideoView.defaultValue;

  @mediaContext.bufferedAmount.consume()
  bufferedAmount = mediaContext.bufferedAmount.defaultValue;
}

safelyDefineCustomElement('vds-fake-media-consumer', FakeMediaConsumerElement);

describe('media provider context', () => {
  async function buildFixture(): Promise<
    MediaFixture & { consumer: FakeMediaConsumerElement }
  > {
    const fixture = await buildMediaFixture(
      html`<vds-fake-media-consumer></vds-fake-media-consumer>`,
    );
    return {
      ...fixture,
      consumer: fixture.container.querySelector(
        'vds-fake-media-consumer',
      ) as FakeMediaConsumerElement,
    };
  }

  it('should update any context', async () => {
    const { provider, consumer } = await buildFixture();
    provider.context.currentSrc = 'apples';
    expect(consumer.currentSrc).to.equal('apples');
  });

  it('should update derived context', async () => {
    const { provider, consumer } = await buildFixture();
    provider.context.viewType = ViewType.Video;
    expect(consumer.isAudioView).to.equal(false);
    expect(consumer.isVideoView).to.equal(true);
    provider.context.viewType = ViewType.Audio;
    expect(consumer.isAudioView).to.equal(true);
    expect(consumer.isVideoView).to.equal(false);
  });

  it('should update multi-part derived context', async () => {
    const { provider, consumer } = await buildFixture();
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
    const { provider, consumer } = await buildFixture();

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
    const { provider, consumer } = await buildFixture();

    provider.context.viewType = ViewType.Video;
    await elementUpdated(consumer);

    provider.disconnectedCallback();
    await elementUpdated(consumer);

    expect(consumer.viewType, 'viewType').to.equal(ViewType.Unknown);
  });
});
