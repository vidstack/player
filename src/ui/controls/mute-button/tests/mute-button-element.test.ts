import { elementUpdated, expect, html, oneEvent } from '@open-wc/testing';

import {
  FakeMediaProviderElement,
  VdsMuteRequestEvent,
  VdsUnmuteRequestEvent,
} from '../../../../core';
import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { MuteButtonElement } from '../MuteButtonElement';
import { VDS_MUTE_BUTTON_ELEMENT_TAG_NAME } from '../vds-mute-button';

describe(VDS_MUTE_BUTTON_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    provider: FakeMediaProviderElement;
    button: MuteButtonElement;
  }> {
    const { container, provider } = await buildMediaFixture(html`
      <vds-mute-button>
        <div class="mute" slot="mute"></div>
        <div class="unmute" slot="unmute"></div>
      </vds-mute-button>
    `);

    const button = container.querySelector(
      VDS_MUTE_BUTTON_ELEMENT_TAG_NAME,
    ) as MuteButtonElement;

    return { provider, button };
  }

  it('should render DOM correctly', async () => {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-mute-button>
        <div class="mute" slot="mute"></div>
        <div class="unmute" slot="unmute" hidden></div>
      </vds-mute-button>
    `);
  });

  it('should render shadow DOM correctly', async () => {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        label="Mute"
        part="root button"
        exportparts="root: button-root"
      >
        <slot name="unmute"></slot>
        <slot name="mute"></slot>
      </button>
    `);
  });

  it('should render mute/unmute slots', async () => {
    const { button } = await buildFixture();
    const muteSlot = getSlottedChildren(button, 'mute')[0];
    const unmuteSlot = getSlottedChildren(button, 'unmute')[0];
    expect(muteSlot).to.have.class('mute');
    expect(unmuteSlot).to.have.class('unmute');
  });

  it('should set unmute slot to hidden when unmuted', async () => {
    const { button } = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    const muteSlot = getSlottedChildren(button, 'mute')[0];
    const unmuteSlot = getSlottedChildren(button, 'unmute')[0];
    expect(muteSlot).to.not.have.attribute('hidden');
    expect(unmuteSlot).to.have.attribute('hidden', '');
  });

  it('should set mute slot to hidden when muted', async () => {
    const { button } = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    const muteSlot = getSlottedChildren(button, 'mute')[0];
    const unmuteSlot = getSlottedChildren(button, 'unmute')[0];
    expect(muteSlot).to.have.attribute('hidden', '');
    expect(unmuteSlot).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsMuteRequestEvent.TYPE} with true detail clicked while unmuted`, async () => {
    const { button } = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsMuteRequestEvent.TYPE);
  });

  it(`should emit ${VdsUnmuteRequestEvent.TYPE} with false detail when clicked while muted`, async () => {
    const { button } = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsUnmuteRequestEvent.TYPE);
  });

  it('should receive muted context updates', async () => {
    const { provider, button } = await buildFixture();
    provider.context.muted = true;
    await elementUpdated(button);
    expect(button.pressed).to.be.true;
    provider.context.muted = false;
    await elementUpdated(button);
    expect(button.pressed).to.be.false;
  });
});
