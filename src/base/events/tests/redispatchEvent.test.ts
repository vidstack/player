import { oneEvent } from '@open-wc/testing-helpers';

import { redispatchEvent } from '../redispatchEvent';
import { VdsEvent } from '../VdsEvent';

test('should redispatch event', async () => {
  const el = document.createElement('div');

  setTimeout(() => {
    redispatchEvent(el, new MouseEvent('click'));
  });

  const event = await oneEvent(el, 'click');
  expect(event).to.toBeInstanceOf(VdsEvent);
  expect(event.type).to.equal('click');
});

test('should not redispatch event if it bubbles and is composed', async () => {
  const el = document.createElement('div');

  setTimeout(() => {
    redispatchEvent(
      el,
      new MouseEvent('click', { bubbles: true, composed: true })
    );

    // Should catch this event.
    el.dispatchEvent(new MouseEvent('click'));
  });

  const event = await oneEvent(el, 'click');
  expect(event).to.not.toBeInstanceOf(VdsEvent);
});
