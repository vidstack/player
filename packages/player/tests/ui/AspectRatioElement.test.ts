import '$lib/define/vds-aspect-ratio';

import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { AspectRatioElement } from '$lib';

async function buildFixture(props: Partial<AspectRatioElement> = {}) {
  const aspectRatioElement = await fixture<AspectRatioElement>(
    html`
      <vds-aspect-ratio
        ratio=${ifDefined(props.ratio)}
        min-height=${ifDefined(props.minHeight)}
        max-height=${ifDefined(props.maxHeight)}
      ></vds-aspect-ratio>
    `,
  );

  const container = aspectRatioElement.shadowRoot!.querySelector('.container') as HTMLDivElement;

  return { aspectRatioElement, container };
}

it('should render light DOM', async function () {
  const { aspectRatioElement } = await buildFixture();
  expect(aspectRatioElement).dom.to.equal(`
      <vds-aspect-ratio></vds-aspect-ratio>
    `);
});

it('should render shadow DOM', async function () {
  const { aspectRatioElement } = await buildFixture();
  expect(aspectRatioElement).shadowDom.to.equal(`
    <div
      class="container"
      style="--vds-aspect-ratio-percent:50%;--vds-aspect-ratio-min-height:150px;--vds-aspect-ratio-max-height:100vh;"
    >
      <slot></slot>
    </div>
  `);
});

it('should set valid aspect ratio of 16/9', async function () {
  const { aspectRatioElement, container } = await buildFixture({ ratio: '16/9' });
  expect(aspectRatioElement.isValidRatio).to.be.true;
  expect(container.style.getPropertyValue('--vds-aspect-ratio-percent')).to.equal('56.25%');
});

it('should set valid aspect ratio of 4/3', async function () {
  const { aspectRatioElement, container } = await buildFixture({ ratio: '4/3' });
  expect(aspectRatioElement.isValidRatio).to.be.true;
  expect(container.style.getPropertyValue('--vds-aspect-ratio-percent')).to.equal('75%');
});

it('should NOT set invalid aspect ratio', async function () {
  const { aspectRatioElement, container } = await buildFixture({ ratio: '16' });
  expect(aspectRatioElement.isValidRatio).to.be.false;
  expect(container.style.getPropertyValue('--vds-aspect-ratio-percent')).to.equal('50%');
});

it('should set min height', async function () {
  const { container } = await buildFixture({ minHeight: '50px' });
  expect(container.style.getPropertyValue('--vds-aspect-ratio-min-height')).to.equal('50px');
});

it('should set max height', async function () {
  const { container } = await buildFixture({ maxHeight: '50px' });
  expect(container.style.getPropertyValue('--vds-aspect-ratio-max-height')).to.equal('50px');
});
