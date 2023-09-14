import { AsyncDirective, directive, PartType, type PartInfo } from 'lit-html/async-directive.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { effect, type ReadSignal, type StopEffect } from 'maverick.js';

class SignalDirective extends AsyncDirective {
  protected _signal: ReadSignal<any> | null = null;
  protected _stop: StopEffect | null = null;
  protected _isAttr = false;

  constructor(part: PartInfo) {
    super(part);
    this._isAttr = part.type === PartType.ATTRIBUTE;
  }

  render(signal: ReadSignal<any>) {
    if (this._signal !== signal) {
      this._signal = signal;
      this.disconnected();
      if (this.isConnected) this._watch();
    }

    const value = this._signal();
    return this._isAttr ? ifDefined(value) : value;
  }

  override reconnected() {
    this._watch();
  }

  override disconnected() {
    this._stop?.();
    this._stop = null;
    this.setValue(null);
  }

  protected _watch() {
    if (!this._signal) return;
    this._stop = effect(this._onValueChange.bind(this));
  }

  protected _onValueChange() {
    this.setValue(this._signal?.());
  }
}

export const $signal = directive(SignalDirective);
