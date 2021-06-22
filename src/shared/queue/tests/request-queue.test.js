import { expect } from '@open-wc/testing';
import { mock } from 'sinon';

import { noop } from '../../../utils/unit.js';
import { RequestQueue } from '../RequestQueue.js';

describe('RequestQueue', function () {
	describe('size', function () {
		it('should return correct size', async function () {
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

	describe('clone', function () {
		it('should return clone', function () {
			const queue = new RequestQueue();
			const cloneA = queue.cloneQueue();
			const cloneB = queue.cloneQueue();

			cloneA.set('a', noop);

			expect(cloneA.size).to.equal(1);
			expect(cloneB.size).to.equal(0);
		});
	});

	describe('waitForFlush', function () {
		it('should resolve promise given queue is flushed', async function () {
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

	describe('queue', function () {
		it('should queue element given serveImmediately is set to false', function () {
			const queue = new RequestQueue();
			queue.serveImmediately = false;

			const callback = mock();
			queue.queue('a', callback);

			expect(callback).to.not.have.been.called;
		});

		it('should NOT queue element given serveImmediately is set to true', function () {
			const queue = new RequestQueue();
			queue.serveImmediately = true;

			const callback = mock();
			queue.queue('a', callback);

			expect(callback).to.have.been.called;
		});
	});

	describe('serve', function () {
		it('should serve request with matching key', async function () {
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

	describe('flush', function () {
		it('should flush all requests', async function () {
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

	describe('reset', function () {
		it('should clear request queue', async function () {
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
