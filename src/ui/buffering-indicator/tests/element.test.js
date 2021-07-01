import { aTimeout, elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../media/test-utils/index.js';
import { getSlottedChildren } from '../../../utils/dom.js';
import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from '../BufferingIndicatorElement.js';
import {
  BufferingIndicatorHideEvent,
  BufferingIndicatorShowEvent
} from '../events.js';

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

    const bufferingIndicator = /** @type {BufferingIndicatorElement} */ (
      container.querySelector(BUFFERING_INDICATOR_ELEMENT_TAG_NAME)
    );

    return { provider, bufferingIndicator };
  }

  it('should render DOM correctly', async function () {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).dom.to.equal(`
      <vds-buffering-indicator>
        <div class="slot" hidden></div>
      </vds-buffering-indicator>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should toggle hidden attribute correctly on default slot', async function () {
    const { provider, bufferingIndicator } = await buildFixture();
    const slot = getSlottedChildren(bufferingIndicator)[0];

    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.waiting = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden', '');
  });

  it('should toggle hidden attribute correctly when `showWhileBooting` is `true` ', async function () {
    const { provider, bufferingIndicator } = await buildFixture();

    bufferingIndicator.showWhileBooting = true;

    let slot = getSlottedChildren(bufferingIndicator)[0];

    provider.context.waiting = false;
    provider.context.canPlay = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.waiting = false;
    provider.context.canPlay = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden');

    provider.context.waiting = true;
    provider.context.canPlay = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.waiting = true;
    provider.context.canPlay = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');
  });

  it('should delay toggling hidden attribute', async function () {
    const { provider, bufferingIndicator } = await buildFixture();
    const slot = getSlottedChildren(bufferingIndicator)[0];

    bufferingIndicator.delay = 10;
    await elementUpdated(bufferingIndicator);

    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden');

    await aTimeout(10);
    expect(slot).to.not.have.attribute('hidden');
  });

  it(`should emit ${BufferingIndicatorShowEvent.TYPE} event when hidden attr changes`, async function () {
    const { provider, bufferingIndicator } = await buildFixture();

    setTimeout(() => {
      provider.context.waiting = true;
    });

    await oneEvent(bufferingIndicator, BufferingIndicatorShowEvent.TYPE);
  });

  it(`should emit ${BufferingIndicatorHideEvent.TYPE} event when hidden attr changes`, async function () {
    const { provider, bufferingIndicator } = await buildFixture();

    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);

    setTimeout(() => {
      provider.context.waiting = false;
    });

    await oneEvent(bufferingIndicator, BufferingIndicatorHideEvent.TYPE);
  });
});
