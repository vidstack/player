import { hasProvidedContext, peek, provideContext, signal, ViewController } from 'maverick.js';

import { setAttributeIfEmpty } from '../../../../utils/dom';
import { menuContext } from '../menu-context';
import { radioControllerContext, type RadioController } from './radio-controller';

export class RadioGroupController extends ViewController {
  protected _group = new Set<RadioController>();
  protected _value = signal('');
  protected _controller: RadioGroupController | null = null;

  _onValueChange?: (newValue: string, trigger?: Event) => void;

  get _values(): string[] {
    return Array.from(this._group).map((radio) => radio._value());
  }

  get value() {
    return this._value();
  }

  set value(value) {
    this._onChange(value);
  }

  protected override onSetup(): void {
    provideContext(radioControllerContext, {
      add: this._addRadio.bind(this),
      remove: this._removeRadio.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, 'role', 'radiogroup');
    this.setAttributes({ value: this._value });
  }

  protected override onDestroy() {
    this._group.clear();
  }

  private _addRadio(radio: RadioController) {
    if (this._group.has(radio)) return;

    this._group.add(radio);
    radio._onCheck = this._onChangeBind;

    radio._check(radio._value() === this._value());
  }

  private _removeRadio(radio: RadioController) {
    radio._onCheck = null;
    this._group.delete(radio);
  }

  private _onChangeBind = this._onChange.bind(this);
  private _onChange(newValue: string, trigger?: Event) {
    const currentValue = peek(this._value);

    if (!newValue || newValue === currentValue) return;

    const currentRadio = this._findRadio(currentValue),
      newRadio = this._findRadio(newValue);

    currentRadio?._check(false, trigger);
    newRadio?._check(true, trigger);

    this._value.set(newValue);

    this._onValueChange?.(newValue, trigger);
  }

  private _findRadio(newValue: string) {
    for (const radio of this._group) {
      if (newValue === peek(radio._value)) return radio;
    }

    return null;
  }
}
