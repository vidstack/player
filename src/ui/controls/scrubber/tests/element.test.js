import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils/index.js';
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
    expect(scrubber).dom.to.equal(`<vds-scrubber></vds-scrubber>`);
  });

  it('should render shadow DOM correctly', async function () {
    const { scrubber } = await buildFixture();
    expect(scrubber).shadowDom.to.equal(`
      <div
        id="root"
        part="root"
        style="--vds-scrubber-current-time:0;--vds-scrubber-seekable:0;--vds-scrubber-duration:0;"
      >
        <vds-slider
          exportparts="root: slider-root, thumb: slider-thumb, track: slider-track, track-fill: slider-track-fill"
          id="slider"
          label="Time scrubber"
          max="0"
          min="0"
          orientation="horizontal"
          part="slider"
          step="0.5"
          step-multiplier="20"
          throttle="0"
          value="0"
          value-text="0 seconds out of 0 seconds"
        >
          <slot name="slider"></slot>

          <div
            aria-label="Amount seekable"
            aria-valuemax="0"
            aria-valuemin="0"
            aria-valuenow="0"
            aria-valuetext="0%"
            id="progress"
            part="progress"
            role="progressbar"
          >
            <slot name="progress"></slot>
          </div>

          <div
            hidden=""
            id="preview-track"
            part="preview-track"
          ></div>
        </vds-slider>

        <slot></slot>

        <slot name="preview"></slot>
      </div>
    `);
  });
});
