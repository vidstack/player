import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { stub } from 'sinon';

import {
  FakeMediaProviderElement,
  VdsEnterFullscreenRequestEvent,
  VdsExitFullscreenRequestEvent,
} from '../../../../core';
import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { FullscreenButtonElement } from '../FullscreenButtonElement';
import { VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from '../vds-fullscreen-button';

describe(VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    provider: FakeMediaProviderElement;
    button: FullscreenButtonElement;
  }> {
    const { container, provider } = await buildMediaFixture(html`
      <vds-fullscreen-button>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit"></div>
      </vds-fullscreen-button>
    `);

    // Stub this to avoid fullscreen error in test environment.
    stub(container, 'requestFullscreen').returns(Promise.resolve());

    const button = container.querySelector(
      VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
    ) as FullscreenButtonElement;

    return { provider, button };
  }

  it('should render DOM correctly', async () => {
    const { button } = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-fullscreen-button>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit" hidden></div>
      </vds-fullscreen-button>
    `);
  });

  it('should render shadow DOM correctly', async () => {
    const { button } = await buildFixture();
    expect(button).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        label="Fullscreen"
        part="root button"
        exportparts="root: button-root"
      >
        <slot name="exit"></slot>
        <slot name="enter"></slot>
      </button>
    `);
  });

  it('should render enter/exit slots', async () => {
    const { button } = await buildFixture();
    const enterSlot = getSlottedChildren(button, 'enter')[0];
    const exitSlot = getSlottedChildren(button, 'exit')[0];
    expect(enterSlot).to.have.class('enter');
    expect(exitSlot).to.have.class('exit');
  });

  it('should set exit slot to hidden when not in fullscreen', async () => {
    const { button } = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    const enterSlot = getSlottedChildren(button, 'enter')[0];
    const exitSlot = getSlottedChildren(button, 'exit')[0];
    expect(enterSlot).to.not.have.attribute('hidden');
    expect(exitSlot).to.have.attribute('hidden', '');
  });

  it('should set enter slot to hidden when in fullscreen', async () => {
    const { button } = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    const enterSlot = getSlottedChildren(button, 'enter')[0];
    const exitSlot = getSlottedChildren(button, 'exit')[0];
    expect(enterSlot).to.have.attribute('hidden', '');
    expect(exitSlot).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsEnterFullscreenRequestEvent.TYPE} when clicked while not in fullscreen`, async () => {
    const { button } = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsEnterFullscreenRequestEvent.TYPE);
  });

  it(`should emit ${VdsExitFullscreenRequestEvent.TYPE} when clicked while in fullscreen`, async () => {
    const { button } = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    await oneEvent(button, VdsExitFullscreenRequestEvent.TYPE);
  });

  it('should receive fullscreen context updates', async () => {
    const { provider, button } = await buildFixture();
    provider.context.fullscreen = true;
    await elementUpdated(button);
    expect(button.pressed).to.be.true;
    provider.context.fullscreen = false;
    await elementUpdated(button);
    expect(button.pressed).to.be.false;
  });
});
