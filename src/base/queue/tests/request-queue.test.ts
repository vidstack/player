import { expect } from '@open-wc/testing';
import { mock } from 'sinon';

import { noop } from '../../../utils/unit';
import { RequestQueue } from '../RequestQueue';

describe('RequestQueue', function () {
  describe('size', function () {
    it('should return correct size', async function () {
      const q = new RequestQueue();
      expect(q.size).to.equal(0);

      q.queue('a', noop);
      expect(q.size).to.equal(1);

      q.queue('b', noop);
      expect(q.size).to.equal(2);

      await q.serve('a');
      await q.serve('b');

      expect(q.size).to.equal(0);
    });
  });

  describe('waitForFlush', function () {
    it('should resolve promise given queue is flushed', async function () {
      const q = new RequestQueue();

      const callback = mock();
      q.queue('a', callback);

      setTimeout(() => {
        q.start();
      });

      await q.waitForFlush();

      expect(callback).to.have.been.calledOnce;
    });
  });

  describe('queue', function () {
    it('should queue element given it has NOT started', function () {
      const q = new RequestQueue();

      const callback = mock();
      q.queue('a', callback);

      expect(callback).to.not.have.been.called;
    });

    it('should NOT queue element given it has started', function () {
      const q = new RequestQueue();
      q.start();

      const callback = mock();
      q.queue('a', callback);

      expect(callback).to.have.been.called;
    });
  });

  describe('serve', function () {
    it('should serve request with matching key', async function () {
      const q = new RequestQueue();

      const callbackA = mock();
      q.queue('a', callbackA);

      const callbackB = mock();
      q.queue('b', callbackB);

      await q.serve('a');

      expect(q.size).to.equal(1);
      expect(callbackA).to.have.been.calledOnce;
      expect(callbackB).to.not.have.been.called;
    });
  });

  describe('flush', function () {
    it('should flush all requests', async function () {
      const q = new RequestQueue();

      const callbackA = mock();
      q.queue('a', callbackA);

      const callbackB = mock();
      q.queue('b', callbackB);

      await q.start();

      expect(q.size).to.equal(0);
      expect(callbackA).to.have.been.calledOnce;
      expect(callbackB).to.have.been.calledOnce;
    });
  });

  describe('stop', function () {
    it('should stop serving requests', async function () {
      const q = new RequestQueue();

      await q.start();

      q.stop();

      const callbackA = mock();
      q.queue('a', callbackA);

      const callbackB = mock();
      q.queue('b', callbackB);

      expect(q.size).to.equal(2);
      expect(callbackA).to.not.have.been.called;
      expect(callbackB).to.not.have.been.called;
    });
  });
});
