import { buildMediaFixture } from '@media/test-utils/index.js';
import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { stub } from 'sinon';

import {
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
} from '../FullscreenButtonElement.js';

window.customElements.define(
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);

describe(FULLSCREEN_BUTTON_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-fullscreen-button>
        <div class="enter"></div>
        <div class="exit"></div>
      </vds-fullscreen-button>
    `);

    // Stub this to avoid fullscreen error in test environment.
    stub(container, 'requestFullscreen').returns(Promise.resolve());

    const button = /** @type {FullscreenButtonElement} */ (
      container.querySelector(FULLSCREEN_BUTTON_ELEMENT_TAG_NAME)
    );

    provider.forceMediaReady();

    return { provider, button };
  }

  it('should render DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-fullscreen-button media-can-play>
        <div class="enter"></div>
        <div class="exit"></div>
      </vds-fullscreen-button>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <button
        id="button"
        aria-label="Fullscreen"
        aria-pressed="false"
        part="button"
      >
        <slot></slot>
      </button>
    `);
  });

  it(`should emit enter fullscreen request when clicked while not in fullscreen`, async function () {
    const { provider, button } = await buildFixture();
    provider.ctx.fullscreen = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-enter-fullscreen-request');
  });

  it(`should emit exit fullscreenr request when clicked while in fullscreen`, async function () {
    const { provider, button } = await buildFixture();
    provider.ctx.fullscreen = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-exit-fullscreen-request');
  });

  it('should receive fullscreen context updates', async function () {
    const { provider, button } = await buildFixture();
    provider.ctx.fullscreen = true;
    await elementUpdated(button);
    expect(button.isPressed).to.be.true;
    expect(button).to.have.attribute('pressed');
    provider.ctx.fullscreen = false;
    await elementUpdated(button);
    expect(button.isPressed).to.be.false;
    expect(button).to.not.have.attribute('pressed');
  });
});
