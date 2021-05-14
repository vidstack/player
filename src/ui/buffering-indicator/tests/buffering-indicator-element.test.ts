import { aTimeout, elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { FakeMediaProviderElement } from '../../../core';
import { buildMediaFixture } from '../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../utils/dom';
import {
  VdsBufferingIndicatorHideEvent,
  VdsBufferingIndicatorShowEvent,
} from '../buffering-indicator.events';
import { BufferingIndicatorElement } from '../BufferingIndicatorElement';
import { VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME } from '../vds-buffering-indicator';

describe(VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    provider: FakeMediaProviderElement;
    bufferingIndicator: BufferingIndicatorElement;
  }> {
    const { container, provider } = await buildMediaFixture(html`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);

    const bufferingIndicator = container.querySelector(
      VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
    ) as BufferingIndicatorElement;

    return { provider, bufferingIndicator };
  }

  it('should render DOM correctly', async () => {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).dom.to.equal(`
      <vds-buffering-indicator>
        <div class="slot" hidden></div>
      </vds-buffering-indicator>
    `);
  });

  it('should render shadow DOM correctly', async () => {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should toggle hidden attribute correctly on default slot', async () => {
    const { provider, bufferingIndicator } = await buildFixture();
    const slot = getSlottedChildren(bufferingIndicator)[0] as HTMLElement;

    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.waiting = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden', '');
  });

  it('should toggle hidden attribute correctly when `showWhileBooting` is `true` ', async () => {
    const { provider, bufferingIndicator } = await buildFixture();

    bufferingIndicator.showWhileBooting = true;
    await elementUpdated(bufferingIndicator);

    const slot = getSlottedChildren(bufferingIndicator)[0] as HTMLElement;

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

  it('should delay toggling hidden attribute', async () => {
    const { provider, bufferingIndicator } = await buildFixture();
    const slot = getSlottedChildren(bufferingIndicator)[0] as HTMLElement;

    bufferingIndicator.delay = 10;
    await elementUpdated(bufferingIndicator);

    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden');

    await aTimeout(10);
    expect(slot).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsBufferingIndicatorShowEvent.TYPE} event when hidden attr changes`, async () => {
    const { provider, bufferingIndicator } = await buildFixture();

    setTimeout(() => {
      provider.context.waiting = true;
    });

    await oneEvent(bufferingIndicator, VdsBufferingIndicatorShowEvent.TYPE);
  });

  it(`should emit ${VdsBufferingIndicatorHideEvent.TYPE} event when hidden attr changes`, async () => {
    const { provider, bufferingIndicator } = await buildFixture();

    provider.context.waiting = true;
    await elementUpdated(bufferingIndicator);

    setTimeout(() => {
      provider.context.waiting = false;
    });

    await oneEvent(bufferingIndicator, VdsBufferingIndicatorHideEvent.TYPE);
  });
});
