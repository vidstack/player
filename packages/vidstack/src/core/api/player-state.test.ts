import { boundTime } from './player-state';

it('does not snap sub-second seek requests to the seekable start', () => {
  expect(boundTime(0.8, createStore())).to.equal(0.8);
});

it('still allows seeking to the exact start', () => {
  expect(boundTime(0, createStore())).to.equal(0);
});

it('does not snap clipped sub-second seek requests to the clip start', () => {
  expect(
    boundTime(0.8, createStore({ clipStartTime: 30, seekableStart: 30, seekableEnd: 40 })),
  ).to.equal(30.8);
});

function createStore(overrides: Partial<StoreValues> = {}) {
  const values = {
    bufferedStart: 0,
    clipStartTime: 0,
    isLiveDVR: false,
    liveDVRWindow: 0,
    seekableEnd: 10,
    seekableStart: 0,
    ...overrides,
  };

  return {
    bufferedStart: () => values.bufferedStart,
    clipStartTime: () => values.clipStartTime,
    isLiveDVR: () => values.isLiveDVR,
    liveDVRWindow: () => values.liveDVRWindow,
    seekableEnd: () => values.seekableEnd,
    seekableStart: () => values.seekableStart,
  } as any;
}

interface StoreValues {
  bufferedStart: number;
  clipStartTime: number;
  isLiveDVR: boolean;
  liveDVRWindow: number;
  seekableEnd: number;
  seekableStart: number;
}
