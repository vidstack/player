import { listenTo } from '@wcom/events';
import { Unsubscribe } from '../../../shared/types';
import { Bootable } from './Bootable';
import { BootStrategy } from './BootStrategy';

/**
 * This strategy boots when the boot target has been clicked. In the context of the player, use
 * this when you'd like to show some content for the user to engage with before starting media
 * playback. Render any content using `<div slot="booting" />` inside the player or by
 * overriding the `renderWhileBooting` method in this class.
 */
export class ClickBootStrategy implements BootStrategy {
  protected disposal = new Map<Bootable, Unsubscribe>();

  async register(bootable: Bootable): Promise<void> {
    // Cleanup any previous registration.
    this.disposal.get(bootable)?.();

    this.setupClickListener(bootable);
  }

  destroy(): void {
    this.disposal.forEach(cb => cb());
  }

  protected boot(bootable: Bootable): void {
    bootable.boot();
  }

  protected setupClickListener(bootable: Bootable): void {
    const off = listenTo(bootable.bootTarget, 'click', (e: MouseEvent) => {
      this.handleClick(e, bootable);
      this.disposal.delete(bootable);
      off();
    });

    this.disposal.set(bootable, off);
  }

  protected handleClick(_: MouseEvent, bootable: Bootable): void {
    this.boot(bootable);
  }
}
