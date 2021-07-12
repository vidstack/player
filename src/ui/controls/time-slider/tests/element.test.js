import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils/index.js';
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

  it('should render shadow DOM correctly', async function () {
    const { timeSlider } = await buildFixture();
    expect(timeSlider).shadowDom.to.equal(`
      <vds-slider
        exportparts="root: slider-root, thumb: slider-thumb, track: slider-track, track-fill: slider-track-fill"
        id="slider"
        keyboard-step="5"
        label="Media time slider"
        min="0"
        max="100"
        orientation="horizontal"
        part="slider"
        shift-key-multiplier="2"
        step="0.25"
        value="0"
        value-max="0"
        value-min="0"
        value-now="0"
        value-text="0 seconds out of 0 seconds"
      >
        <slot></slot>
      </vds-slider>
    `);
  });
});
