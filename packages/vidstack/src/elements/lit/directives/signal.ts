import { nothing } from 'lit-html';
import { AsyncDirective, directive, PartType, type PartInfo } from 'lit-html/async-directive.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { computed, effect, peek, type ReadSignal, type StopEffect } from 'maverick.js';

class SignalDirective extends AsyncDirective {
  protected _signal: ReadSignal<any> | null = null;
  protected _isAttr = false;
  protected _stop: StopEffect | null = null;

  constructor(part: PartInfo) {
    super(part);
    this._isAttr = part.type === PartType.ATTRIBUTE || part.type === PartType.BOOLEAN_ATTRIBUTE;
  }

  render(signal: ReadSignal<any>) {
    if (signal !== this._signal) {
      this.disconnected();
      this._signal = signal;
      if (this.isConnected) this._watch();
    }

    return this._signal ? this._resolveValue(peek(this._signal)) : nothing;
  }

  override reconnected() {
    this._watch();
  }

  override disconnected() {
    this._stop?.();
    this._stop = null;
  }

  protected _watch() {
    if (!this._signal) return;
    this._stop = effect(this._onValueChange.bind(this));
  }

  private _resolveValue(value: any) {
    return this._isAttr ? ifDefined(value) : value;
  }

  private _setValue(value: any) {
    this.setValue(this._resolveValue(value));
  }

  protected _onValueChange() {
    if (__DEV__) {
      try {
        this._setValue(this._signal?.());
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
      this._setValue(this._signal?.());
    }
  }
}

export function $signal(compute: () => any): any {
  return directive(SignalDirective)(computed(compute));
}
