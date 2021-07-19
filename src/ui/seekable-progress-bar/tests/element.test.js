import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../media/test-utils/index.js';
import {
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
} from '../SeekableProgressBarElement.js';

window.customElements.define(
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
);

describe(SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-seekable-progress-bar></vds-seekable-progress-bar>
    `);

    const seekableProgressBar = /** @type {SeekableProgressBarElement} */ (
      container.querySelector(SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME)
    );

    return { seekableProgressBar };
  }

  it('should render DOM correctly', async function () {
    const { seekableProgressBar } = await buildFixture();
    expect(seekableProgressBar).dom.to.equal(`
      <vds-seekable-progress-bar></vds-seekable-progress-bar>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { seekableProgressBar } = await buildFixture();
    expect(seekableProgressBar).shadowDom.to.equal(`
      <div
        aria-label="Amount of seekable media"
        aria-valuemax="0"
        aria-valuemin="0"
        aria-valuenow="0"
        aria-valuetext="0 seconds out of 0 seconds"
        id="progressbar"
        part="root"
        role="progressbar"
        style="--vds-media-seekable:0;--vds-media-duration:0;"
      >
        <slot></slot>
      </div>
    `);
  });
});
