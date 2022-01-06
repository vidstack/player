import { LitElement } from 'lit';

import { createHostedRequestQueue } from '../hostedRequestQueue';

class FakeElement extends LitElement {
  q = createHostedRequestQueue(this);
}

window.customElements.define('fake-el', FakeElement);

test('it should start queue once connected', async () => {
  const el = document.createElement('fake-el') as FakeElement;

  const itemA = vi.fn();
  const itemB = vi.fn();

  el.q.queue('a', itemA);
  el.q.queue('b', itemB);

  expect(el.q.size).to.equal(2);

  setTimeout(() => {
    document.body.appendChild(el);
  });

  await el.q.waitForFlush();

  expect(el.q.size).to.equal(0);
  expect(itemA).to.toHaveBeenCalledOnce();
  expect(itemB).to.toHaveBeenCalledOnce();

  el.q.queue('a', itemA);
  expect(itemA).to.toHaveBeenCalledTimes(2);
});

test('it should stop queue once disconnected', async () => {
  const el = document.createElement('fake-el') as FakeElement;

  setTimeout(() => {
    document.body.appendChild(el);
  });

  await el.q.waitForFlush();

  el.remove();

  const itemA = vi.fn();
  const itemB = vi.fn();

  el.q.queue('a', itemA);
  el.q.queue('b', itemB);

  expect(el.q.size).to.equal(2);
  expect(itemA).to.not.toHaveBeenCalled();
  expect(itemB).to.not.toHaveBeenCalled();
});
