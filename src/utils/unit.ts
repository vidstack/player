export const isNull = (input: any): input is null => input === null;

export const isUndefined = (input: any): input is undefined =>
  typeof input === 'undefined';

export const isNullOrUndefined = (input: any): input is null | undefined =>
  isNull(input) || isUndefined(input);

export const getConstructor = (input: any): object | undefined =>
  !isNullOrUndefined(input) ? input.constructor : undefined;

export const isObject = (input: any) => getConstructor(input) === Object;

export const isNumber = (input: any): input is number =>
  getConstructor(input) === Number && !Number.isNaN(input);

export const isString = (input: any): input is string =>
  getConstructor(input) === String;

export const isBoolean = (input: any): input is boolean =>
  getConstructor(input) === Boolean;

export const isFunction = (input: any): input is Function =>
  getConstructor(input) === Function;

export const isArray = (input: any): input is any[] => Array.isArray(input);

export const isInstanceOf = (input: any, constructor: any) =>
  Boolean(input && constructor && input instanceof constructor);

export const isPrototypeOf = (input: any, object: any) =>
  Boolean(
    input && object && Object.isPrototypeOf.call(object.prototype, input),
  );
