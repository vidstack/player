import type { TemplateResult } from 'lit-html';
import { AsyncDirective, directive, PartType, type PartInfo } from 'lit-html/async-directive.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { computed, effect, peek, type ReadSignal, type StopEffect } from 'maverick.js';

class SignalDirective extends AsyncDirective {
  protected _signal: ReadSignal<any> | null = null;
  protected _value: any = undefined;
  protected _stop: StopEffect | null = null;
  protected _isAttr = false;

  constructor(part: PartInfo) {
    super(part);
    this._isAttr = part.type === PartType.ATTRIBUTE;
  }

  render(signal: ReadSignal<any>) {
    if (this._signal !== signal) {
      this.disconnected();
      this._signal = signal;
      if (this.isConnected) {
        this._value = peek(this._signal);
        this._watch();
      }
    }

    return this._isAttr ? ifDefined(this._value) : this._value;
  }

  override reconnected() {
    this._watch();
  }

  override disconnected() {
    this._stop?.();
    this._stop = null;
    this._value = undefined;
  }

  protected _watch() {
    if (!this._signal) return;
    this._stop = effect(this._onValueChange.bind(this));
  }

  protected _onValueChange() {
    const value = this._signal?.();
    if (value === this._value) return;

    if (__DEV__) {
      try {
        this._value = value;
        this.setValue(value);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('This `ChildPart` has no `parentNode`')
        ) {
          const svelteDynamicImportExample = [
            "{#await import('./Player.svelte') then {default: Player}}",
            '  <svelte:component this={Player} />',
            '{/await}',
          ].join('\n');

          console.warn(
            `[vidstack] Failed to render most likely due to a hydration issue with your framework.` +
              ` Dynamically importing the player should resolve the issue.` +
              `\n\nSvelte Example:\n\n${svelteDynamicImportExample}`,
          );
        } else {
          console.error(error);
        }
      }
    } else {
      this.setValue(this._signal?.());
    }
  }
}

export const $signal = directive(SignalDirective);

export function $computed(compute: () => TemplateResult | string | null) {
  return $signal(computed(compute));
}
