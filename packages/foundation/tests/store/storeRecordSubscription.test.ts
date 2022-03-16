import { LitElement } from 'lit';

import { storeRecordSubscription, writable } from '$lib';

class FakeElement extends LitElement {
  store = { a: writable(0), b: writable(0) };
  subscription = vi.fn();

  constructor() {
    super();
    storeRecordSubscription(this, this.store, 'a', this.subscription);
  }
}

window.customElements.define('fake-el', FakeElement);

it('should subscribe to selected store once connected', () => {
  const el = document.createElement('fake-el') as FakeElement;

  el.store.a.set(10);

  expect(el.subscription).to.not.toHaveBeenCalledWith(0);
  expect(el.subscription).to.not.toHaveBeenCalledWith(10);

  document.body.appendChild(el);

  el.store.a.set(20);

  expect(el.subscription).toHaveBeenCalledWith(10);
  expect(el.subscription).toHaveBeenCalledWith(20);

  el.store.b.set(30);

  expect(el.subscription).to.not.toHaveBeenCalledWith(30);

  el.remove();
  el.store.a.set(40);

  expect(el.subscription).to.not.toHaveBeenCalledWith(40);
});
