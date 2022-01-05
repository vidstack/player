import { expect } from '@open-wc/testing';

import { areNumbersRoughlyEqual } from '../number';

describe('utils/number', function () {
  describe(areNumbersRoughlyEqual.name, function () {
    it('should be roughly equal', function () {
      expect(areNumbersRoughlyEqual(1, 1, 1)).to.be.true;
      expect(areNumbersRoughlyEqual(1.2, 1.2, 1)).to.be.true;
      expect(areNumbersRoughlyEqual(1.456, 1.457, 1)).to.be.true;
      expect(areNumbersRoughlyEqual(1.456, 1.457, 2)).to.be.true;
      expect(areNumbersRoughlyEqual(1.457, 1.457, 3)).to.be.true;
    });

    it('should not be roughly equal', function () {
      expect(areNumbersRoughlyEqual(1, 2, 1)).to.be.false;
      expect(areNumbersRoughlyEqual(1.1, 2.1, 1)).to.be.false;
      expect(areNumbersRoughlyEqual(1.456, 1.457, 3)).to.be.false;
      expect(areNumbersRoughlyEqual(1.457, 1.458, 3)).to.be.false;
    });
  });
});
