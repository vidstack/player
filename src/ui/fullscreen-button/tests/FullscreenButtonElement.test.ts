import '../../../define/vds-fullscreen-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { waitForEvent } from '../../../global/tests/utils';
import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-fullscreen-button>
      <div class="enter"></div>
      <div class="exit"></div>
    </vds-fullscreen-button>
  `);

  const button = player.querySelector('vds-fullscreen-button')!;

  await player.forceMediaReady();

  return { player, button };
}

test('light DOM snapshot', async function () {
  const { button } = await buildFixture();
  expect(button).dom.to.equal(`
    <vds-fullscreen-button hidden media-can-play>
      <div class="enter"></div>
      <div class="exit"></div>
    </vds-fullscreen-button>
  `);
});

test('shadow DOM snapshot', async function () {
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

test('it should update `hidden` attribute based on fullscreen support', async () => {
  const { player, button } = await buildFixture();

  player._mediaStore.canRequestFullscreen.set(true);
  await elementUpdated(button);
  expect(button.hasAttribute('hidden')).to.be.false;

  player._mediaStore.canRequestFullscreen.set(false);
  await elementUpdated(button);
  expect(button.hasAttribute('hidden')).to.be.true;
});

test('it should update fullscreen state', async () => {
  const { player, button } = await buildFixture();

  player._mediaStore.fullscreen.set(true);
  await elementUpdated(button);

  expect(button.isPressed).to.be.true;
  expect(button.hasAttribute('pressed')).to.be.true;
  expect(button.hasAttribute('media-fullscreen')).to.be.true;

  player._mediaStore.fullscreen.set(false);
  await elementUpdated(button);

  expect(button.isPressed).to.be.false;
  expect(button.hasAttribute('pressed')).to.be.false;
  expect(button.hasAttribute('media-fullscreen')).to.be.false;
});

test('it should enter fullscreen', async function () {
  const { player, button } = await buildFixture();

  const requestFullscreenSpy = vi
    .spyOn(player, 'requestFullscreen')
    .mockImplementation(() => Promise.resolve());

  player._mediaStore.fullscreen.set(false);

  await elementUpdated(button);

  setTimeout(() => button.click());

  await waitForEvent(button, 'vds-enter-fullscreen-request');
  expect(requestFullscreenSpy).to.toHaveBeenCalledOnce();
});

test('it should exit fullscreen', async function () {
  const { player, button } = await buildFixture();

  const exitFullscreenSpy = vi
    .spyOn(player, 'exitFullscreen')
    .mockImplementation(() => Promise.resolve());

  player._mediaStore.fullscreen.set(true);

  await elementUpdated(button);

  setTimeout(() => button.click());

  await waitForEvent(button, 'vds-exit-fullscreen-request');
  expect(exitFullscreenSpy).to.toHaveBeenCalledOnce();
});
