import { buildMediaFixture } from '@media/test-utils/index';
import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from '../BufferingIndicatorElement';

window.customElements.define(
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
);

describe(BUFFERING_INDICATOR_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);

    const bufferingIndicator = container.querySelector(
      BUFFERING_INDICATOR_ELEMENT_TAG_NAME
    ) as BufferingIndicatorElement;

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
    provider.ctx.canPlay = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-can-play');
  });

  it('should toggle `media-waiting` attribute', async function () {
    const { provider, bufferingIndicator } = await buildFixture();
    provider.forceMediaReady();
    provider.ctx.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.have.attribute('media-waiting');
    provider.ctx.waiting = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-waiting');
  });
});
