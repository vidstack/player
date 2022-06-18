import {
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  noop,
} from './unit';

describe(isArray.name, function () {
  it('should return true only if given an array', function () {
    expect(isArray([])).to.be.true;
    expect(isArray(Array(1))).to.be.true;
    expect(isArray('')).to.be.false;
    expect(isArray(null)).to.be.false;
    expect(isArray(undefined)).to.be.false;
    expect(isArray({})).to.be.false;
    expect(isArray(0)).to.be.false;
    expect(isArray(() => {})).to.be.false;
    expect(isArray(function () {})).to.be.false;
    expect(isArray(async function () {})).to.be.false;
    expect(isArray(false)).to.be.false;
  });
});

describe(isBoolean.name, function () {
  it('should return true only if given a boolean', function () {
    expect(isBoolean(true)).to.be.true;
    expect(isBoolean(false)).to.be.true;
    expect(isBoolean(Boolean())).to.be.true;
    expect(isBoolean([])).to.be.false;
    expect(isBoolean('')).to.be.false;
    expect(isBoolean(null)).to.be.false;
    expect(isBoolean(undefined)).to.be.false;
    expect(isBoolean({})).to.be.false;
    expect(isBoolean(0)).to.be.false;
    expect(isBoolean(() => {})).to.be.false;
    expect(isBoolean(function () {})).to.be.false;
    expect(isBoolean(async function () {})).to.be.false;
  });
});

describe(isObject.name, function () {
  it('should return true only if given an object', function () {
    expect(isObject({})).to.be.true;
    expect(isObject(Object.create({}))).to.be.true;
    expect(isObject('')).to.be.false;
    expect(isObject([])).to.be.false;
    expect(isObject(null)).to.be.false;
    expect(isObject(undefined)).to.be.false;
    expect(isObject(0)).to.be.false;
    expect(isObject(false)).to.be.false;
    expect(isObject(() => {})).to.be.false;
    expect(isObject(function () {})).to.be.false;
    expect(isObject(async function () {})).to.be.false;
    expect(isObject(Array(1))).to.be.false;
  });
});

describe(isString.name, function () {
  it('should return true only if given a string', function () {
    expect(isString('')).to.be.true;
    expect(isString(String(''))).to.be.true;
    expect(isString({})).to.be.false;
    expect(isString([])).to.be.false;
    expect(isString(null)).to.be.false;
    expect(isString(undefined)).to.be.false;
    expect(isString(0)).to.be.false;
    expect(isString(false)).to.be.false;
    expect(isString(() => {})).to.be.false;
    expect(isString(function () {})).to.be.false;
    expect(isString(async function () {})).to.be.false;
  });
});

describe(isNumber.name, function () {
  it('should return true only if given a number', function () {
    expect(isNumber(0)).to.be.true;
    expect(isNumber(Number())).to.be.true;
    expect(isNumber('')).to.be.false;
    expect(isNumber({})).to.be.false;
    expect(isNumber([])).to.be.false;
    expect(isNumber(null)).to.be.false;
    expect(isNumber(undefined)).to.be.false;
    expect(isNumber(false)).to.be.false;
    expect(isNumber(() => {})).to.be.false;
    expect(isNumber(function () {})).to.be.false;
    expect(isNumber(async function () {})).to.be.false;
  });
});

describe(isFunction.name, function () {
  it('should return true only if given a function', function () {
    expect(isFunction(() => {})).to.be.true;
    expect(isFunction(function () {})).to.be.true;
    expect(isFunction(async function () {})).to.be.true;
    expect(isFunction(Function())).to.be.true;
    expect(isFunction(0)).to.be.false;
    expect(isFunction('')).to.be.false;
    expect(isFunction({})).to.be.false;
    expect(isFunction([])).to.be.false;
    expect(isFunction(null)).to.be.false;
    expect(isFunction(undefined)).to.be.false;
    expect(isFunction(false)).to.be.false;
  });
});

describe(isNull.name, function () {
  it('should return true only if given null', function () {
    expect(isNull(null)).to.be.true;
    expect(isNull(() => {})).to.be.false;
    expect(isNull(0)).to.be.false;
    expect(isNull('')).to.be.false;
    expect(isNull({})).to.be.false;
    expect(isNull([])).to.be.false;
    expect(isNull(undefined)).to.be.false;
    expect(isNull(false)).to.be.false;
    expect(isNull(() => {})).to.be.false;
    expect(isNull(function () {})).to.be.false;
    expect(isNull(async function () {})).to.be.false;
  });
});

describe(isUndefined.name, function () {
  it('should return true only if given undefined', function () {
    expect(isUndefined(undefined)).to.be.true;
    expect(isUndefined(null)).to.be.false;
    expect(isUndefined(() => {})).to.be.false;
    expect(isUndefined(0)).to.be.false;
    expect(isUndefined('')).to.be.false;
    expect(isUndefined({})).to.be.false;
    expect(isUndefined([])).to.be.false;
    expect(isUndefined(false)).to.be.false;
    expect(isUndefined(() => {})).to.be.false;
    expect(isUndefined(function () {})).to.be.false;
    expect(isUndefined(async function () {})).to.be.false;
  });
});

describe(noop.name, function () {
  it('should be defined', function () {
    expect(noop).to.exist;
    expect(isFunction(noop)).to.be.true;
    noop();
  });
});
