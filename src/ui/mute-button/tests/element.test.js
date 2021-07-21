import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { MuteRequestEvent, UnmuteRequestEvent } from '../../../media/index.js';
import { buildMediaFixture } from '../../../media/test-utils/index.js';
import {
  MUTE_BUTTON_ELEMENT_TAG_NAME,
  MuteButtonElement
} from '../MuteButtonElement.js';

window.customElements.define(MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);

describe(MUTE_BUTTON_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-mute-button>
        <div class="mute"></div>
        <div class="unmute"></div>
      </vds-mute-button>
    `);

    provider.forceMediaReady();

    const button = /** @type {MuteButtonElement} */ (
      container.querySelector(MUTE_BUTTON_ELEMENT_TAG_NAME)
    );

    return { provider, button };
  }

  it('should render DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-mute-button>
        <div class="mute"></div>
        <div class="unmute"></div>
      </vds-mute-button>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <button
        id="button"
        aria-label="Mute"
        aria-pressed="false"
        part="button"
      >
        <slot></slot>
      </button>
    `);
  });

  it(`should emit ${MuteRequestEvent.TYPE} with true detail clicked while unmuted`, async function () {
    const { provider, button } = await buildFixture();
    provider.muted = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, MuteRequestEvent.TYPE);
  });

  it(`should emit ${UnmuteRequestEvent.TYPE} with false detail when clicked while muted`, async function () {
    const { provider, button } = await buildFixture();
    provider.muted = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, UnmuteRequestEvent.TYPE);
  });

  it('should receive muted context updates', async function () {
    const { provider, button } = await buildFixture();
    provider.ctx.muted = true;
    await elementUpdated(button);
    expect(button.isPressed).to.be.true;
    expect(button).to.have.attribute('pressed');
    provider.ctx.muted = false;
    await elementUpdated(button);
    expect(button.isPressed).to.be.false;
    expect(button).to.not.have.attribute('pressed');
  });
});
