import '$lib/define/vds-fullscreen-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '$test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-fullscreen-button>
      <div class="enter"></div>
      <div class="exit"></div>
    </vds-fullscreen-button>
  `);

  const button = player.querySelector('vds-fullscreen-button')!;

  return { player, button };
}

it('should render light DOM', async function () {
  const { button } = await buildFixture();
  expect(button).dom.toMatchSnapshot();
});

it('should render shadow DOM', async function () {
  const { button } = await buildFixture();
  expect(button).shadowDom.to.equal(`<slot></slot>`);
});

it('should update `hidden` attribute based on fullscreen support', async () => {
  const { player, button } = await buildFixture();

  player._store.canFullscreen.set(true);
  await elementUpdated(button);
  expect(button.hasAttribute('hidden')).to.be.false;

  player._store.canFullscreen.set(false);
  await elementUpdated(button);
  expect(button.hasAttribute('hidden')).to.be.true;
});

it('should update fullscreen state', async () => {
  const { player, button } = await buildFixture();

  player._store.fullscreen.set(true);
  await elementUpdated(button);

  expect(button.pressed).to.be.true;
  expect(button.getAttribute('aria-pressed')).to.equal('true');
  expect(button.hasAttribute('media-fullscreen')).to.be.true;

  player._store.fullscreen.set(false);
  await elementUpdated(button);

  expect(button.pressed).to.be.false;
  expect(button.getAttribute('aria-pressed')).to.equal('false');
  expect(button.hasAttribute('media-fullscreen')).to.be.false;
});

it('should enter fullscreen', async function () {
  const { player, button } = await buildFixture();

  const requestFullscreenSpy = vi
    .spyOn(player, 'requestFullscreen')
    .mockImplementation(() => Promise.resolve());

  player._store.fullscreen.set(false);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-enter-fullscreen-request');
  expect(requestFullscreenSpy).toHaveBeenCalledOnce();
});

it('should exit fullscreen', async function () {
  const { player, button } = await buildFixture();

  const exitFullscreenSpy = vi
    .spyOn(player, 'exitFullscreen')
    .mockImplementation(() => Promise.resolve());

  player._store.fullscreen.set(true);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-exit-fullscreen-request');
  expect(exitFullscreenSpy).toHaveBeenCalledOnce();
});
