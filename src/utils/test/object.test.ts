import { expect } from '@open-wc/testing';

import { omit, pick } from '../object';

describe('utils/object', function () {
  describe(pick.name, function () {
    it('should return picked keys', function () {
      const obj = {
        a: 1,
        b: 2,
        c: 'c',
        d: false
      };

      const result = pick(obj, ['a', 'c']);

      expect(result).to.eql({
        a: 1,
        c: 'c'
      });
    });
  });

  describe(omit.name, function () {
    it('should return non-omitted keys', function () {
      const obj = {
        a: 1,
        b: 2,
        c: 'c',
        d: false
      };

      const result = omit(obj, ['a', 'c']);

      expect(result).to.eql({
        b: 2,
        d: false
      });
    });
  });
});
