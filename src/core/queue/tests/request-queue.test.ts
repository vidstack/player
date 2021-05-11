import { expect } from '@open-wc/testing';
import { mock } from 'sinon';

import { noop } from '../../../utils/unit';
import { RequestQueue } from '../RequestQueue';

describe('RequestQueue', () => {
  describe('size', () => {
    it('should return correct size', async () => {
      const queue = new RequestQueue();
      expect(queue.size).to.equal(0);

      queue.queue('a', noop);
      expect(queue.size).to.equal(1);

      queue.queue('b', noop);
      expect(queue.size).to.equal(2);

      await queue.serve('a');
      await queue.serve('b');

      expect(queue.size).to.equal(0);
    });
  });

  describe('clone', () => {
    it('should return clone', () => {
      const queue = new RequestQueue();
      const cloneA = queue.cloneQueue();
      const cloneB = queue.cloneQueue();

      cloneA.set('a', noop);

      expect(cloneA.size).to.equal(1);
      expect(cloneB.size).to.equal(0);
    });
  });

  describe('waitForFlush', () => {
    it('should resolve promise given queue is flushed', async () => {
      const queue = new RequestQueue();

      const callback = mock();
      queue.queue('a', callback);

      setTimeout(() => {
        queue.flush();
      });

      await queue.waitForFlush();

      expect(callback).to.have.been.calledOnce;
    });
  });

  describe('queue', () => {
    it('should queue element given serveImmediately is set to false', () => {
      const queue = new RequestQueue();
      queue.serveImmediately = false;

      const callback = mock();
      queue.queue('a', callback);

      expect(callback).to.not.have.been.called;
    });

    it('should NOT queue element given serveImmediately is set to true', () => {
      const queue = new RequestQueue();
      queue.serveImmediately = true;

      const callback = mock();
      queue.queue('a', callback);

      expect(callback).to.have.been.called;
    });
  });

  describe('serve', () => {
    it('should serve request with matching key', async () => {
      const queue = new RequestQueue();

      const callbackA = mock();
      queue.queue('a', callbackA);

      const callbackB = mock();
      queue.queue('b', callbackB);

      await queue.serve('a');

      expect(queue.size).to.equal(1);
      expect(callbackA).to.have.been.calledOnce;
      expect(callbackB).to.not.have.been.called;
    });
  });

  describe('flush', () => {
    it('should flush all requests', async () => {
      const queue = new RequestQueue();

      const callbackA = mock();
      queue.queue('a', callbackA);

      const callbackB = mock();
      queue.queue('b', callbackB);

      await queue.flush();

      expect(queue.size).to.equal(0);
      expect(callbackA).to.have.been.calledOnce;
      expect(callbackB).to.have.been.calledOnce;
    });
  });

  describe('reset', () => {
    it('should clear request queue', async () => {
      const queue = new RequestQueue();

      const callbackA = mock();
      queue.queue('a', callbackA);

      const callbackB = mock();
      queue.queue('b', callbackB);

      queue.reset();

      await queue.flush();

      expect(queue.size).to.equal(0);
      expect(callbackA).to.not.have.been.called;
      expect(callbackB).to.not.have.been.called;
    });
  });
});
