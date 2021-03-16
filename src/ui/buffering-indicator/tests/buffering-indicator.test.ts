import {
  aTimeout,
  elementUpdated,
  expect,
  html,
  oneEvent,
} from '@open-wc/testing';

import { FakeMediaProvider } from '../../../core';
import { buildFakeMediaProvider } from '../../../core/fakes/helpers';
import { getSlottedChildren } from '../../../utils/dom';
import {
  BufferingIndicatorHideEvent,
  BufferingIndicatorShowEvent,
} from '../buffering-indicator.events';
import { BufferingIndicator } from '../BufferingIndicator';
import { BUFFERING_INDICATOR_TAG_NAME } from '../vds-buffering-indicator';

describe(BUFFERING_INDICATOR_TAG_NAME, () => {
  async function buildFixture(): Promise<
    [FakeMediaProvider, BufferingIndicator]
  > {
    const provider = await buildFakeMediaProvider(html`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);

    const bufferingIndicator = provider.querySelector(
      BUFFERING_INDICATOR_TAG_NAME,
    ) as BufferingIndicator;

    return [provider, bufferingIndicator];
  }

  it('should render dom correctly', async () => {
    const [, bufferingIndicator] = await buildFixture();
    expect(bufferingIndicator).dom.to.equal(`
      <vds-buffering-indicator>
        <div class="slot" hidden></div>
      </vds-buffering-indicator>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, bufferingIndicator] = await buildFixture();
    expect(bufferingIndicator).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should toggle hidden attribute correctly on default slot', async () => {
    const [provider, bufferingIndicator] = await buildFixture();
    const slot = getSlottedChildren(bufferingIndicator)[0] as HTMLElement;

    provider.context.buffering = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.buffering = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden', '');
  });

  it('should toggle hidden attribute correctly when `showWhileBooting` is `true` ', async () => {
    const [provider, bufferingIndicator] = await buildFixture();

    bufferingIndicator.showWhileBooting = true;
    await elementUpdated(bufferingIndicator);

    const slot = getSlottedChildren(bufferingIndicator)[0] as HTMLElement;

    provider.context.buffering = false;
    provider.context.isPlaybackReady = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.buffering = false;
    provider.context.isPlaybackReady = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden');

    provider.context.buffering = true;
    provider.context.isPlaybackReady = false;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');

    provider.context.buffering = true;
    provider.context.isPlaybackReady = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.not.have.attribute('hidden');
  });

  it('should delay toggling hidden attribute', async () => {
    const [provider, bufferingIndicator] = await buildFixture();
    const slot = getSlottedChildren(bufferingIndicator)[0] as HTMLElement;

    bufferingIndicator.delay = 10;
    await elementUpdated(bufferingIndicator);

    provider.context.buffering = true;
    await elementUpdated(bufferingIndicator);
    expect(slot).to.have.attribute('hidden');

    await aTimeout(10);
    expect(slot).to.not.have.attribute('hidden');
  });

  it(`should emit ${BufferingIndicatorShowEvent.TYPE} event when hidden attr changes`, async () => {
    const [provider, bufferingIndicator] = await buildFixture();

    setTimeout(() => {
      provider.context.buffering = true;
    });

    await oneEvent(bufferingIndicator, BufferingIndicatorShowEvent.TYPE);
  });

  it(`should emit ${BufferingIndicatorHideEvent.TYPE} event when hidden attr changes`, async () => {
    const [provider, bufferingIndicator] = await buildFixture();

    provider.context.buffering = true;
    await elementUpdated(bufferingIndicator);

    setTimeout(() => {
      provider.context.buffering = false;
    });

    await oneEvent(bufferingIndicator, BufferingIndicatorHideEvent.TYPE);
  });
});
