import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import { hostedEventListener } from '../hostedEventListener';

class FakeElement extends LitElement {
  listener = vi.fn();

  handleClick = hostedEventListener(this, 'click', this.listener);

  override render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define('fake-el', FakeElement);

test('it should attach event listener', async () => {
  const el = await fixture<FakeElement>(html`<fake-el></fake-el>`);
  const child = document.createElement('div');

  el.appendChild(child);

  await nextFrame();

  child.dispatchEvent(
    new MouseEvent('click', { composed: true, bubbles: true })
  );

  child.dispatchEvent(
    new MouseEvent('click', { composed: true, bubbles: true })
  );

  expect(el.listener).to.toHaveBeenCalledTimes(2);
});
