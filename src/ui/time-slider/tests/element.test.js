import { buildMediaFixture } from '@media/test-utils/index.js';
import { expect } from '@open-wc/testing';
import { html } from 'lit';

import {
  TIME_SLIDER_ELEMENT_TAG_NAME,
  TimeSliderElement
} from '../TimeSliderElement.js';

window.customElements.define(TIME_SLIDER_ELEMENT_TAG_NAME, TimeSliderElement);

describe(TIME_SLIDER_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-time-slider></vds-time-slider>
    `);

    const timeSlider = /** @type {TimeSliderElement} */ (
      container.querySelector(TIME_SLIDER_ELEMENT_TAG_NAME)
    );

    return { timeSlider };
  }

  it('should render DOM correctly', async function () {
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
