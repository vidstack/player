import { LitElement } from 'lit';

import { copyStoreRecords, get, storeRecordSubscription, writable } from '$lib';

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

describe(copyStoreRecords.name, () => {
  it('should copy store record values from b to a', () => {
    const recordA = {
      a: writable(0),
      b: writable('a'),
      c: writable('c'), // test if non-matching prop throws
    };

    const recordB = {
      a: writable(5),
      b: writable('b'),
      d: writable('d'), // test if non-matching prop throws
    };

    // Copy record B into A.
    copyStoreRecords(recordB, recordA);

    expect(get(recordA.a)).to.equal(5);
    expect(get(recordA.b)).to.equal('b');
    expect(get(recordA.c)).to.equal('c');

    expect(get(recordB.a)).to.equal(5);
    expect(get(recordB.b)).to.equal('b');
    expect(get(recordB.d)).to.equal('d');

    expect(Object.keys(recordA).length).to.equal(3);
    expect(Object.keys(recordB).length).to.equal(3);
  });
});
