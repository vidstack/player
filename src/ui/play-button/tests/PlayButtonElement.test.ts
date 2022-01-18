import '../../../define/vds-play-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { waitForEvent } from '../../../global/tests/utils';
import { buildMediaPlayerFixture } from '../../../media/test-utils';

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

test('light DOM snapshot', async function () {
  const { button } = await buildFixture();
  expect(button).dom.toMatchSnapshot();
});

test('shadow DOM snapshot', async function () {
  const { button } = await buildFixture();
  expect(button).shadowDom.to.equal(`<slot></slot>`);
});

test('it should update paused state', async function () {
  const { player, button } = await buildFixture();

  player._mediaStore.paused.set(true);
  await elementUpdated(button);

  expect(button.isPressed).to.be.false;
  expect(button.getAttribute('aria-pressed')).to.equal('false');
  expect(button.hasAttribute('media-paused')).to.be.true;

  player._mediaStore.paused.set(false);
  await elementUpdated(button);

  expect(button.isPressed).to.be.true;
  expect(button.getAttribute('aria-pressed')).to.equal('true');
  expect(button.hasAttribute('media-paused')).to.be.false;
});

test('it should play', async function () {
  const { player, button } = await buildFixture();

  const pausedSpy = vi.spyOn(player, 'paused', 'set');

  player._mediaStore.paused.set(true);
  await elementUpdated(button);

  setTimeout(() => button.click());

  await waitForEvent(button, 'vds-play-request');
  expect(pausedSpy).to.toHaveBeenCalledWith(false);
});

test('it should pause', async function () {
  const { player, button } = await buildFixture();

  const pausedSpy = vi.spyOn(player, 'paused', 'set');

  player._mediaStore.paused.set(false);
  await elementUpdated(button);

  setTimeout(() => button.click());

  await waitForEvent(button, 'vds-pause-request');
  expect(pausedSpy).to.toHaveBeenCalledWith(true);
});
