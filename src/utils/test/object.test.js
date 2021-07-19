import { expect } from '@open-wc/testing';

import { getAllObjectPropertyNames, omit, pick } from '../object.js';

describe('utils/object', function () {
  describe(getAllObjectPropertyNames.name, function () {
    it('should return all object property names', function () {
      class A {
        a = 1;

        get getterA() {
          return 0;
        }

        methodA() {}
      }

      class B extends A {
        b = 1;

        get getterB() {
          return 0;
        }

        methodB() {}
      }

      const propertyNames = getAllObjectPropertyNames(new B());
      expect(Array.from(propertyNames)).to.eql([
        'a',
        'b',
        'constructor',
        'getterB',
        'methodB',
        'getterA',
        'methodA'
      ]);
    });
  });

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
