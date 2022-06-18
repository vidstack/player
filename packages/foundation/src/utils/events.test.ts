import { fixture, html, oneEvent } from '@open-wc/testing-helpers';

import { DisposalBin, isPointerEvent, listen } from './events';

it('should return true given pointer event', () => {
  expect(isPointerEvent(new MouseEvent('pointer-'))).to.be.true;
});

it('should return false when not given pointer event', () => {
  expect(isPointerEvent(new MouseEvent('click'))).to.be.false;
});

it('should listen to event on target', async function () {
  const target = await fixture<HTMLDivElement>(html`<div></div>`);
  const handlerSpy = vi.fn();
  listen(target, 'click', handlerSpy);
  setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
  await oneEvent(target, 'click');
  expect(handlerSpy).to.have.toHaveBeenCalledOnce();
});

it('should stop listening when unsubscribed', async function () {
  const target = await fixture<HTMLDivElement>(html`<div></div>`);
  const handlerSpy = vi.fn();
  const off = listen(target, 'click', handlerSpy);
  off();
  setTimeout(() => target.dispatchEvent(new MouseEvent('click')));
  await oneEvent(target, 'click');
  expect(handlerSpy).to.not.toHaveBeenCalled();
});

it('empty disposal bin', function () {
  const disposal = new DisposalBin();

  let calls = 0;

  const cleanup = () => {
    calls += 1;
  };

  disposal.add(cleanup);
  disposal.add(cleanup);

  disposal.empty();

  expect(calls).to.equal(2);
});
