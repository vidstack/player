import '$lib/define/vds-play-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '$test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-play-button>
      <div class="play"></div>
      <div class="pause"></div>
    </vds-play-button>
  `);

  const button = player.querySelector('vds-play-button')!;

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

it('should update paused state', async function () {
  const { player, button } = await buildFixture();

  player._store.paused.set(true);
  await elementUpdated(button);

  expect(button.pressed).to.be.false;
  expect(button.getAttribute('aria-pressed')).to.equal('false');
  expect(button.hasAttribute('media-paused')).to.be.true;

  player._store.paused.set(false);
  await elementUpdated(button);

  expect(button.pressed).to.be.true;
  expect(button.getAttribute('aria-pressed')).to.equal('true');
  expect(button.hasAttribute('media-paused')).to.be.false;
});

it('should play', async function () {
  const { player, button } = await buildFixture();

  const pausedSpy = vi.spyOn(player, 'paused', 'set');

  player._store.paused.set(true);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-play-request');
  expect(pausedSpy).toHaveBeenCalledWith(false);
});

it('should pause', async function () {
  const { player, button } = await buildFixture();

  const pausedSpy = vi.spyOn(player, 'paused', 'set');

  player._store.paused.set(false);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-pause-request');
  expect(pausedSpy).toHaveBeenCalledWith(true);
});
