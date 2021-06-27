import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import {
  VdsPauseRequestEvent,
  VdsPlayRequestEvent
} from '../../../../media/index.js';
import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
  PlayButtonElement,
  VDS_PLAY_BUTTON_ELEMENT_TAG_NAME
} from '../PlayButtonElement.js';

window.customElements.define(
  VDS_PLAY_BUTTON_ELEMENT_TAG_NAME,
  PlayButtonElement
);

describe(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-play-button>
        <div class="play" slot="play"></div>
        <div class="pause" slot="pause"></div>
      </vds-play-button>
    `);

    provider.forceMediaReady();

    const button = /** @type {PlayButtonElement} */ (
      container.querySelector(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME)
    );

    return { provider, button };
  }

  it('should render DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-play-button>
        <div class="play" slot="play"></div>
        <div class="pause" slot="pause" hidden></div>
      </vds-play-button>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        label="Play"
        part="root button"
				type="button"
        exportparts="root: button-root"
      >
        <slot name="pause"></slot>
        <slot name="play"></slot>
      </button>
    `);
  });

  it('should render play/pause slots', async function () {
    const { button } = await buildFixture();
    expect(button.playSlotElement).to.have.class('play');
    expect(button.pauseSlotElement).to.have.class('pause');
  });

  it('should set pause slot to hidden when paused is true', async function () {
    const { provider, button } = await buildFixture();
    provider.paused = true;
    await elementUpdated(button);
    expect(button.pauseSlotElement).to.have.attribute('hidden', '');
    expect(button.playSlotElement).to.not.have.attribute('hidden');
  });

  it('should set play slot to hidden when paused is false', async function () {
    const { provider, button } = await buildFixture();
    provider.paused = false;
    await elementUpdated(button);
    expect(button.playSlotElement).to.have.attribute('hidden', '');
    expect(button.pauseSlotElement).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsPlayRequestEvent.TYPE} when clicked while paused`, async function () {
    const { provider, button } = await buildFixture();
    provider.paused = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsPlayRequestEvent.TYPE);
  });

  it(`should emit ${VdsPauseRequestEvent.TYPE} when clicked while not paused`, async function () {
    const { provider, button } = await buildFixture();
    provider.paused = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsPauseRequestEvent.TYPE);
  });

  it('should receive transformed paused context updates', async function () {
    const { provider, button } = await buildFixture();
    provider.context.paused = false;
    await elementUpdated(button);
    expect(button.pressed).to.be.true;
    provider.context.paused = true;
    await elementUpdated(button);
    expect(button.pressed).to.be.false;
  });
});
