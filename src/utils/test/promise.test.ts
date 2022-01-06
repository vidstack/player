import { waitUntil } from '@open-wc/testing-helpers';

import { deferredPromise, timedPromise } from '../promise';

describe(deferredPromise.name, function () {
  test('it should resolve', function (done) {
    const deferred = deferredPromise();

    deferred.promise.then((res) => {
      expect(res).to.be.true;
      done();
    });

    deferred.resolve(true);
  });

  test('it should reject', function (done) {
    const deferred = deferredPromise();

    deferred.promise.catch((res) => {
      expect(res).to.be.true;
      done();
    });

    deferred.reject(true);
  });
});

describe(timedPromise.name, function () {
  test('it should resolve', async function () {
    const result = await timedPromise(Promise.resolve(1), 0, '');
    expect(result).to.equal(1);
  });

  test('it should timeout', function () {
    // @ts-ignore
    const badPredicate = () => 1 === 2;

    return timedPromise(waitUntil(badPredicate), 0, 'Timed out.')
      .then(() => {
        throw Error('It should not resolve.');
      })
      .catch((err) => {
        expect(err).to.equal('Timed out.');
      });
  });
});
