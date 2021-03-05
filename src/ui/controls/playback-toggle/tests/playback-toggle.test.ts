import '../vds-playback-toggle';
import '../../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html, oneEvent } from '@open-wc/testing';

import {
  FakeMediaProvider,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
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
      'vds-playback-toggle',
    ) as PlaybackToggle;

    return [provider, toggle];
  }

  it('should render play/pause slots', async () => {
    const [, toggle] = await buildFixture();
    const playSlot = getSlottedChildren(toggle, 'play')[0];
    const pauseSlot = getSlottedChildren(toggle, 'pause')[0];
    expect(playSlot).to.have.class('play');
    expect(pauseSlot).to.have.class('pause');
  });

  it('should set pause slot to hidden when paused is true', async () => {
    const [, toggle] = await buildFixture();
    const playSlot = getSlottedChildren(toggle, 'play')[0];
    const pauseSlot = getSlottedChildren(toggle, 'pause')[0];
    expect(pauseSlot).to.have.attribute('hidden', '');
    expect(playSlot).to.not.have.attribute('hidden');
  });

  it('should set play slot to hidden when paused is true', async () => {
    const [, toggle] = await buildFixture();
    toggle.on = false;
    await elementUpdated(toggle);
    const playSlot = getSlottedChildren(toggle, 'play')[0];
    const pauseSlot = getSlottedChildren(toggle, 'pause')[0];
    expect(playSlot).to.have.attribute('hidden', '');
    expect(pauseSlot).to.not.have.attribute('hidden');
  });

  it('should toggle pressed state correctly', async () => {
    const [, toggle] = await buildFixture();
    const control = toggle.shadowRoot?.querySelector('vds-control');
    expect(control).to.have.attribute('pressed');

    toggle.on = false;
    await elementUpdated(toggle);

    expect(control).to.not.have.attribute('pressed');
  });

  it('should set disabled attribute', async () => {
    const [, toggle] = await buildFixture();
    const control = toggle.shadowRoot?.querySelector('vds-control');

    toggle.disabled = true;
    await elementUpdated(toggle);

    expect(control).to.have.attribute('disabled');
  });

  it(`should emit ${UserPlayRequestEvent.TYPE} when clicked while paused`, async () => {
    const [, toggle] = await buildFixture();
    setTimeout(() => toggle.click());
    await oneEvent(toggle, UserPlayRequestEvent.TYPE);
  });

  it(`should emit ${UserPauseRequestEvent.TYPE} when clicked while not paused`, async () => {
    const [, toggle] = await buildFixture();
    toggle.on = false;
    await elementUpdated(toggle);
    setTimeout(() => toggle.click());
    await oneEvent(toggle, UserPauseRequestEvent.TYPE);
  });

  it('should receive paused context updates', async () => {
    const [provider, toggle] = await buildFixture();
    provider.playerContext.pausedCtx = false;
    await elementUpdated(toggle);
    expect(toggle.on).to.be.false;
    provider.playerContext.pausedCtx = true;
    await elementUpdated(toggle);
    expect(toggle.on).to.be.true;
  });
});
