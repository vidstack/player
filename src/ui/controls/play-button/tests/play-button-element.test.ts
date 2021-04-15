import { elementUpdated, expect, html, oneEvent } from '@open-wc/testing';

import {
  FakeMediaProviderElement,
  VdsPauseRequestEvent,
  VdsPlayRequestEvent,
} from '../../../../core';
import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { PlayButtonElement } from '../PlayButtonElement';
import { VDS_PLAY_BUTTON_ELEMENT_TAG_NAME } from '../vds-play-button';

describe(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    provider: FakeMediaProviderElement;
    button: PlayButtonElement;
  }> {
    const { container, provider } = await buildMediaFixture(html`
      <vds-play-button>
        <div class="play" slot="play"></div>
        <div class="pause" slot="pause"></div>
      </vds-play-button>
    `);

    const button = container.querySelector(
      VDS_PLAY_BUTTON_ELEMENT_TAG_NAME,
    ) as PlayButtonElement;

    return { provider, button };
  }

  it('should render DOM correctly', async () => {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-play-button>
        <div class="play" slot="play"></div>
        <div class="pause" slot="pause" hidden></div>
      </vds-play-button>
    `);
  });

  it('should render shadow DOM correctly', async () => {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        label="Play"
        part="root button"
        exportparts="root: button-root"
      >
        <slot name="pause"></slot>
        <slot name="play"></slot>
      </button>
    `);
  });

  it('should render play/pause slots', async () => {
    const { button } = await buildFixture();
    const playSlot = getSlottedChildren(button, 'play')[0];
    const pauseSlot = getSlottedChildren(button, 'pause')[0];
    expect(playSlot).to.have.class('play');
    expect(pauseSlot).to.have.class('pause');
  });

  it('should set pause slot to hidden when paused is true', async () => {
    const { button } = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    const playSlot = getSlottedChildren(button, 'play')[0];
    const pauseSlot = getSlottedChildren(button, 'pause')[0];
    expect(pauseSlot).to.have.attribute('hidden', '');
    expect(playSlot).to.not.have.attribute('hidden');
  });

  it('should set play slot to hidden when paused is false', async () => {
    const { button } = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    const playSlot = getSlottedChildren(button, 'play')[0];
    const pauseSlot = getSlottedChildren(button, 'pause')[0];
    expect(playSlot).to.have.attribute('hidden', '');
    expect(pauseSlot).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsPlayRequestEvent.TYPE} when clicked while paused`, async () => {
    const { button } = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsPlayRequestEvent.TYPE);
  });

  it(`should emit ${VdsPauseRequestEvent.TYPE} when clicked while not paused`, async () => {
    const { button } = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsPauseRequestEvent.TYPE);
  });

  it('should receive transfromed paused context updates', async () => {
    const { provider, button } = await buildFixture();
    provider.context.paused = false;
    await elementUpdated(button);
    expect(button.pressed).to.be.true;
    provider.context.paused = true;
    await elementUpdated(button);
    expect(button.pressed).to.be.false;
  });
});
