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
        style="--vds-scrubber-current-time:0; --vds-scrubber-seekable:0; --vds-scrubber-duration:0; --vds-scrubber-preview-time:0;"
      >
        <vds-slider
          exportparts="root: slider-root, thumb: slider-thumb, track: slider-track, track-fill: slider-track-fill"
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
          dragging="false"
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
