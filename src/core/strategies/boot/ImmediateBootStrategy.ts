import { Bootable, BootStrategy } from './BootStrategy';

/**
 * This strategy boots immediately. In the context of the player, use this if you have a single
 * media player that you'd like to boot ASAP. Do not use this strategy on more than one player
 * as it'll result in all media loading at the same time, which would be terrible for
 * performance and data usage.
 */
export class ImmediateBootStrategy implements BootStrategy {
  async register(bootable: Bootable): Promise<void> {
    bootable.boot();
  }

  destroy(): void {
    // no-op
  }
}
