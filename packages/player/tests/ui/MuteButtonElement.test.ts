import '$lib/define/vds-mute-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { buildMediaFixture } from '$test-utils';

async function buildFixture() {
  const { media, provider } = await buildMediaFixture(html`
    <vds-mute-button>
      <div class="mute"></div>
      <div class="unmute"></div>
    </vds-mute-button>
  `);

  const button = media.querySelector('vds-mute-button')!;

  return { media, provider, button };
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
  const { media, button } = await buildFixture();

  media.controller._store.muted.set(true);
  await elementUpdated(button);

  expect(button.pressed).to.be.true;
  expect(button.getAttribute('aria-pressed')).to.equal('true');
  expect(button.hasAttribute('media-muted')).to.be.true;

  media.controller._store.muted.set(false);
  await elementUpdated(button);

  expect(button.pressed).to.be.false;
  expect(button.getAttribute('aria-pressed')).to.equal('false');
  expect(button.hasAttribute('media-muted')).to.be.false;
});

it('should mute player', async function () {
  const { media, provider, button } = await buildFixture();

  const mutedSpy = vi.spyOn(provider, 'muted', 'set');

  media.controller._store.muted.set(false);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-mute-request');
  expect(mutedSpy).toHaveBeenCalledWith(true);
});

it('should unmute player', async function () {
  const { media, provider, button } = await buildFixture();

  const mutedSpy = vi.spyOn(provider, 'muted', 'set');

  media.controller._store.muted.set(true);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerdown')));

  await waitForEvent(button, 'vds-unmute-request');
  expect(mutedSpy).toHaveBeenCalledWith(false);
});
