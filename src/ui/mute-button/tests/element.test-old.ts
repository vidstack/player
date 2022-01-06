import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  MUTE_BUTTON_ELEMENT_TAG_NAME,
  MuteButtonElement
} from '../MuteButtonElement';

window.customElements.define(MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);

describe(MUTE_BUTTON_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-mute-button>
        <div class="mute"></div>
        <div class="unmute"></div>
      </vds-mute-button>
    `);

    await player.forceMediaReady();

    const button = player.querySelector(MUTE_BUTTON_ELEMENT_TAG_NAME)!;

    return { player, button };
  }

  test('it should render DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-mute-button media-can-play>
        <div class="mute"></div>
        <div class="unmute"></div>
      </vds-mute-button>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
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

  it(`should emit mute request when clicked while unmuted`, async function () {
    const { player, button } = await buildFixture();
    player.muted = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-mute-request');
  });

  it(`should emit unmute request when clicked while muted`, async function () {
    const { player, button } = await buildFixture();
    player.muted = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-unmute-request');
  });

  test('it should receive muted context updates', async function () {
    const { player, button } = await buildFixture();
    player.ctx.muted = true;
    await elementUpdated(button);
    expect(button.isPressed).to.be.true;
    expect(button).to.have.attribute('pressed');
    player.ctx.muted = false;
    await elementUpdated(button);
    expect(button.isPressed).to.be.false;
    expect(button).to.not.have.attribute('pressed');
  });
});
