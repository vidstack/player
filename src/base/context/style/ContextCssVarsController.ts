import { isNil } from '../../../utils/unit';
import { Context } from '../context';
import { ContextBindingController } from '../ContextBindingController';
import { ContextConsumerController } from '../ContextConsumerController';

/**
 * Binds CSS variables to a context.
 */
export class ContextCssVarsController extends ContextBindingController<string> {
  protected _transformers = new Map<
    string,
    (varName: string, value: any) => any
  >();

  /**
   * Binds a context to a CSS variable on the current `ref` element. By binds we mean as the
   * context value changes it will update the given CSS custom property on the current `ref`
   * element.
   *
   * @param context The context to bind to.
   * @param varName The name of the CSS custom property to bind the context to. This is will
   * result in `--${varName}`.
   * @param transformer An optional transformer to transform the context value before it is
   * stringified and applied as the CSS custom property value. Returning `null` or `undefined`
   * will remove the custom property.
   */
  override bind<T>(
    context: Context<T>,
    varName: string,
    transformer?: (value: T) => any
  ) {
    const transform = transformer
      ? (_: string, value: any) => transformer(value)
      : this._transformVarValue;

    this._transformers.set(varName, transform);
    return super.bind(context, varName);
  }

  protected _handleBindToContext() {
    // no-op
  }

  protected _handleBindingUpdate(
    consumer: ContextConsumerController<any>,
    varName: string
  ) {
    if (this._ref instanceof HTMLElement) {
      const name = `--${this._transformVarName(varName)}`;
      const transform = this._transformers.get(varName)!;
      const value = transform(varName, consumer.value);

      if (isNil(value)) {
        this._ref.style.removeProperty(name);
      } else {
        this._ref.style.setProperty(name, String(value));
      }
    }
  }

  protected _handleUnbindFromContext(
    _: ContextConsumerController<any>,
    varName: string
  ) {
    if (this._ref instanceof HTMLElement) {
      const name = `--${this._transformVarName(varName)}`;
      this._ref.style.removeProperty(name);
    }
  }

  /**
   * Override to transform CSS variable names.
   */
  protected _transformVarName(varName: string) {
    return varName;
  }

  /**
   * Override to transform context values to be used as CSS property values. Returning `null`
   * or `undefined` will remove the CSS property. This is provided as the default transformer when
   * one isn't provided in the `bind()` method call..
   */
  protected _transformVarValue(varName: string, value: unknown): any {
    if (typeof value === 'number' && isNaN(value)) return 0;
    return value;
  }
}
