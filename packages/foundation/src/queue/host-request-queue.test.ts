import { LitElement } from 'lit';

import { hostRequestQueue } from './host-request-queue';

class FakeElement extends LitElement {
  q = hostRequestQueue(this);
}

window.customElements.define('fake-el', FakeElement);

it('should start queue on connect', async () => {
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
  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).toHaveBeenCalledOnce();

  el.q.queue('a', itemA);
  expect(itemA).toHaveBeenCalledTimes(2);
});

it('should stop queue on disconnect', async () => {
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
