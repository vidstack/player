/* eslint-disable max-classes-per-file */
import { expect } from '@open-wc/testing';
import {
  getConstructor,
  isArray,
  isBoolean,
  isFunction,
  isInstanceOf,
  isNull,
  isNumber,
  isObject,
  isPrototypeOf,
  isString,
  isUndefined,
} from '../unit';

describe('isArray', () => {
  it('should return true only if given an array', () => {
    expect(isArray([])).to.be.true;
    expect(isArray('')).to.be.false;
    expect(isArray(null)).to.be.false;
    expect(isArray(undefined)).to.be.false;
    expect(isArray({})).to.be.false;
    expect(isArray(0)).to.be.false;
    expect(isArray(() => {})).to.be.false;
    expect(isArray(false)).to.be.false;
  });
});

describe('isBoolean', () => {
  it('should return true only if given a boolean', () => {
    expect(isBoolean(true)).to.be.true;
    expect(isBoolean(false)).to.be.true;
    expect(isBoolean([])).to.be.false;
    expect(isBoolean('')).to.be.false;
    expect(isBoolean(null)).to.be.false;
    expect(isBoolean(undefined)).to.be.false;
    expect(isBoolean({})).to.be.false;
    expect(isBoolean(0)).to.be.false;
    expect(isBoolean(() => {})).to.be.false;
  });
});

describe('isObject', () => {
  it('should return true only if given an object', () => {
    expect(isObject({})).to.be.true;
    expect(isObject('')).to.be.false;
    expect(isObject([])).to.be.false;
    expect(isObject(null)).to.be.false;
    expect(isObject(undefined)).to.be.false;
    expect(isObject(0)).to.be.false;
    expect(isObject(() => {})).to.be.false;
    expect(isObject(false)).to.be.false;
  });
});

describe('isString', () => {
  it('should return true only if given a string', () => {
    expect(isString('')).to.be.true;
    expect(isString({})).to.be.false;
    expect(isString([])).to.be.false;
    expect(isString(null)).to.be.false;
    expect(isString(undefined)).to.be.false;
    expect(isString(0)).to.be.false;
    expect(isString(() => {})).to.be.false;
    expect(isString(false)).to.be.false;
  });
});

describe('isNumber', () => {
  it('should return true only if given a number', () => {
    expect(isNumber(0)).to.be.true;
    expect(isNumber('')).to.be.false;
    expect(isNumber({})).to.be.false;
    expect(isNumber([])).to.be.false;
    expect(isNumber(null)).to.be.false;
    expect(isNumber(undefined)).to.be.false;
    expect(isNumber(() => {})).to.be.false;
    expect(isNumber(false)).to.be.false;
  });
});

describe('isFunction', () => {
  it('should return true only if given a function', () => {
    expect(isFunction(() => {})).to.be.true;
    expect(isFunction(0)).to.be.false;
    expect(isFunction('')).to.be.false;
    expect(isFunction({})).to.be.false;
    expect(isFunction([])).to.be.false;
    expect(isFunction(null)).to.be.false;
    expect(isFunction(undefined)).to.be.false;
    expect(isFunction(false)).to.be.false;
  });
});

describe('isNull', () => {
  it('should return true only if given null', () => {
    expect(isNull(null)).to.be.true;
    expect(isNull(() => {})).to.be.false;
    expect(isNull(0)).to.be.false;
    expect(isNull('')).to.be.false;
    expect(isNull({})).to.be.false;
    expect(isNull([])).to.be.false;
    expect(isNull(undefined)).to.be.false;
    expect(isNull(false)).to.be.false;
  });
});

describe('isUndefined', () => {
  it('should return true only if given undefined', () => {
    expect(isUndefined(undefined)).to.be.true;
    expect(isUndefined(null)).to.be.false;
    expect(isUndefined(() => {})).to.be.false;
    expect(isUndefined(0)).to.be.false;
    expect(isUndefined('')).to.be.false;
    expect(isUndefined({})).to.be.false;
    expect(isUndefined([])).to.be.false;
    expect(isUndefined(false)).to.be.false;
  });
});

class Mock {}

describe('getConstructor', () => {
  it('should return false given null or undefined', () => {
    expect(getConstructor(null)).to.be.undefined;
    expect(getConstructor(undefined)).to.be.undefined;
  });

  it('should return constructor given valid input', () => {
    const str = 'str';
    expect(getConstructor(str)).to.equal(str.constructor);
  });
});

describe('isInstanceOf`', () => {
  it('should return true given input is a instance of class', () => {
    expect(isInstanceOf(new Mock(), Mock)).to.be.true;
  });

  it('should return false given null input or null constructor', () => {
    expect(isInstanceOf(null, Mock)).to.be.false;
    expect(isInstanceOf('', null)).to.be.false;
  });

  it('should return false given input is not a instance of class', () => {
    class MockTwo extends Mock {}
    expect(isInstanceOf(new Mock(), MockTwo)).to.be.false;
  });
});

describe('isPrototypeOf', () => {
  it('should return true given input is prototype of object', () => {
    class MockTwo extends Mock {}
    expect(isPrototypeOf(new MockTwo(), Mock)).to.be.true;
  });

  it('should return false given input is not prototype of object', () => {
    class MockThree {}
    expect(isPrototypeOf(new MockThree(), Mock)).to.be.false;
  });
});
