import '$lib/define/vds-play-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { buildMediaFixture } from '$test-utils';

async function buildFixture() {
  const { media, provider } = await buildMediaFixture(html`
    <vds-play-button>
      <div class="play"></div>
      <div class="pause"></div>
    </vds-play-button>
  `);

  const button = media.querySelector('vds-play-button')!;

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

it('should update paused state', async function () {
  const { media, button } = await buildFixture();

  media.controller._store.paused.set(true);
  await elementUpdated(button);

  expect(button.pressed).to.be.false;
  expect(button.getAttribute('aria-pressed')).to.equal('false');
  expect(button.hasAttribute('paused')).to.be.true;

  media.controller._store.paused.set(false);
  await elementUpdated(button);

  expect(button.pressed).to.be.true;
  expect(button.getAttribute('aria-pressed')).to.equal('true');
  expect(button.hasAttribute('paused')).to.be.false;
});

it('should play', async function () {
  const { media, provider, button } = await buildFixture();

  const pausedSpy = vi.spyOn(provider, 'paused', 'set');

  media.controller._store.paused.set(true);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerup')));

  await waitForEvent(button, 'vds-play-request');
  expect(pausedSpy).toHaveBeenCalledWith(false);
});

it('should pause', async function () {
  const { media, provider, button } = await buildFixture();

  const pausedSpy = vi.spyOn(provider, 'paused', 'set');

  media.controller._store.paused.set(false);
  await elementUpdated(button);

  setTimeout(() => button.dispatchEvent(new MouseEvent('pointerup')));

  await waitForEvent(button, 'vds-pause-request');
  expect(pausedSpy).toHaveBeenCalledWith(true);
});
