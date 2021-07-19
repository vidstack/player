import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../media/test-utils/index.js';
import {
  SCRUBBER_ELEMENT_TAG_NAME,
  ScrubberElement
} from '../ScrubberElement.js';

window.customElements.define(SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);

describe(SCRUBBER_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-scrubber></vds-scrubber>
    `);

    const scrubber = /** @type {ScrubberElement} */ (
      container.querySelector(SCRUBBER_ELEMENT_TAG_NAME)
    );

    return { scrubber };
  }

  it('should render DOM correctly', async function () {
    const { scrubber } = await buildFixture();
    expect(scrubber).dom.to.equal(`
      <vds-scrubber
        label="Media time slider"
        orientation="horizontal"
        progress-label="Amount of seekable media"
      ></vds-scrubber>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { scrubber } = await buildFixture();
    expect(scrubber).shadowDom.to.equal(`
      <vds-time-slider
        exportparts="root: time-slider-root, thumb: time-slider-thumb, track: time-slider-track, track-fill: time-slider-track-fill"
        id="time-slider"
        keyboard-step="20"
        label="Media time slider"
        orientation="horizontal"
        part="time-slider"
        shift-key-multiplier="2"
        step="0.25"
        value-text="{currentTime} out of {duration}"
      >
        <slot></slot>
        <vds-seekable-progress-bar
          id="progress-bar"
          exportparts="root: progress-bar-root"
          label="Amount of seekable media"
          part="progress-bar"
          value-text="{seekableAmount} out of {duration}"
        >
          <slot name="progress-bar"></slot>
        </vds-seekable-progress-bar>
      </vds-time-slider>
    `);
  });

  // TODO: more tests.
});
