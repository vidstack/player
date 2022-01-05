import { fixture, oneEvent } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { listen } from '../listen';

test('it should listen to event on target', async function () {
  const target = await fixture<HTMLDivElement>(html`<div></div>`);
  const handlerSpy = vi.fn();
  listen(target, 'click', handlerSpy);
  setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
  await oneEvent(target, 'click');
  expect(handlerSpy).to.have.toHaveBeenCalledOnce();
});

test('it should stop listening when unsubscribed', async function () {
  const target = await fixture<HTMLDivElement>(html`<div></div>`);
  const handlerSpy = vi.fn();
  const off = listen(target, 'click', handlerSpy);
  off();
  setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
  await oneEvent(target, 'click');
  expect(handlerSpy).to.not.toHaveBeenCalled();
});
