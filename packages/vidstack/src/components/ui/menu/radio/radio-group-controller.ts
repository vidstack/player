import { hasProvidedContext, peek, provideContext, signal, ViewController } from 'maverick.js';

import { setAttributeIfEmpty } from '../../../../utils/dom';
import { menuContext } from '../menu-context';
import { radioControllerContext, type RadioController } from './radio-controller';

export class RadioGroupController extends ViewController {
  #group = new Set<RadioController>();
  #value = signal('');
  #controller: RadioGroupController | null = null;

  onValueChange?: (newValue: string, trigger?: Event) => void;

  get values(): string[] {
    return Array.from(this.#group).map((radio) => radio.value());
  }

  get value() {
    return this.#value();
  }

  set value(value) {
    this.#onChange(value);
  }

  protected override onSetup(): void {
    provideContext(radioControllerContext, {
      add: this.#addRadio.bind(this),
      remove: this.#removeRadio.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, 'role', 'radiogroup');
    this.setAttributes({ value: this.#value });
  }

  protected override onDestroy() {
    this.#group.clear();
  }

  #addRadio(radio: RadioController) {
    if (this.#group.has(radio)) return;

    this.#group.add(radio);
    radio.onCheck = this.#onChangeBind;

    radio.check(radio.value() === this.#value());
  }

  #removeRadio(radio: RadioController) {
    radio.onCheck = null;
    this.#group.delete(radio);
  }

  #onChangeBind = this.#onChange.bind(this);
  #onChange(newValue: string, trigger?: Event) {
    const currentValue = peek(this.#value);

    if (!newValue || newValue === currentValue) return;

    const currentRadio = this.#findRadio(currentValue),
      newRadio = this.#findRadio(newValue);

    currentRadio?.check(false, trigger);
    newRadio?.check(true, trigger);

    this.#value.set(newValue);

    this.onValueChange?.(newValue, trigger);
  }

  #findRadio(newValue: string) {
    for (const radio of this.#group) {
      if (newValue === peek(radio.value)) return radio;
    }

    return null;
  }
}
