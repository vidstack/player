import { elementUpdated, expect } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import { consumeContext } from '../../../base/context';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { mediaContext } from '../../context';
import { buildMediaPlayerFixture } from '../../test-utils';
import { createTimeRanges } from '../../time-ranges';
import { ViewType } from '../../ViewType';

class FakeMediaConsumerElement extends LitElement {
  @consumeContext(mediaContext.paused)
  paused = mediaContext.paused.initialValue;
  @consumeContext(mediaContext.duration)
  duration = mediaContext.duration.initialValue;
  @consumeContext(mediaContext.currentSrc)
  currentSrc = mediaContext.currentSrc.initialValue;
  @consumeContext(mediaContext.viewType)
  viewType = mediaContext.viewType.initialValue;
  @consumeContext(mediaContext.isAudioView)
  isAudioView = mediaContext.isAudioView.initialValue;
  @consumeContext(mediaContext.isVideoView)
  isVideoView = mediaContext.isVideoView.initialValue;
  @consumeContext(mediaContext.bufferedAmount)
  bufferedAmount = mediaContext.bufferedAmount.initialValue;
}

safelyDefineCustomElement('vds-fake-media-consumer', FakeMediaConsumerElement);

describe('MediaProviderElement/context', function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(
      html`<vds-fake-media-consumer></vds-fake-media-consumer>`
    );

    const consumer = player.querySelector(
      'vds-fake-media-consumer'
    ) as FakeMediaConsumerElement;

    return {
      player,
      consumer
    };
  }

  it('should update any context', async function () {
    const { player, consumer } = await buildFixture();
    player.ctx.currentSrc = 'apples';
    expect(consumer.currentSrc).to.equal('apples');
  });

  it('should update derived context', async function () {
    const { player, consumer } = await buildFixture();
    player.ctx.viewType = ViewType.Video;
    expect(consumer.isAudioView).to.equal(false);
    expect(consumer.isVideoView).to.equal(true);
    player.ctx.viewType = ViewType.Audio;
    expect(consumer.isAudioView).to.equal(true);
    expect(consumer.isVideoView).to.equal(false);
  });

  it('should update multi-part derived context', async function () {
    const { player, consumer } = await buildFixture();
    player.ctx.buffered = createTimeRanges([
      [0, 0],
      [15, 20]
    ]);
    player.ctx.duration = 15;
    expect(consumer.bufferedAmount).to.equal(15);
    player.ctx.duration = 25;
    expect(consumer.bufferedAmount).to.equal(20);
  });

  it('should soft reset context', async function () {
    const { player, consumer } = await buildFixture();

    player.ctx.paused = false;
    player.ctx.duration = 200;
    await elementUpdated(consumer);

    // @ts-expect-error - Access protected property
    player._softResetMediaContext();
    await elementUpdated(consumer);

    expect(consumer.paused, 'paused').to.equal(true);
    expect(isNaN(consumer.duration), 'duration').to.be.true;
  });

  it('should hard reset context when player disconnects', async function () {
    const { player, consumer } = await buildFixture();

    player.ctx.viewType = ViewType.Video;
    await elementUpdated(consumer);

    consumer.remove();
    await elementUpdated(consumer);

    expect(consumer.viewType, 'viewType').to.equal(ViewType.Unknown);
  });
});
