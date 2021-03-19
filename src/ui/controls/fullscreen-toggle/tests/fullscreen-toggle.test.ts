import { elementUpdated, expect, html, oneEvent } from '@open-wc/testing';

import {
  FakeMediaProvider,
  VdsUserFullscreenChangeEvent,
} from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { FullscreenToggle } from '../FullscreenToggle';
import { FULLSCREEN_TOGGLE_TAG_NAME } from '../vds-fullscreen-toggle';

describe(FULLSCREEN_TOGGLE_TAG_NAME, () => {
  async function buildFixture(): Promise<
    [FakeMediaProvider, FullscreenToggle]
  > {
    const provider = await buildFakeMediaProvider(html`
      <vds-fullscreen-toggle>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit"></div>
      </vds-fullscreen-toggle>
    `);

    const toggle = provider.querySelector(
      FULLSCREEN_TOGGLE_TAG_NAME,
    ) as FullscreenToggle;

    return [provider, toggle];
  }

  it('should render dom correctly', async () => {
    const [, toggle] = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-fullscreen-toggle>
        <div class="enter" slot="enter"></div>
        <div class="exit" slot="exit" hidden></div>
      </vds-fullscreen-toggle>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, toggle] = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <vds-control
        id="root"
        class="root"
        label="Fullscreen"
        part="root control"
        exportparts="button: control-button, root: control-root, root-mobile: control-root-mobile"
      >
        <slot name="exit"></slot>
        <slot name="enter"></slot>
      </button>
    `);
  });

  it('should render enter/exit slots', async () => {
    const [, toggle] = await buildFixture();
    const enterSlot = getSlottedChildren(toggle, 'enter')[0];
    const exitSlot = getSlottedChildren(toggle, 'exit')[0];
    expect(enterSlot).to.have.class('enter');
    expect(exitSlot).to.have.class('exit');
  });

  it('should set exit slot to hidden when not fullscreened', async () => {
    const [, toggle] = await buildFixture();
    toggle.on = false;
    await elementUpdated(toggle);
    const enterSlot = getSlottedChildren(toggle, 'enter')[0];
    const exitSlot = getSlottedChildren(toggle, 'exit')[0];
    expect(enterSlot).to.not.have.attribute('hidden');
    expect(exitSlot).to.have.attribute('hidden', '');
  });

  it('should set enter slot to hidden when fullscreened', async () => {
    const [, toggle] = await buildFixture();
    toggle.on = true;
    await elementUpdated(toggle);
    const enterSlot = getSlottedChildren(toggle, 'enter')[0];
    const exitSlot = getSlottedChildren(toggle, 'exit')[0];
    expect(enterSlot).to.have.attribute('hidden', '');
    expect(exitSlot).to.not.have.attribute('hidden');
  });

  it(`should emit ${VdsUserFullscreenChangeEvent.TYPE} with true detail when clicked while not fullscreened`, async () => {
    const [, toggle] = await buildFixture();
    toggle.on = false;
    await elementUpdated(toggle);
    setTimeout(() => toggle.click());
    const { detail } = await oneEvent(
      toggle,
      VdsUserFullscreenChangeEvent.TYPE,
    );
    expect(detail).to.be.true;
  });

  it(`should emit ${VdsUserFullscreenChangeEvent.TYPE} with false detail when clicked while fullscreened`, async () => {
    const [, toggle] = await buildFixture();
    toggle.on = true;
    await elementUpdated(toggle);
    setTimeout(() => toggle.click());
    const { detail } = await oneEvent(
      toggle,
      VdsUserFullscreenChangeEvent.TYPE,
    );
    expect(detail).to.be.false;
  });

  it('should receive fullscreen context updates', async () => {
    const [provider, toggle] = await buildFixture();
    provider.context.fullscreen = true;
    await elementUpdated(toggle);
    expect(toggle.on).to.be.true;
    provider.context.fullscreen = false;
    await elementUpdated(toggle);
    expect(toggle.on).to.be.false;
  });
});
