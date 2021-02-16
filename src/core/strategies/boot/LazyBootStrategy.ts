import { canObserveIntersection, isUndefined } from '../../../utils';
import { Bootable } from './Bootable';
import { BootStrategy } from './BootStrategy';

/**
 * This strategy boots once the boot target has entered the browser viewport. In the 
 * context of the player, this is the default strategy used. Always prefer loading media 
 * and content on an as-needed basis (your users will thank you!).

 * Render content you'd like your users to see while booting either by using 
 * `<div slot="booting"` /> inside the player, or by overriding the `renderWhileBooting` method 
 * in this class.
 */
export class LazyBootStrategy implements BootStrategy {
  protected observer?: IntersectionObserver;

  /**
   * Options passed to the intersection observer.
   */
  protected observerOpts: IntersectionObserverInit = {
    threshold: 0.35,
  };

  /**
   * Keeps a mapping between `bootTarget` <-> `Bootable`. The mapping is deleted once
   * an intersection occurs.
   */
  protected bootables = new Map<HTMLElement, Bootable>();

  constructor() {
    if (canObserveIntersection()) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.observerOpts,
      );
    }
  }

  async register(bootable: Bootable): Promise<void> {
    // Cleanup any previous registration.
    this.observer?.unobserve(bootable.bootTarget);
    this.setupIntersectionObserver(bootable);
  }

  destroy(): void {
    this.observer?.disconnect();
  }

  protected boot(bootable: Bootable): void {
    bootable.boot();
    this.observer?.unobserve(bootable.bootTarget);
  }

  protected setupIntersectionObserver(bootable: Bootable): void {
    if (!canObserveIntersection()) {
      this.boot(bootable);
      return;
    }

    this.bootables.set(bootable.bootTarget, bootable);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.observer!.observe(bootable.bootTarget);
  }

  protected handleIntersection(entries: IntersectionObserverEntry[]): void {
    const entry = entries[0];

    if (entry.intersectionRatio > 0 || entry.isIntersecting) {
      const target = entry.target as HTMLElement;
      const bootable = this.bootables.get(target);

      if (!isUndefined(bootable)) {
        this.boot(bootable);
        this.bootables.delete(target);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.observer!.unobserve(target);
    }
  }
}
