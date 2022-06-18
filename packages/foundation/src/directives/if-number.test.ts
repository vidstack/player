import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { ifNumber } from './if-number';

class FakeElement extends LitElement {
  @state() value: number | undefined | null;

  override render() {
    return html`<div test-attr=${ifNumber(this.value)}></div>`;
  }
}

window.customElements.define('fake-el', FakeElement);

async function buildFixture() {
  const el = await fixture<FakeElement>(html`<fake-el></fake-el>`);
  const root = el.shadowRoot!.querySelector('div');
  return { el, root };
}

it('should not set attribute given undefined', async () => {
  const { el, root } = await buildFixture();
  el.value = undefined;
  await elementUpdated(el);
  expect(root?.hasAttribute('test-attr')).to.be.false;
});

it('should not set attribute given null', async () => {
  const { el, root } = await buildFixture();
  el.value = null;
  await elementUpdated(el);
  expect(root?.hasAttribute('test-attr')).to.be.false;
});

it('should set attribute given number', async () => {
  const { el, root } = await buildFixture();
  el.value = 10;
  await elementUpdated(el);
  expect(root?.getAttribute('test-attr')).to.equal('10');
});
