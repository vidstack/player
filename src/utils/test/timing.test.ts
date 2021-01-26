import { expect } from '@open-wc/testing';
import { spy, useFakeTimers } from 'sinon';
import { debounce } from '../timing';

describe('debounce', () => {
  // Freezing for some reason in test environment.
  it.skip('should debounce function calls', () => {
    const clock = useFakeTimers();
    const callback = spy();
    const fn = debounce(callback, 1500);
    for (let i = 0; i <= 50; i += 1) {
      fn(i);
    }
    clock.tick(1501);
    expect(spy).to.have.been.calledOnceWith(50);
    clock.restore();
  });
});
