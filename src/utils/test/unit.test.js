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
	noop
} from '../unit.js';

describe('utils/unit', function () {
	describe(isArray.name, function () {
		it('should return true only if given an array', function () {
			expect(isArray([])).to.be.true;
			expect(isArray('')).to.be.false;
			expect(isArray(null)).to.be.false;
			expect(isArray(undefined)).to.be.false;
			expect(isArray({})).to.be.false;
			expect(isArray(0)).to.be.false;
			expect(isArray(noop)).to.be.false;
			expect(isArray(false)).to.be.false;
		});
	});

	describe(isBoolean.name, function () {
		it('should return true only if given a boolean', function () {
			expect(isBoolean(true)).to.be.true;
			expect(isBoolean(false)).to.be.true;
			expect(isBoolean([])).to.be.false;
			expect(isBoolean('')).to.be.false;
			expect(isBoolean(null)).to.be.false;
			expect(isBoolean(undefined)).to.be.false;
			expect(isBoolean({})).to.be.false;
			expect(isBoolean(0)).to.be.false;
			expect(isBoolean(noop)).to.be.false;
		});
	});

	describe(isObject.name, function () {
		it('should return true only if given an object', function () {
			expect(isObject({})).to.be.true;
			expect(isObject('')).to.be.false;
			expect(isObject([])).to.be.false;
			expect(isObject(null)).to.be.false;
			expect(isObject(undefined)).to.be.false;
			expect(isObject(0)).to.be.false;
			expect(isObject(noop)).to.be.false;
			expect(isObject(false)).to.be.false;
		});
	});

	describe(isString.name, function () {
		it('should return true only if given a string', function () {
			expect(isString('')).to.be.true;
			expect(isString({})).to.be.false;
			expect(isString([])).to.be.false;
			expect(isString(null)).to.be.false;
			expect(isString(undefined)).to.be.false;
			expect(isString(0)).to.be.false;
			expect(isString(noop)).to.be.false;
			expect(isString(false)).to.be.false;
		});
	});

	describe(isNumber.name, function () {
		it('should return true only if given a number', function () {
			expect(isNumber(0)).to.be.true;
			expect(isNumber('')).to.be.false;
			expect(isNumber({})).to.be.false;
			expect(isNumber([])).to.be.false;
			expect(isNumber(null)).to.be.false;
			expect(isNumber(undefined)).to.be.false;
			expect(isNumber(noop)).to.be.false;
			expect(isNumber(false)).to.be.false;
		});
	});

	describe(isFunction.name, function () {
		it('should return true only if given a function', function () {
			expect(isFunction(noop)).to.be.true;
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
			expect(isNull(noop)).to.be.false;
			expect(isNull(0)).to.be.false;
			expect(isNull('')).to.be.false;
			expect(isNull({})).to.be.false;
			expect(isNull([])).to.be.false;
			expect(isNull(undefined)).to.be.false;
			expect(isNull(false)).to.be.false;
		});
	});

	describe(isUndefined.name, function () {
		it('should return true only if given undefined', function () {
			expect(isUndefined(undefined)).to.be.true;
			expect(isUndefined(null)).to.be.false;
			expect(isUndefined(noop)).to.be.false;
			expect(isUndefined(0)).to.be.false;
			expect(isUndefined('')).to.be.false;
			expect(isUndefined({})).to.be.false;
			expect(isUndefined([])).to.be.false;
			expect(isUndefined(false)).to.be.false;
		});
	});

	class Mock {}

	describe(getConstructor.name, function () {
		it('should return false given null or undefined', function () {
			expect(getConstructor(null)).to.be.undefined;
			expect(getConstructor(undefined)).to.be.undefined;
		});

		it('should return constructor given valid value', function () {
			const str = 'str';
			expect(getConstructor(str)).to.equal(str.constructor);
		});
	});

	describe(isInstanceOf.name, function () {
		it('should return true given value is a instance of class', function () {
			expect(isInstanceOf(new Mock(), Mock)).to.be.true;
		});

		it('should return false given null value or null constructor', function () {
			expect(isInstanceOf(null, Mock)).to.be.false;
			// @ts-ignore
			expect(isInstanceOf('', null)).to.be.false;
		});

		it('should return false given value is not a instance of class', function () {
			class MockTwo extends Mock {}
			expect(isInstanceOf(new Mock(), MockTwo)).to.be.false;
		});
	});

	describe(isPrototypeOf.name, function () {
		it('should return true given value is prototype of object', function () {
			class MockTwo extends Mock {}
			expect(isPrototypeOf(new MockTwo(), Mock)).to.be.true;
		});

		it('should return false given value is not prototype of object', function () {
			class MockThree {}
			expect(isPrototypeOf(new MockThree(), Mock)).to.be.false;
		});
	});

	describe(noop.name, function () {
		it('should be defined', function () {
			expect(noop).to.exist;
			expect(isFunction(noop)).to.be.true;
			noop();
		});
	});
});
