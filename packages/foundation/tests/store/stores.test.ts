/**
 * Don't have to do any serious testing here as these stores are ported directly over from
 * Svelte, where it's been heavily tested.
 */

import { derived, readable, writable } from '$lib';

describe('readable store', () => {
  it('should update subscribers', () => {
    let internalSet;

    const store = readable(0, (set) => {
      internalSet = set;
    });

    const subscription = vi.fn();
    const unsub = store.subscribe(subscription);

    internalSet(10);
    internalSet(20);
    unsub();
    internalSet(30);

    expect(subscription).toHaveBeenCalledWith(0);
    expect(subscription).toHaveBeenCalledWith(10);
    expect(subscription).toHaveBeenCalledWith(20);
    expect(subscription).to.not.toHaveBeenCalledWith(30);
  });
});

describe('writable store', () => {
  it('should update subscribers', () => {
    const store = writable('0');
    const subscription = vi.fn();
    const unsub = store.subscribe(subscription);

    store.set('1');
    store.set('2');
    unsub();
    store.set('3');

    expect(subscription).toHaveBeenCalledWith('0');
    expect(subscription).toHaveBeenCalledWith('1');
    expect(subscription).toHaveBeenCalledWith('2');
    expect(subscription).to.not.toHaveBeenCalledWith('3');
  });
});

describe('derived store', () => {
  it('should update subscribers', () => {
    const storeA = writable(0);
    const storeB = writable(0);

    const store = derived([storeA, storeB], ([$storeA, $storeB]) => $storeA * $storeB);

    const subscription = vi.fn();
    const unsub = store.subscribe(subscription);

    storeA.set(2);
    storeB.set(2);

    storeA.set(3);
    storeB.set(3);

    storeA.set(4);
    storeB.set(8);

    unsub();

    storeA.set(8);
    storeB.set(8);

    expect(subscription).toHaveBeenCalledWith(0);
    expect(subscription).toHaveBeenCalledWith(4);
    expect(subscription).toHaveBeenCalledWith(9);
    expect(subscription).toHaveBeenCalledWith(32);
    expect(subscription).to.not.toHaveBeenCalledWith(64);
  });
});
