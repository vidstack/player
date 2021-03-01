import { expect } from '@open-wc/testing';
import { spy, useFakeTimers } from 'sinon';

import { debounce } from '../timing';

describe('debounce', () => {
  it('should call function immediately first time', () => {
    const callback = spy();
    const fn = debounce(callback, 1500, true);
    fn(100);
    expect(callback).to.have.been.calledOnceWith(100);
  });

  it('should debounce function calls', () => {
    const clock = useFakeTimers();
    const callback = spy();
    const fn = debounce(callback, 1500);

    for (let i = 0; i <= 50; i += 1) {
      fn(i);
    }

    clock.tick(1501);
    expect(callback).to.have.been.calledOnceWith(50);
    clock.restore();
  });
});
