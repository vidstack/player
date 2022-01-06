import '../../../define/vds-scrubber-preview';
import '../../../define/vds-scrubber-preview-time';

import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { ScrubberPreviewElement } from '../../scrubber-preview';
import { ScrubberPreviewTimeElement } from '../ScrubberPreviewTimeElement';

async function buildFixture() {
  const scrubberPreview = await fixture<ScrubberPreviewElement>(html`
    <vds-scrubber-preview>
      <vds-scrubber-preview-time></vds-scrubber-preview-time>
    </vds-scrubber-preview>
  `);

  const scrubberPreviewTime = scrubberPreview.querySelector(
    'vds-scrubber-preview-time'
  ) as ScrubberPreviewTimeElement;

  return { scrubberPreview, scrubberPreviewTime };
}

test('light DOM snapshot', async function () {
  const { scrubberPreviewTime } = await buildFixture();
  expect(scrubberPreviewTime).dom.to.equal(`
    <vds-scrubber-preview-time
      hidden=""
      style="position: absolute; left: 0px; will-change: transform;"
    ></vds-scrubber-preview-time>
  `);
});

test('shadow DOM snapshot', async function () {
  const { scrubberPreview, scrubberPreviewTime } = await buildFixture();

  scrubberPreview.previewStore.time.set(3750);
  await elementUpdated(scrubberPreviewTime);

  expect(scrubberPreviewTime).shadowDom.to.equal(`
    <time
      id="root"
      aria-label="Media scrubber preview time"
      datetime="PT1H2M30S"
      part="root time"
    >
      1:02:30
    </time>
  `);
});

test('it should update preview time', async function () {
  const { scrubberPreview, scrubberPreviewTime } = await buildFixture();

  expect(scrubberPreviewTime.seconds).to.equal(0);

  scrubberPreview.previewStore.time.set(50);
  await elementUpdated(scrubberPreviewTime);

  expect(scrubberPreviewTime.seconds).to.equal(50);

  scrubberPreview.previewStore.time.set(100);
  await elementUpdated(scrubberPreviewTime);

  expect(scrubberPreviewTime.seconds).to.equal(100);
});
