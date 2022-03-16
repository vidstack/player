import { createContext, isContext } from '$lib';

it('should return true given context', () => {
  expect(isContext(createContext(() => 10))).to.be.true;
});

it('should returns false given non-context object', () => {
  expect(isContext({})).to.be.false;
});

it('should return false given primitive value', () => {
  expect(isContext('')).to.be.false;
});
