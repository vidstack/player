import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
} from '../ScrubberPreviewElement';

window.customElements.define(
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
);

describe(SCRUBBER_PREVIEW_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-scrubber-preview></vds-scrubber-preview>
    `);

    const scrubberPreview = player.querySelector(
      SCRUBBER_PREVIEW_ELEMENT_TAG_NAME
    )!;

    return { scrubberPreview };
  }

  test('it should render DOM correctly', async function () {
    const { scrubberPreview } = await buildFixture();
    expect(scrubberPreview).dom.to.equal(
      `<vds-scrubber-preview style="--vds-media-duration:0;"></vds-scrubber-preview>`
    );
  });

  test('it should render shadow DOM correctly', async function () {
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
