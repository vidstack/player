import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { stub } from 'sinon';

import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent
} from '../../../../media/index.js';
import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement} from '../FullscreenButtonElement.js';

window.customElements.define(
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);

describe(FULLSCREEN_BUTTON_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-fullscreen-button>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit"></div>
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
      <vds-fullscreen-button>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit" hidden></div>
      </vds-fullscreen-button>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        label="Fullscreen"
        part="root button"
				type="button"
        exportparts="root: button-root"
      >
        <slot name="exit"></slot>
        <slot name="enter"></slot>
      </button>
    `);
  });

  it('should render enter/exit slots', async function () {
    const { button } = await buildFixture();
    expect(button.enterSlotElement).to.have.class('enter');
    expect(button.exitSlotElement).to.have.class('exit');
  });

  it('should set exit slot to hidden when not in fullscreen', async function () {
    const { provider, button } = await buildFixture();
    provider.context.fullscreen = false;
    await elementUpdated(button);
    expect(button.enterSlotElement).to.not.have.attribute('hidden');
    expect(button.exitSlotElement).to.have.attribute('hidden', '');
  });

  it('should set enter slot to hidden when in fullscreen', async function () {
    const { provider, button } = await buildFixture();
    provider.context.fullscreen = true;
    await elementUpdated(button);
    expect(button.enterSlotElement).to.have.attribute('hidden', '');
    expect(button.exitSlotElement).to.not.have.attribute('hidden');
  });

  it(`should emit ${EnterFullscreenRequestEvent.TYPE} when clicked while not in fullscreen`, async function () {
    const { provider, button } = await buildFixture();
    provider.context.fullscreen = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, EnterFullscreenRequestEvent.TYPE);
  });

  it(`should emit ${ExitFullscreenRequestEvent.TYPE} when clicked while in fullscreen`, async function () {
    const { provider, button } = await buildFixture();
    provider.context.fullscreen = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, ExitFullscreenRequestEvent.TYPE);
  });

  it('should receive fullscreen context updates', async function () {
    const { provider, button } = await buildFixture();
    provider.context.fullscreen = true;
    await elementUpdated(button);
    expect(button.pressed).to.be.true;
    provider.context.fullscreen = false;
    await elementUpdated(button);
    expect(button.pressed).to.be.false;
  });
});
