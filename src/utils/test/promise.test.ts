import { expect } from '@open-wc/testing';
import { deferredPromise } from '../promise';

describe('deferredPromise', () => {
  it('should resolve', done => {
    const deferred = deferredPromise();

    deferred.promise.then((res: unknown) => {
      expect(res).to.be.true;
      done();
    });

    deferred.resolve(true);
  });

  it('should reject', done => {
    const deferred = deferredPromise();

    deferred.promise.catch((res: unknown) => {
      expect(res).to.be.true;
      done();
    });

    deferred.reject(true);
  });
});
