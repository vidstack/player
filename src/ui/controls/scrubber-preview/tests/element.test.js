import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
} from '../ScrubberPreviewElement.js';

window.customElements.define(
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
);

describe(SCRUBBER_PREVIEW_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-scrubber-preview></vds-scrubber-preview>
    `);

    const scrubberPreview = /** @type {ScrubberPreviewElement} */ (
      container.querySelector(SCRUBBER_PREVIEW_ELEMENT_TAG_NAME)
    );

    return { scrubberPreview };
  }

  it('should render DOM correctly', async function () {
    const { scrubberPreview } = await buildFixture();
    expect(scrubberPreview).dom.to.equal(
      `<vds-scrubber-preview></vds-scrubber-preview>`
    );
  });

  it('should render shadow DOM correctly', async function () {
    const { scrubberPreview } = await buildFixture();
    expect(scrubberPreview).shadowDom.to.equal(`
      <div
        id="track"
        part="track"
      >
        <slot></slot>

        <div
          hidden=""
          id="track-fill"
          part="track-fill"
        >
          <slot name="track-fill"></slot>
        </div>

        <slot name="track"></slot>
      </div>
    `);
  });
});
