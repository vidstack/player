import { waitForEvent } from '../utils/events';
import { redispatchEvent } from './redispatch';
import { VdsEvent } from './VdsEvent';

it('should redispatch event', async () => {
  const el = document.createElement('div');

  setTimeout(() => {
    redispatchEvent(el, new MouseEvent('click'));
  });

  const event = await waitForEvent(el, 'click');
  expect(event).toBeInstanceOf(VdsEvent);
  expect(event.type).to.equal('click');
});

it('should not redispatch if given event bubbles and composed', async () => {
  const el = document.createElement('div');

  setTimeout(() => {
    redispatchEvent(el, new MouseEvent('click', { bubbles: true, composed: true }));

    // Should catch this event.
    el.dispatchEvent(new MouseEvent('click'));
  });

  const event = await waitForEvent(el, 'click');
  expect(event).to.not.toBeInstanceOf(VdsEvent);
});
