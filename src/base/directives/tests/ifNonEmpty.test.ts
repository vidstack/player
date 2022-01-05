import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { ifNonEmpty } from '../ifNonEmpty';

class FakeElement extends LitElement {
  @state() value: string | undefined;

  override render() {
    return html`<div test-attr=${ifNonEmpty(this.value)}></div>`;
  }
}

window.customElements.define('fake-el', FakeElement);

async function buildFixture() {
  const el = await fixture<FakeElement>(html`<fake-el></fake-el>`);
  const root = el.shadowRoot!.querySelector('div');
  return { el, root };
}

test('attribute should not be rendered given undefined', async () => {
  const { el, root } = await buildFixture();
  el.value = undefined;
  await elementUpdated(el);
  expect(root?.hasAttribute('test-attr')).to.be.false;
});

test('attribute should not be rendered given empty string', async () => {
  const { el, root } = await buildFixture();
  el.value = '';
  await elementUpdated(el);
  expect(root?.hasAttribute('test-attr')).to.be.false;
});

test('attribute should be rendered given filled string', async () => {
  const { el, root } = await buildFixture();
  el.value = 'testing';
  await elementUpdated(el);
  expect(root?.getAttribute('test-attr')).to.equal('testing');
});
