import { expect, test } from 'vitest';

import { createContext } from '../createContext';
import { isContext } from '../isContext';

test('isContext returns true given context', () => {
  expect(isContext(createContext(() => 10))).to.be.true;
});

test('isContext returns false given non-context object', () => {
  expect(isContext({})).to.be.false;
});

test('isContext returns false given primitive value', () => {
  expect(isContext('')).to.be.false;
});
