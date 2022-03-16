import '$lib/define/vds-toggle-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '$test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-toggle-button>
      <div class="pressed"></div>
      <div class="not-pressed"></div>
    </vds-toggle-button>
  `);

  const toggle = player.querySelector('vds-toggle-button')!;

  return { toggle };
}

it('should render light DOM', async function () {
  const { toggle } = await buildFixture();
  expect(toggle).dom.to.equal(`
    <vds-toggle-button
      aria-pressed="false"
      role="button"
      tabindex="0"
    >
      <div class="pressed"></div>
      <div class="not-pressed"></div>
    </vds-toggle-button>
  `);
});

it('should render shadow DOM', async function () {
  const { toggle } = await buildFixture();
  expect(toggle).shadowDom.to.equal(`<slot></slot>`);
});

it('should toggle pressed state on click', async function () {
  const { toggle } = await buildFixture();

  setTimeout(() => {
    toggle.dispatchEvent(new MouseEvent('pointerdown'));
  });

  await waitForEvent(toggle, 'pointerdown');
  await elementUpdated(toggle);

  expect(toggle.getAttribute('aria-pressed')).to.equal('true');

  setTimeout(() => {
    toggle.dispatchEvent(new MouseEvent('pointerdown'));
  });

  await waitForEvent(toggle, 'pointerdown');
  await elementUpdated(toggle);

  expect(toggle.getAttribute('aria-pressed')).to.equal('false');
});

it('should prevent clicking when disabled', async function () {
  const { toggle } = await buildFixture();

  toggle.disabled = true;
  toggle.click();

  await elementUpdated(toggle);

  expect(toggle.hasAttribute('disabled')).to.be.true;
  expect(toggle.getAttribute('aria-pressed')).to.equal('false');
});
