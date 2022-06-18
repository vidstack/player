import '$define/vds-time-slider';

import { html } from 'lit';

import { buildMediaFixture } from '$test-utils';

async function buildFixture() {
  const { media } = await buildMediaFixture(html` <vds-time-slider></vds-time-slider> `);
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
      style="--vds-fill-value: 0; --vds-fill-rate: 0; --vds-fill-percent: 0%; --vds-pointer-value: 0; --vds-pointer-rate: 0; --vds-pointer-percent: 0%;"
    ></vds-time-slider>
  `);
});
