import { TemplateResult } from 'lit-html';
import { Bootable } from './Bootable';

/**
 * A `BootStrategy` describes when to "boot". Booting in the context of the player
 * refers to when rendering of the current provider and loading media should begin.
 */
export interface BootStrategy<T extends Bootable = Bootable> {
  register(bootable: T): Promise<void>;
  destroy(): void;
  renderWhileBooting?(): TemplateResult;
}
