import { timedPromise } from './promise';

describe(timedPromise.name, function () {
  beforeEach(function () {
    vi.useFakeTimers();
  });

  afterEach(function () {
    vi.useRealTimers();
  });

  it('resolves when the timeout callback returns void', async function () {
    const callback = vi.fn();
    const promise = timedPromise(callback, 1000);
    const resolution = expect(promise.promise).resolves.toBeUndefined();

    vi.advanceTimersByTime(1000);

    await resolution;
    expect(callback).toHaveBeenCalledOnce();
  });

  it('rejects when the timeout callback returns a rejection value', async function () {
    const rejection = '';
    const promise = timedPromise<void, string>(() => rejection, 1000);
    const resolution = expect(promise.promise).rejects.toBe(rejection);

    vi.advanceTimersByTime(1000);

    await resolution;
  });
});
