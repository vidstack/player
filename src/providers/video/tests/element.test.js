import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { VIDEO_ELEMENT_TAG_NAME, VideoElement } from '../VideoElement.js';

window.customElements.define(VIDEO_ELEMENT_TAG_NAME, VideoElement);

describe(VIDEO_ELEMENT_TAG_NAME, function () {
  it('should render DOM correctly', async function () {
    const video = await fixture(html`<vds-video></vds-video>`);
    expect(video).dom.to.equal(`<vds-video></vds-video>`);
  });

  it('should render shadow DOM correctly', async function () {
    const video = await fixture(html`<vds-video></vds-video>`);
    expect(video).shadowDom.to.equal(`
      <video part="media video">
        <slot></slot>
        Your browser does not support the <code>audio</code> or <code>video</code> element.
      </video>
    `);
  });
});
