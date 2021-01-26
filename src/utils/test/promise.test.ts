import { expect } from '@open-wc/testing';
import { cancellablePromise, deferredPromise } from '../promise';

describe('deferredPromise', () => {
  it('should resolve', done => {
    const deferred = deferredPromise();

    deferred.promise.then((res: any) => {
      expect(res).to.be.true;
      done();
    });

    deferred.resolve(true);
  });

  it('should reject', done => {
    const deferred = deferredPromise();

    deferred.promise.catch((res: any) => {
      expect(res).to.be.true;
      done();
    });

    deferred.reject(true);
  });
});

describe('makeCancellablePromise', () => {
  it('should cancel promise', done => {
    const promise = new Promise<boolean>(() => {
      // no-op
    });

    const cancellable = cancellablePromise(promise);

    cancellable.catch(err => {
      expect(err.message === 'Cancelled.');
      done();
    });

    cancellable.cancel();
  });
});
