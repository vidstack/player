import '../../../define/vds-scrubber-preview';

import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-scrubber-preview></vds-scrubber-preview>
  `);

  const scrubberPreview = player.querySelector('vds-scrubber-preview')!;

  return { player, scrubberPreview };
}

test('light DOM snapshot', async function () {
  const { scrubberPreview } = await buildFixture();
  expect(scrubberPreview).dom.to.equal(
    `<vds-scrubber-preview style="--vds-media-duration: 0;"></vds-scrubber-preview>`
  );
});

test('shadow DOM snapshot', async function () {
  const { scrubberPreview } = await buildFixture();
  expect(scrubberPreview).shadowDom.to.equal(`
    <div
      id="track"
      part="track"
    >
      <slot></slot>

      <div
        hidden=""
        id="track-fill"
        part="track-fill"
      >
        <slot name="track-fill"></slot>
      </div>

      <slot name="track"></slot>
    </div>
  `);
});
