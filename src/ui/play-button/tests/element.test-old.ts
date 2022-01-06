import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  PLAY_BUTTON_ELEMENT_TAG_NAME,
  PlayButtonElement
} from '../PlayButtonElement';

window.customElements.define(PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);

describe(PLAY_BUTTON_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-play-button>
        <div class="play"></div>
        <div class="pause"></div>
      </vds-play-button>
    `);

    await player.forceMediaReady();

    const button = player.querySelector(PLAY_BUTTON_ELEMENT_TAG_NAME)!;

    return { player, button };
  }

  test('it should render DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-play-button media-can-play media-paused>
        <div class="play"></div>
        <div class="pause"></div>
      </vds-play-button>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <button
        id="button"
        aria-label="Play"
        aria-pressed="false"
        part="button"
      >
        <slot></slot>
      </button>
    `);
  });

  it(`should emit play request when clicked while paused`, async function () {
    const { player, button } = await buildFixture();
    player.paused = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-play-request');
  });

  it(`should emit pause request when clicked while playing`, async function () {
    const { player, button } = await buildFixture();
    player.paused = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, 'vds-pause-request');
  });

  test('it should receive transformed paused context updates', async function () {
    const { player, button } = await buildFixture();
    player.ctx.paused = false;
    await elementUpdated(button);
    expect(button.isPressed).to.be.true;
    expect(button).to.have.attribute('pressed');
    player.ctx.paused = true;
    await elementUpdated(button);
    expect(button.isPressed).to.be.false;
    expect(button).to.not.have.attribute('pressed');
  });
});
