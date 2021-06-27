import { expect } from '@open-wc/testing';

import { deferredPromise } from '../promise.js';

describe('utils/promise', function () {
  describe(deferredPromise.name, function () {
    it('should resolve', function (done) {
      const deferred = deferredPromise();

      deferred.promise.then((res) => {
        expect(res).to.be.true;
        done();
      });

      deferred.resolve(true);
    });

    it('should reject', function (done) {
      const deferred = deferredPromise();

      deferred.promise.catch((res) => {
        expect(res).to.be.true;
        done();
      });

      deferred.reject(true);
    });
  });
});
