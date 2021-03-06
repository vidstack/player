import { Disposal, event } from '@wcom/events';
import { UpdatingElement } from 'lit-element';

import { Constructor } from '../../shared/types';
import { deviceContext, DeviceContextProvider } from './device.context';
import {
  Device,
  DeviceChangeEvent,
  DeviceObserver,
  onDeviceChange,
} from './DeviceObserver';

export type DeviceObserverMixinBase = Constructor<UpdatingElement>;

export type DeviceObserverCocktail<T extends DeviceObserverMixinBase> = T &
  Constructor<
    DeviceObserver & {
      /**
       * **DO NOT CALL FROM OUTSIDE THE PLAYER.**
       *
       * @internal - Used for testing.
       */
      readonly deviceContext: DeviceContextProvider;

      /**
       * The name of the attribute on the player for which to set whether the current device is
       * mobile. The attribute will be set to `true`/`false` accordingly.
       */
      mobileDeviceAttrName: string;

      /**
       * The name of the attribute on the player for which to set whether the current device is
       * desktop. The attribute will be set to `true`/`false` accordingly.
       */
      desktopDeviceAttrName: string;
    }
  >;

// Keep disposal key a symbol to avoid clashing with other mixins.
const DISPOSAL = Symbol();

/**
 * Mixes in device properties and contexts which are automatically updated when the
 * device is changed. This mixin also dispatches a `DeviceChangeEvent` and sets mobile/desktop
 * attributes on the component.
 *
 * @param Base - the constructor to mix into.
 */
export function DeviceObserverMixin<T extends DeviceObserverMixinBase>(
  Base: T,
): DeviceObserverCocktail<T> {
  class DeviceObserverMixin extends Base implements DeviceContextProvider {
    protected readonly [DISPOSAL] = new Disposal();

    get deviceContext(): DeviceContextProvider {
      return this;
    }

    @deviceContext.device.provide()
    deviceCtx = deviceContext.device.defaultValue;

    @deviceContext.isMobileDevice.provide()
    isMobileDeviceCtx = deviceContext.isMobileDevice.defaultValue;

    @deviceContext.isDesktopDevice.provide()
    isDesktopDeviceCtx = deviceContext.isDesktopDevice.defaultValue;

    /**
     * Emitted when the type of user device changes between mobile/desktop.
     */
    @event({ name: 'vds-device-change' })
    protected DeviceChangeEvent!: DeviceChangeEvent;

    mobileDeviceAttrName = 'mobile';

    desktopDeviceAttrName = 'desktop';

    connectedCallback(): void {
      this.listenToDeviceChanges();
      super.connectedCallback();
    }

    disconnectedCallback(): void {
      this[DISPOSAL].empty();
      super.disconnectedCallback();
    }

    protected listenToDeviceChanges(): void {
      const off = onDeviceChange(this.handleDeviceChange.bind(this));
      this[DISPOSAL].add(off);
    }

    protected handleDeviceChange(device: Device): void {
      this.deviceCtx = device;
      this.isMobileDeviceCtx = this.isMobileDevice;
      this.isDesktopDeviceCtx = this.isDesktopDevice;

      this.setAttribute(this.mobileDeviceAttrName, String(this.isMobileDevice));

      this.setAttribute(
        this.desktopDeviceAttrName,
        String(this.isDesktopDevice),
      );

      this.dispatchEvent(new DeviceChangeEvent({ detail: device }));
    }

    get device(): DeviceObserver['device'] {
      return this.deviceCtx;
    }

    get isMobileDevice(): DeviceObserver['isMobileDevice'] {
      return this.deviceCtx === Device.Mobile;
    }

    get isDesktopDevice(): DeviceObserver['isDesktopDevice'] {
      return this.deviceCtx === Device.Desktop;
    }
  }

  return DeviceObserverMixin;
}
