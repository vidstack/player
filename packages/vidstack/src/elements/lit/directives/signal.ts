import { nothing } from 'lit-html';
import { AsyncDirective, directive, PartType, type PartInfo } from 'lit-html/async-directive.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { computed, effect, peek, type ReadSignal, type StopEffect } from 'maverick.js';

class SignalDirective extends AsyncDirective {
  #signal: ReadSignal<any> | null = null;
  #isAttr = false;
  #stop: StopEffect | null = null;

  constructor(part: PartInfo) {
    super(part);
    this.#isAttr = part.type === PartType.ATTRIBUTE || part.type === PartType.BOOLEAN_ATTRIBUTE;
  }

  render(signal: ReadSignal<any> | null) {
    if (signal !== this.#signal) {
      this.disconnected();
      this.#signal = signal;
      if (this.isConnected) this.#watch();
    }

    return this.#signal ? this.#resolveValue(peek(this.#signal)) : nothing;
  }

  override reconnected() {
    this.#watch();
  }

  override disconnected() {
    this.#stop?.();
    this.#stop = null;
  }

  #watch() {
    if (!this.#signal) return;
    this.#stop = effect(this.#onValueChange.bind(this));
  }

  #resolveValue(value: any) {
    return this.#isAttr ? ifDefined(value) : value;
  }

  #setValue(value: any) {
    this.setValue(this.#resolveValue(value));
  }

  #onValueChange() {
    if (__DEV__) {
      try {
        this.#setValue(this.#signal?.());
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
      this.#setValue(this.#signal?.());
    }
  }
}

export function $signal(compute: () => any): any {
  return directive(SignalDirective)(computed(compute));
}
