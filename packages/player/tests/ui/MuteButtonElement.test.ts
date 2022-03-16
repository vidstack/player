import '$lib/define/vds-mute-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '$test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-mute-button>
      <div class="mute"></div>
      <div class="unmute"></div>
    </vds-mute-button>
  `);

  const button = player.querySelector('vds-mute-button')!;

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

it('should update muted state', async function () {
  const { player, button } = await buildFixture();

  player._store.muted.set(true);
  await elementUpdated(button);

  expect(button.pressed).to.be.true;
  expect(button.getAttribute('aria-pressed')).to.equal('true');
  expect(button.hasAttribute('media-muted')).to.be.true;

  player._store.muted.set(false);
  await elementUpdated(button);

  expect(button.pressed).to.be.false;
  expect(button.getAttribute('aria-pressed')).to.equal('false');
  expect(button.hasAttribute('media-muted')).to.be.false;
});

it('should mute player', async function () {
  const { player, button } = await buildFixture();

  const mutedSpy = vi.spyOn(player, 'muted', 'set');

  player._store.muted.set(false);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-mute-request');
  expect(mutedSpy).toHaveBeenCalledWith(true);
});

it('should unmute player', async function () {
  const { player, button } = await buildFixture();

  const mutedSpy = vi.spyOn(player, 'muted', 'set');

  player._store.muted.set(true);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-unmute-request');
  expect(mutedSpy).toHaveBeenCalledWith(false);
});
