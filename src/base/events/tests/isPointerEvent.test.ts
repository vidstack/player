import { isPointerEvent } from '../isPointerEvent';

test('it should return true given pointer event', () => {
  expect(isPointerEvent(new MouseEvent('pointer-'))).to.be.true;
});

test('it should return false when not given pointer event', () => {
  expect(isPointerEvent(new MouseEvent('click'))).to.be.false;
});
