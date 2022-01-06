import '../../../define/vds-scrubber';

import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-scrubber></vds-scrubber>
  `);

  const scrubber = player.querySelector('vds-scrubber')!;

  return { scrubber };
}

test('light DOM snapshot', async function () {
  const { scrubber } = await buildFixture();
  expect(scrubber).dom.to.equal(`
    <vds-scrubber
      label="Media time slider"
      orientation="horizontal"
      progress-label="Amount of seekable media"
    ></vds-scrubber>
  `);
});

test('shadow DOM snapshot', async function () {
  const { scrubber } = await buildFixture();
  expect(scrubber).shadowDom.to.equal(`
    <vds-time-slider
      exportparts="root: time-slider-root, thumb: time-slider-thumb, track: time-slider-track, track-fill: time-slider-track-fill"
      id="time-slider"
      keyboard-step="20"
      label="Media time slider"
      orientation="horizontal"
      part="time-slider"
      shift-key-multiplier="2"
      step="0.25"
      value-text="{currentTime} out of {duration}"
    >
      <slot></slot>
      <vds-seekable-progress-bar
        id="progress-bar"
        exportparts="root: progress-bar-root"
        label="Amount of seekable media"
        part="progress-bar"
        value-text="{seekableAmount} out of {duration}"
      >
        <slot name="progress-bar"></slot>
      </vds-seekable-progress-bar>
    </vds-time-slider>
  `);
});
