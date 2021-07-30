import { isBoolean, isNil } from '../../../utils/unit';
import { Context } from '../context';
import { ContextBindingController } from '../ContextBindingController';
import { ContextConsumerController } from '../ContextConsumerController';

/**
 * Binds attributes to a context.
 */
export class ContextAttrsController extends ContextBindingController<string> {
  protected _transformers = new Map<
    string,
    (attrName: string, value: any) => any
  >();

  /**
   * Binds a context to a attribute on the current `ref` element. By binds we mean as the
   * context value changes it will update the given attribute on the current `ref` element.
   *
   * @param context The context to bind to.
   * @param attrName The name of the attribute to bind the context to.
   * @param transformer An optional transformer to transform the context value before it is
   * stringified and applied as the attribute value. Returning a falsy value such as `null`,
   * `undefined` or `false` will remove the attribtue.
   */
  override bind<T>(
    context: Context<T>,
    attrName: string,
    transformer?: (value: T) => any
  ) {
    const transform = transformer
      ? (_: string, value: any) => transformer(value)
      : this._transformAttrValue;

    this._transformers.set(attrName, transform);
    return super.bind(context, attrName);
  }

  protected _handleBindToContext() {
    // no-op
  }

  protected _handleBindingUpdate(
    consumer: ContextConsumerController<any>,
    attrName: string
  ) {
    if (this._ref) {
      const name = this._transformAttrName(attrName);
      const transform = this._transformers.get(attrName)!;
      const value = transform(attrName, consumer.value);

      if (isNil(value) || value === false) {
        this._ref.removeAttribute(name);
      } else {
        this._ref.setAttribute(name, `${value}`);
      }
    }
  }

  protected _handleUnbindFromContext(
    _: ContextConsumerController<any>,
    attrName: string
  ) {
    const name = this._transformAttrName(attrName);
    this._ref?.removeAttribute(name);
  }

  /**
   * Override to transform attribute names.
   */
  protected _transformAttrName(attrName: string) {
    return attrName;
  }

  /**
   * Override to transform context values. Returning a falsy value such as `null`, `undefined` or
   * `false` will remove the attribtue. This is provided as the default transformer when one
   * isn't provided in the `bind()` method call.
   */
  protected _transformAttrValue(attrName: string, value: any): any {
    if (isBoolean(value) && value) return '';
    if (typeof value === 'number' && isNaN(value)) return 0;
    return value;
  }
}
