import { expect } from '@open-wc/testing';
import { html } from 'lit-element';

import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { ScrubberElement } from '../ScrubberElement';
import { VDS_SCRUBBER_ELEMENT_TAG_NAME } from '../vds-scrubber';

describe(VDS_SCRUBBER_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<{
    scrubber: ScrubberElement;
  }> {
    const { container } = await buildMediaFixture(html`
      <vds-scrubber></vds-scrubber>
    `);

    const scrubber = container.querySelector(
      VDS_SCRUBBER_ELEMENT_TAG_NAME,
    ) as ScrubberElement;

    return { scrubber };
  }

  it('should render DOM correctly', async () => {
    const { scrubber } = await buildFixture();
    expect(scrubber).dom.to.equal(`<vds-scrubber></vds-scrubber>`);
  });

  it('should render shadow DOM correctly', async () => {
    const { scrubber } = await buildFixture();
    expect(scrubber).shadowDom.to.equal(`
      <div
        id="root"
        part="root"
        style="--vds-scrubber-current-time:0; --vds-scrubber-seekable:0; --vds-scrubber-duration:0;"
      >
        <vds-slider
          exportparts="root: slider-root, thumb: slider-thumb, track: slider-track, track-fill: slider-track-fill"
          id="slider"
          label="Time scrubber"
          max="0"
          min="0"
          orientation="horizontal"
          part="slider"
          step="5"
          step-multiplier="2"
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
