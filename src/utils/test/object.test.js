import { expect } from '@open-wc/testing';
import { mock, spy } from 'sinon';

import { getAllObjectPropertyNames, proxyProperties } from '../object.js';

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

  describe(proxyProperties.name, function () {
    it('should forward whitelisted operations', function () {
      const objA = {
        knownOp: spy()
      };

      const objB = {
        unknownOp: spy()
      };

      const destroy = proxyProperties(objA, objB, new Set(['unknownOp']));

      /** @type {any} */ (objA).unknownOp();

      expect(objA.knownOp).to.not.have.been.called;
      expect(objB.unknownOp).to.have.been.calledOnce;

      objA.knownOp();

      expect(objA.knownOp).to.have.been.calledOnce;
      expect(objB.unknownOp).to.have.been.calledOnce;

      destroy();
    });

    it('should NOT forward operations that have not been whitelisted', function () {
      const objA = {
        knownOp: spy()
      };

      const objB = {
        unknownOp: spy()
      };

      const destroy = proxyProperties(objA, objB, new Set([]));

      expect(() => {
        /** @type {any} */ (objA).unknownOp();
      }).to.throw(/is not a function/);

      destroy();
    });

    it('should log warning if property exists on target', function () {
      class ObjA {
        prop = spy();
      }

      class ObjB {
        prop = spy();
      }

      const originalWarn = console.warn;
      console.warn = mock();

      const destroy = proxyProperties(
        new ObjA(),
        new ObjB(),
        // @ts-ignore
        new Set(['prop'])
      );

      expect(console.warn).to.have.been.calledOnceWith(
        '[vds]: ObjA declared a property [`prop`] that is being proxied to ObjB.'
      );

      console.warn = originalWarn;
    });

    it('should destroy proxy', function () {
      const objA = {
        knownOp: spy()
      };

      const objB = {
        unknownOp: spy()
      };

      const destroy = proxyProperties(objA, objB, new Set(['unknownOp']));
      destroy();

      objA.knownOp();
      expect(objA.knownOp).to.have.been.calledOnce;
      expect(/** @type {any} */ (objA).unknownOp).to.be.undefined;

      expect(() => {
        /** @type {any} */ (objA).unknownOp();
      }).to.throw;
    });
  });
});
