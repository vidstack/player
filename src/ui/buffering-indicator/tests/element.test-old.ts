import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
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
    const { player } = await buildMediaPlayerFixture(html`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);

    const bufferingIndicator = player.querySelector(
      BUFFERING_INDICATOR_ELEMENT_TAG_NAME
    )!;

    return { player, bufferingIndicator };
  }

  test('it should render DOM correctly', async function () {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).dom.to.equal(`
      <vds-buffering-indicator>
        <div class="slot"></div>
      </vds-buffering-indicator>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
    const { bufferingIndicator } = await buildFixture();
    expect(bufferingIndicator).shadowDom.to.equal(`<slot></slot>`);
  });

  test('it should toggle `media-can-play` attribute', async function () {
    const { player, bufferingIndicator } = await buildFixture();
    await player.forceMediaReady();
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.have.attribute('media-can-play');
    player.ctx.canPlay = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-can-play');
  });

  test('it should toggle `media-waiting` attribute', async function () {
    const { player, bufferingIndicator } = await buildFixture();
    await player.forceMediaReady();
    player.ctx.waiting = true;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.have.attribute('media-waiting');
    player.ctx.waiting = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-waiting');
  });

  test('it should toggle `media-ended` attribute', async function () {
    const { player, bufferingIndicator } = await buildFixture();
    await player.forceMediaReady();
    player.ctx.ended = true;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.have.attribute('media-ended');
    player.ctx.ended = false;
    await elementUpdated(bufferingIndicator);
    expect(bufferingIndicator).to.not.have.attribute('media-ended');
  });
});
