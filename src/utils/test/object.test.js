import { expect } from '@open-wc/testing';

import { getAllObjectPropertyNames } from '../object.js';

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
});
