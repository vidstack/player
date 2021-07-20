import { isDerviedContext } from './context.js';
const PROVIDERS = Symbol('providers');
const CONSUMERS = Symbol('consumers');
/**
 * @template {any} T
 * @param {typeof import('lit').ReactiveElement} ctor
 * @param {string|symbol} name
 * @param {import('./types').Context<T>} context
 * @param {import('./types').ContextProvideOptions<T>} [options]
 */
export function defineContextProvider(ctor, name, context, options = {}) {
  var _a, _b;
  // Might be called by decorator.
  /** @type {any} */ (_b = (_a = ctor).finalizeContext) === null ||
  _b === void 0
    ? void 0
    : _b.call(_a);
  ctor.addInitializer((element) => {
    if (!element[PROVIDERS]) element[PROVIDERS] = new Map();
    const provider = context.provide(element, options);
    element[PROVIDERS].set(name, provider);
  });
  Object.defineProperty(ctor.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      return this[PROVIDERS].get(name).value;
    },
    set: isDerviedContext(context)
      ? function () {
          // console.warn(`Context provider property [${name}] is derived, thus it's readonly.`);
        }
      : function (newValue) {
          // @ts-ignore
          this[PROVIDERS].get(name).value = newValue;
        }
  });
}
/**
 * @template {any} T
 * @param {typeof import('lit').ReactiveElement} ctor
 * @param {string|symbol} name
 * @param {import('./types').Context<T>} context
 * @param {import('./types').ContextConsumeOptions<T>} [options]
 */
export function defineContextConsumer(ctor, name, context, options = {}) {
  var _a, _b;
  // Might be called by decorator.
  /** @type {any} */ (_b = (_a = ctor).finalizeContext) === null ||
  _b === void 0
    ? void 0
    : _b.call(_a);
  /**
   * @param {import('lit').ReactiveElement} element
   * @returns {import('./types').ContextConsumer<any>}
   */
  function initConsumer(element) {
    var _a, _b;
    let initialized = false;
    let oldValue =
      (_b =
        (_a = options.transform) === null || _a === void 0
          ? void 0
          : _a.call(options, context.initialValue)) !== null && _b !== void 0
        ? _b
        : context.initialValue;
    const consumer = context.consume(
      element,
      Object.assign(Object.assign({}, options), {
        onUpdate: (newValue) => {
          var _a, _b;
          if (!initialized) return;
          // Trigger setters.
          element[name] = newValue;
          if (
            (_a = options.shouldRequestUpdate) !== null && _a !== void 0
              ? _a
              : true
          ) {
            element.requestUpdate(name, oldValue);
            oldValue = newValue;
          }
          (_b = options.onUpdate) === null || _b === void 0
            ? void 0
            : _b.call(element, newValue);
        }
      })
    );
    element[CONSUMERS].set(name, consumer);
    initialized = true;
    return consumer;
  }
  ctor.addInitializer((element) => {
    if (!element[CONSUMERS]) element[CONSUMERS] = new Map();
    initConsumer(element);
  });
  Object.defineProperty(ctor.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      return this[CONSUMERS].get(name).value;
    },
    set() {
      // console.warn(`Context consumer property [${name}] is readonly.`);
    }
  });
}
