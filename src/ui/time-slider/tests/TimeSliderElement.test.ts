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
      label="Media time slider"
      orientation="horizontal"
    ></vds-time-slider>
  `);
});
