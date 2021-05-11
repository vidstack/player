import { elementUpdated, expect, html, oneEvent } from '@open-wc/testing';

import {
  FakeMediaProviderElement,
  VdsUserFullscreenChangeEvent,
} from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/fakes.helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { FullscreenButtonElement } from '../FullscreenButtonElement';
import { VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from '../vds-fullscreen-button';

describe(VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<
    [FakeMediaProviderElement, FullscreenButtonElement]
  > {
    const provider = await buildFakeMediaProvider(html`
      <vds-fullscreen-button>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit"></div>
      </vds-fullscreen-button>
    `);

    const button = provider.querySelector(
      VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
    ) as FullscreenButtonElement;

    return [provider, button];
  }

  it('should render dom correctly', async () => {
    const [, button] = await buildFixture();
    expect(button).dom.to.equal(`
      <vds-fullscreen-button>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit" hidden></div>
      </vds-fullscreen-button>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, button] = await buildFixture();
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
    const [, button] = await buildFixture();
    const enterSlot = getSlottedChildren(button, 'enter')[0];
    const exitSlot = getSlottedChildren(button, 'exit')[0];
    expect(enterSlot).to.have.class('enter');
    expect(exitSlot).to.have.class('exit');
  });

  it('should set exit slot to hidden when not fullscreened', async () => {
    const [, button] = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    const enterSlot = getSlottedChildren(button, 'enter')[0];
    const exitSlot = getSlottedChildren(button, 'exit')[0];
    expect(enterSlot).to.not.have.attribute('hidden');
    expect(exitSlot).to.have.attribute('hidden', '');
  });

  it('should set enter slot to hidden when fullscreened', async () => {
    const [, button] = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    const enterSlot = getSlottedChildren(button, 'enter')[0];
    const exitSlot = getSlottedChildren(button, 'exit')[0];
    expect(enterSlot).to.have.attribute('hidden', '');
    expect(exitSlot).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsUserFullscreenChangeEvent.TYPE} with true detail when clicked while not fullscreened`, async () => {
    const [, button] = await buildFixture();
    button.pressed = false;
    await elementUpdated(button);
    setTimeout(() => button.click());
    const { detail } = await oneEvent(
      button,
      VdsUserFullscreenChangeEvent.TYPE,
    );
    expect(detail).to.be.true;
  });

  it(`should emit ${VdsUserFullscreenChangeEvent.TYPE} with false detail when clicked while fullscreened`, async () => {
    const [, button] = await buildFixture();
    button.pressed = true;
    await elementUpdated(button);
    setTimeout(() => button.click());
    const { detail } = await oneEvent(
      button,
      VdsUserFullscreenChangeEvent.TYPE,
    );
    expect(detail).to.be.false;
  });

  it('should receive fullscreen context updates', async () => {
    const [provider, button] = await buildFixture();
    provider.context.fullscreen = true;
    await elementUpdated(button);
    expect(button.pressed).to.be.true;
    provider.context.fullscreen = false;
    await elementUpdated(button);
    expect(button.pressed).to.be.false;
  });
});
