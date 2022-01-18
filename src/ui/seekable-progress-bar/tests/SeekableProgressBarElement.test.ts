import '../../../define/vds-seekable-progress-bar';

import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-seekable-progress-bar></vds-seekable-progress-bar>
  `);

  const seekableProgressBar = player.querySelector(
    'vds-seekable-progress-bar'
  )!;

  return { seekableProgressBar };
}

test('light DOM snapshot', async function () {
  const { seekableProgressBar } = await buildFixture();
  expect(seekableProgressBar).dom.to.equal(`
    <vds-seekable-progress-bar
      aria-label="Seekable media"
      aria-valuemax="0"
      aria-valuemin="0"
      aria-valuenow="0"
      aria-valuetext="0 seconds out of 0 seconds"
      role="progressbar"
    ></vds-seekable-progress-bar>
  `);
});

test('shadow DOM snapshot', async function () {
  const { seekableProgressBar } = await buildFixture();
  expect(seekableProgressBar).shadowDom.to.equal(`
    <div
      id="progressbar"
      part="root"
      style="--vds-media-seekable:0;--vds-media-duration:0;"
    >
      <slot></slot>
    </div>
  `);
});
