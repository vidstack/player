import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
} from '../../scrubber-preview';
import {
  SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME,
  ScrubberPreviewTimeElement
} from '../ScrubberPreviewTimeElement';

window.customElements.define(
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
);

window.customElements.define(
  SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME,
  ScrubberPreviewTimeElement
);

describe(SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const scrubberPreview = await fixture<ScrubberPreviewElement>(html`
      <vds-scrubber-preview>
        <vds-scrubber-preview-time></vds-scrubber-preview-time>
      </vds-scrubber-preview>
    `);

    const scrubberPreviewTime = scrubberPreview.querySelector(
      SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME
    ) as ScrubberPreviewTimeElement;

    return { scrubberPreview, scrubberPreviewTime };
  }

  it('should render DOM correctly', async function () {
    const { scrubberPreviewTime } = await buildFixture();
    expect(scrubberPreviewTime).dom.to.equal(`
      <vds-scrubber-preview-time
        hidden
        style="position: absolute; left: 0px; will-change: transform;"
      >
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { scrubberPreview, scrubberPreviewTime } = await buildFixture();

    scrubberPreview.ctx.time = 3750;
    await elementUpdated(scrubberPreviewTime);

    expect(scrubberPreviewTime).shadowDom.to.equal(`
      <time
        id="root"
        aria-label="Media scrubber preview time"
        datetime="PT1H2M30S"
        part="root time"
      >
        1:02:30
      </time>
    `);
  });

  it('should update preview time as context updates', async function () {
    const { scrubberPreview, scrubberPreviewTime } = await buildFixture();
    expect(scrubberPreviewTime.seconds).to.equal(0);
    scrubberPreview.ctx.time = 50;
    await elementUpdated(scrubberPreviewTime);
    expect(scrubberPreviewTime.seconds).to.equal(50);
  });
});
