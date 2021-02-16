import { TemplateResult } from 'lit-html';

export interface Bootable {
  bootTarget: HTMLElement;
  boot(): Promise<void>;
}

/**
 * A `BootStrategy` describes when to "boot". Booting in the context of the player
 * refers to when rendering of the current provider and loading media should begin.
 */
export interface BootStrategy<T extends Bootable = Bootable> {
  register(bootable: T): Promise<void>;
  destroy(): void;
  renderWhileBooting?(): TemplateResult;
}

// V8ToIstanbul throws errors if a non-ts-type object isn't exported.
export default class {}
