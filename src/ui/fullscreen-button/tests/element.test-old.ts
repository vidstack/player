import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { stub } from 'sinon';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
} from '../FullscreenButtonElement';

window.customElements.define(
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);

describe(FULLSCREEN_BUTTON_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-fullscreen-button>
        <div class="enter"></div>
        <div class="exit"></div>
      </vds-fullscreen-button>
    `);

    // Stub this to avoid fullscreen error in test environment.
    stub(player, 'requestFullscreen').returns(Promise.resolve());

    const button = player.querySelector(FULLSCREEN_BUTTON_ELEMENT_TAG_NAME)!;

    await player.forceMediaReady();

    return { player, button };
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
    const { player, button } = await buildFixture();
    player.ctx.fullscreen = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-enter-fullscreen-request');
  });

  it(`should emit exit fullscreenr request when clicked while in fullscreen`, async function () {
    const { player, button } = await buildFixture();
    player.ctx.fullscreen = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-exit-fullscreen-request');
  });

  it('should receive fullscreen context updates', async function () {
    const { player, button } = await buildFixture();
    player.ctx.fullscreen = true;
    await elementUpdated(button);
    expect(button.isPressed).to.be.true;
    expect(button).to.have.attribute('pressed');
    player.ctx.fullscreen = false;
    await elementUpdated(button);
    expect(button.isPressed).to.be.false;
    expect(button).to.not.have.attribute('pressed');
  });
});
