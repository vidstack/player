import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../media/test-utils/index.js';
import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from '../BufferingIndicatorElement.js';

window.customElements.define(
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
);

describe(BUFFERING_INDICATOR_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);

    const bufferingIndicator = /** @type {BufferingIndicatorElement} */ (
      container.querySelector(BUFFERING_INDICATOR_ELEMENT_TAG_NAME)
    );

    return { provider, bufferingIndicator };
  }

  it('should render DOM correctly', async function () {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).dom.to.equal(`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should toggle `media-can-play` attribute', async function () {
    const { provider, bufferingIndicator } = await buildFixture();
    provider.forceMediaReady();
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.have.attribute('media-can-play');
    provider.context.canPlay = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-can-play');
  });

  it('should toggle `media-waiting` attribute', async function () {
    const { provider, bufferingIndicator } = await buildFixture();
    provider.forceMediaReady();
    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.have.attribute('media-waiting');
    provider.context.waiting = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-waiting');
  });
});
