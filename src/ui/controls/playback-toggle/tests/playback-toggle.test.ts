import { elementUpdated, expect, html, oneEvent } from '@open-wc/testing';

import {
  FakeMediaProvider,
  VdsUserPauseEvent,
  VdsUserPlayEvent,
} from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { getSlottedChildren } from '../../../../utils/dom';
import { PlaybackToggle } from '../PlaybackToggle';
import { PLAYBACK_TOGGLE_TAG_NAME } from '../vds-playback-toggle';

describe(PLAYBACK_TOGGLE_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, PlaybackToggle]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-playback-toggle>
        <div class="play" slot="play"></div>
        <div class="pause" slot="pause"></div>
      </vds-playback-toggle>
    `);

    const toggle = provider.querySelector(
      PLAYBACK_TOGGLE_TAG_NAME,
    ) as PlaybackToggle;

    return [provider, toggle];
  }

  it('should render dom correctly', async () => {
    const [, toggle] = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-playback-toggle>
        <div class="play" slot="play"></div>
        <div class="pause" slot="pause" hidden></div>
      </vds-playback-toggle>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, toggle] = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <vds-control
        id="root"
        class="root"
        label="Play"
        part="root control"
        exportparts="button: control-button, root: control-root, root-mobile: control-root-mobile"
      >
        <slot name="pause"></slot>
        <slot name="play"></slot>
      </button>
    `);
  });

  it('should render play/pause slots', async () => {
    const [, toggle] = await buildFixture();
    const playSlot = getSlottedChildren(toggle, 'play')[0];
    const pauseSlot = getSlottedChildren(toggle, 'pause')[0];
    expect(playSlot).to.have.class('play');
    expect(pauseSlot).to.have.class('pause');
  });

  it('should set pause slot to hidden when paused is true', async () => {
    const [, toggle] = await buildFixture();
    toggle.on = false;
    await elementUpdated(toggle);
    const playSlot = getSlottedChildren(toggle, 'play')[0];
    const pauseSlot = getSlottedChildren(toggle, 'pause')[0];
    expect(pauseSlot).to.have.attribute('hidden', '');
    expect(playSlot).to.not.have.attribute('hidden');
  });

  it('should set play slot to hidden when paused is false', async () => {
    const [, toggle] = await buildFixture();
    toggle.on = true;
    await elementUpdated(toggle);
    const playSlot = getSlottedChildren(toggle, 'play')[0];
    const pauseSlot = getSlottedChildren(toggle, 'pause')[0];
    expect(playSlot).to.have.attribute('hidden', '');
    expect(pauseSlot).to.not.have.attribute('hidden');
  });

  it('should toggle pressed state correctly', async () => {
    const [, toggle] = await buildFixture();
    const control = toggle.shadowRoot?.querySelector('vds-control');

    toggle.on = false;
    await elementUpdated(toggle);

    expect(control).to.not.have.attribute('pressed');

    toggle.on = true;
    await elementUpdated(toggle);

    expect(control).to.have.attribute('pressed');
  });

  it('should set disabled attribute', async () => {
    const [, toggle] = await buildFixture();
    const control = toggle.shadowRoot?.querySelector('vds-control');

    toggle.disabled = true;
    await elementUpdated(toggle);

    expect(control).to.have.attribute('disabled');
  });

  it(`should emit ${VdsUserPlayEvent.TYPE} when clicked while paused`, async () => {
    const [, toggle] = await buildFixture();
    toggle.on = false;
    await elementUpdated(toggle);
    setTimeout(() => toggle.click());
    await oneEvent(toggle, VdsUserPlayEvent.TYPE);
  });

  it(`should emit ${VdsUserPauseEvent.TYPE} when clicked while not paused`, async () => {
    const [, toggle] = await buildFixture();
    toggle.on = true;
    await elementUpdated(toggle);
    setTimeout(() => toggle.click());
    await oneEvent(toggle, VdsUserPauseEvent.TYPE);
  });

  it('should receive transfromed paused context updates', async () => {
    const [provider, toggle] = await buildFixture();
    provider.context.paused = false;
    await elementUpdated(toggle);
    expect(toggle.on).to.be.true;
    provider.context.paused = true;
    await elementUpdated(toggle);
    expect(toggle.on).to.be.false;
  });
});
