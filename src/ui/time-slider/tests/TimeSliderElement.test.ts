import '../../../define/vds-time-slider';

import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-time-slider></vds-time-slider>
  `);

  const timeSlider = player.querySelector('vds-time-slider')!;

  return { timeSlider };
}

test('light DOM snapshot', async function () {
  const { timeSlider } = await buildFixture();
  expect(timeSlider).dom.to.equal(`
    <vds-time-slider
      aria-label="Media time"
      aria-orientation="horizontal"
      aria-valuemax="0"
      aria-valuemin="0"
      aria-valuenow="0"
      aria-valuetext="0 seconds out of 0 seconds"
      autocomplete="off"
      role="slider"
      tabindex="0"
    ></vds-time-slider>
  `);
});
