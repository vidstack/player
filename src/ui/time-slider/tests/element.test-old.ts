import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  TIME_SLIDER_ELEMENT_TAG_NAME,
  TimeSliderElement
} from '../TimeSliderElement';

window.customElements.define(TIME_SLIDER_ELEMENT_TAG_NAME, TimeSliderElement);

describe(TIME_SLIDER_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-time-slider></vds-time-slider>
    `);

    const timeSlider = player.querySelector(TIME_SLIDER_ELEMENT_TAG_NAME)!;

    return { timeSlider };
  }

  test('it should render DOM correctly', async function () {
    const { timeSlider } = await buildFixture();
    expect(timeSlider).dom.to.equal(`
      <vds-time-slider
        label="Media time slider"
        orientation="horizontal"
      ></vds-time-slider>
    `);
  });

  // TODO: more tests.
});
