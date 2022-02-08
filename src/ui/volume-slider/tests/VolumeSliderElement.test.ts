import '../../../define/vds-slider';
import '../../../define/vds-volume-slider';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { vdsEvent } from '../../../base/events';
import { buildMediaPlayerFixture } from '../../../media/test-utils';
import { waitForEvent } from '../../../utils/events';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-volume-slider></vds-volume-slider>
  `);

  const volumeSlider = player.querySelector('vds-volume-slider')!;

  return { player, volumeSlider };
}

test('it should render DOM correctly', async function () {
  const { volumeSlider } = await buildFixture();
  expect(volumeSlider).dom.to.equal(`
    <vds-volume-slider
      aria-label="Media volume"
      aria-orientation="horizontal"
      aria-valuemax="100"
      aria-valuemin="0"
      aria-valuenow="100"
      aria-valuetext="100%"
      autocomplete="off"
      role="slider"
      tabindex="0"
      style="--vds-slider-fill-value: 100; --vds-slider-fill-rate: 1; --vds-slider-fill-percent: 100%; --vds-slider-pointer-value: 0; --vds-slider-pointer-rate: 0; --vds-slider-pointer-percent: 0%;"
    ></vds-volume-slider>
  `);
});

test('it should update when media volume changes', async function () {
  const { player, volumeSlider } = await buildFixture();

  expect(volumeSlider.volume).to.equal(1);

  player._mediaStore.volume.set(0.25);
  await elementUpdated(volumeSlider);

  expect(volumeSlider.volume).to.equal(0.25);

  player._mediaStore.volume.set(0.85);
  await elementUpdated(volumeSlider);

  expect(volumeSlider.volume).to.equal(0.85);
});

test('it should dispatch volume change request', async function () {
  const { player, volumeSlider } = await buildFixture();

  setTimeout(() => {
    volumeSlider.dispatchEvent(
      vdsEvent('vds-slider-drag-value-change', { detail: 80 })
    );
  }, 0);

  const { detail } = await waitForEvent(player, 'vds-volume-change-request');

  expect(detail).to.equal(0.8);
});
