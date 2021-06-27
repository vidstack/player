import { elementUpdated, expect } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import { WithContext } from '../../../foundation/context/index.js';
import { safelyDefineCustomElement } from '../../../utils/dom.js';
import { mediaContext } from '../../media.context.js';
import { buildMediaFixture } from '../../test-utils/index.js';
import { createTimeRanges } from '../../time-ranges.js';
import { ViewType } from '../../ViewType.js';

class FakeMediaConsumerElement extends WithContext(LitElement) {
  /** @type {import('../../../foundation/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      paused: mediaContext.paused,
      duration: mediaContext.duration,
      currentSrc: mediaContext.currentSrc,
      viewType: mediaContext.viewType,
      isAudioView: mediaContext.isAudioView,
      isVideoView: mediaContext.isVideoView,
      bufferedAmount: mediaContext.bufferedAmount
    };
  }

  constructor() {
    super();
    this.paused = mediaContext.paused.initialValue;
    this.duration = mediaContext.duration.initialValue;
    this.currentSrc = mediaContext.currentSrc.initialValue;
    this.viewType = mediaContext.viewType.initialValue;
    this.isAudioView = mediaContext.isAudioView.initialValue;
    this.isVideoView = mediaContext.isVideoView.initialValue;
    this.bufferedAmount = mediaContext.bufferedAmount.initialValue;
  }
}

safelyDefineCustomElement('vds-fake-media-consumer', FakeMediaConsumerElement);

describe('MediaProviderElement/context', function () {
  /**
   * @returns {Promise<import('../../test-utils').MediaFixture & { consumer: FakeMediaConsumerElement }>}
   */
  async function buildFixture() {
    const fixture = await buildMediaFixture(
      html`<vds-fake-media-consumer></vds-fake-media-consumer>`
    );
    const consumer = /** @type {FakeMediaConsumerElement} */ (
      fixture.container.querySelector('vds-fake-media-consumer')
    );
    return {
      ...fixture,
      consumer
    };
  }

  it('should update any context', async function () {
    const { provider, consumer } = await buildFixture();
    provider.context.currentSrc = 'apples';
    expect(consumer.currentSrc).to.equal('apples');
  });

  it('should update derived context', async function () {
    const { provider, consumer } = await buildFixture();
    provider.context.viewType = ViewType.Video;
    expect(consumer.isAudioView).to.equal(false);
    expect(consumer.isVideoView).to.equal(true);
    provider.context.viewType = ViewType.Audio;
    expect(consumer.isAudioView).to.equal(true);
    expect(consumer.isVideoView).to.equal(false);
  });

  it('should update multi-part derived context', async function () {
    const { provider, consumer } = await buildFixture();
    provider.context.buffered = createTimeRanges([
      [0, 0],
      [15, 20]
    ]);
    provider.context.duration = 15;
    expect(consumer.bufferedAmount).to.equal(15);
    provider.context.duration = 25;
    expect(consumer.bufferedAmount).to.equal(20);
  });

  it('should soft reset context', async function () {
    const { provider, consumer } = await buildFixture();

    provider.context.paused = false;
    provider.context.duration = 200;
    await elementUpdated(consumer);

    /** @type {any} */ (provider).softResetMediaContext();
    await elementUpdated(consumer);

    expect(consumer.paused, 'paused').to.equal(true);
    expect(isNaN(consumer.duration), 'duration').to.be.true;
  });

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should hard reset context when provider disconnects', async function () {
    const { provider, consumer } = await buildFixture();

    provider.context.viewType = ViewType.Video;
    await elementUpdated(consumer);

    provider.disconnectedCallback();
    await elementUpdated(consumer);

    expect(consumer.viewType, 'viewType').to.equal(ViewType.Unknown);
  });
});
