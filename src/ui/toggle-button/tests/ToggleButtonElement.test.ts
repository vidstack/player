import '../../../define/vds-toggle-button';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

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

test('light DOM snapshot', async function () {
  const { toggle } = await buildFixture();
  expect(toggle).dom.to.equal(`
    <vds-toggle-button>
      <div class="pressed"></div>
      <div class="not-pressed"></div>
    </vds-toggle-button>
  `);
});

test('shadow DOM snapshot', async function () {
  const { toggle } = await buildFixture();
  expect(toggle).shadowDom.to.equal(`
    <button
      id="button"
      part="button"
      aria-pressed="false"
    >
      <slot></slot>
    </button>
  `);
});

test('it should toggle pressed state on click', async function () {
  const { toggle } = await buildFixture();

  toggle.click();
  await elementUpdated(toggle);

  expect(toggle.hasAttribute('pressed')).to.be.true;

  toggle.click();
  await elementUpdated(toggle);

  expect(toggle.hasAttribute('pressed')).to.be.false;
});

test('it should prevent clicking when disabled', async function () {
  const { toggle } = await buildFixture();

  toggle.disabled = true;
  toggle.click();

  await elementUpdated(toggle);

  expect(toggle.hasAttribute('disabled')).to.be.true;
  expect(toggle.hasAttribute('pressed')).to.be.false;
});
