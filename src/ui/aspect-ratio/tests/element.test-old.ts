import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import {
  ASPECT_RATIO_ELEMENT_TAG_NAME,
  AspectRatioElement
} from '../AspectRatioElement';

window.customElements.define(ASPECT_RATIO_ELEMENT_TAG_NAME, AspectRatioElement);

describe(ASPECT_RATIO_ELEMENT_TAG_NAME, function () {
  it('should render DOM correctly', async function () {
    const container = await fixture(
      html`<vds-aspect-ratio></vds-aspect-ratio>`
    );
    expect(container).dom.to.equal(`
      <vds-aspect-ratio
        max-height="100vh"
        min-height="150px"
        ratio="2:1"
        style="--vds-aspect-ratio:0.5; --vds-min-height:150px; --vds-max-height:100vh;"
      ></vds-aspect-ratio>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const container = await fixture(
      html`<vds-aspect-ratio></vds-aspect-ratio>`
    );
    expect(container).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should set valid aspect ratio of 16:9', async function () {
    const container = await fixture<AspectRatioElement>(
      html`<vds-aspect-ratio ratio="16:9"></vds-aspect-ratio>`
    );

    expect(container.isValidRatio).to.be.true;
    expect(container.style.getPropertyValue('--vds-aspect-ratio')).to.equal(
      '0.5625'
    );
  });

  it('should set valid aspect ratio of 4:3', async function () {
    const container = await fixture<AspectRatioElement>(
      html`<vds-aspect-ratio ratio="4:3"></vds-aspect-ratio>`
    );

    expect(container.isValidRatio).to.be.true;
    expect(container.style.getPropertyValue('--vds-aspect-ratio')).to.equal(
      '0.75'
    );
  });

  it('should NOT set invalid aspect ratio', async function () {
    const container = await fixture<AspectRatioElement>(
      html`<vds-aspect-ratio ratio="16"></vds-aspect-ratio>`
    );

    expect(container.isValidRatio).to.be.false;
    expect(container.style.getPropertyValue('--vds-aspect-ratio')).to.equal(
      '0.5'
    );
  });

  it('should set min height', async function () {
    const container = await fixture<AspectRatioElement>(
      html`<vds-aspect-ratio min-height="50px"></vds-aspect-ratio>`
    );

    expect(container.style.getPropertyValue('--vds-min-height')).to.equal(
      '50px'
    );
  });

  it('should set max height', async function () {
    const container = await fixture<AspectRatioElement>(
      html`<vds-aspect-ratio max-height="50px"></vds-aspect-ratio>`
    );

    expect(container.style.getPropertyValue('--vds-max-height')).to.equal(
      '50px'
    );
  });
});
