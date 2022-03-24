import '$lib/define/vds-time-slider';

import { html } from 'lit';

import { buildMediaPlayerFixture } from '$test-utils';

async function buildFixture() {
  const { media } = await buildMediaPlayerFixture(html` <vds-time-slider></vds-time-slider> `);
  const timeSlider = media.querySelector('vds-time-slider')!;
  return { timeSlider };
}

it('should render light DOM', async function () {
  const { timeSlider } = await buildFixture();
  expect(timeSlider).dom.to.equal(`
    <vds-time-slider
      aria-label="Media time"
      aria-orientation="horizontal"
      aria-valuemax="100%"
      aria-valuemin="0%"
      aria-valuenow="0%"
      aria-valuetext="0 seconds out of 0 seconds"
      autocomplete="off"
      role="slider"
      tabindex="0"
      style="--vds-slider-fill-value: 0; --vds-slider-fill-rate: 0; --vds-slider-fill-percent: 0%; --vds-slider-pointer-value: 0; --vds-slider-pointer-rate: 0; --vds-slider-pointer-percent: 0%;"
    ></vds-time-slider>
  `);
});
