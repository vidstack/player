import { expect } from '@open-wc/testing';
import { html } from 'lit-element';

import { FakeMediaProvider } from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { Scrubber } from '../Scrubber';
import { SCRUBBER_TAG_NAME } from '../vds-scrubber';

describe(SCRUBBER_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, Scrubber]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-scrubber></vds-scrubber>
    `);

    const scrubber = provider.querySelector(SCRUBBER_TAG_NAME) as Scrubber;

    return [provider, scrubber];
  }

  it('should render dom correctly', async () => {
    const [, scrubber] = await buildFixture();
    expect(scrubber).dom.to.equal(`<vds-scrubber></vds-scrubber>`);
  });

  it('should render shadow dom correctly', async () => {
    const [, scrubber] = await buildFixture();
    expect(scrubber).shadowDom.to.equal(`
      <div
        id="root"
        part="root"
        style="--vds-scrubber-current-time:0; --vds-scrubber-buffered:0; --vds-scrubber-duration:0;"
      >
        <vds-slider
          exportparts="root: slider-root, root-dragging: slider-root-dragging, root-orientation-vertical: slider-root-orientation-vertical, thumb: slider-thumb, thumb-dragging: slider-thumb-dragging, track: slider-track, track-dragging: slider-track-dragging, track-fill: slider-track-fill, track-fill-dragging: slider-track-fill-dragging"
          id="slider"
          label="Time scrubber"
          max="0"
          min="0"
          orientation="horizontal"
          part="slider"
          step="0.01"
          step-multiplier="5"
          throttle="10"
          value="0"
          value-text="0 seconds out of 0 seconds"
        >
          <slot name="slider"></slot>
          
          <div
            aria-label="Amount buffered"
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
        </vds-slider>

        <slot></slot>
        
        <slot name="preview"></slot>
      </div>
    `);
  });
});
