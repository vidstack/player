import { LitElement } from 'lit';

import { hostedStoreSubscription } from '../hostedStoreSubscription';
import { writable } from '../stores';

class FakeElement extends LitElement {
  store = writable(0);
  subscription = vi.fn();

  constructor() {
    super();
    hostedStoreSubscription(this, this.store, this.subscription);
  }
}

window.customElements.define('fake-el', FakeElement);

test('it should subscribe to store once connected', () => {
  const el = document.createElement('fake-el') as FakeElement;

  el.store.set(10);

  expect(el.subscription).to.not.toHaveBeenCalledWith(0);
  expect(el.subscription).to.not.toHaveBeenCalledWith(10);

  document.body.appendChild(el);

  el.store.set(20);

  expect(el.subscription).to.toHaveBeenCalledWith(10);
  expect(el.subscription).to.toHaveBeenCalledWith(20);

  el.remove();
  el.store.set(30);

  expect(el.subscription).to.not.toHaveBeenCalledWith(30);
});
