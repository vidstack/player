import { contextRecordProvider, provideContextRecord } from '@wcom/context';
import { event } from '@wcom/events';
import { UpdatingElement } from 'lit-element';

import { Constructor, Unsubscribe } from '../../shared/types';
import { transformContextName } from '../player.context';
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
       * Device context record.
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
  @provideContextRecord(deviceContext, transformContextName)
  class DeviceObserverMixin extends Base {
    @contextRecordProvider(deviceContext, transformContextName)
    readonly deviceContext!: DeviceContextProvider;

    /**
     * Emitted when the type of user device changes between mobile/desktop.
     */
    @event({ name: 'vds-device-change' })
    protected DeviceChangeEvent!: DeviceChangeEvent;

    mobileDeviceAttrName = 'mobile';

    desktopDeviceAttrName = 'desktop';

    private unsubDeviceChanges?: Unsubscribe;

    connectedCallback(): void {
      this.listenToDeviceChanges();
      super.connectedCallback();
    }

    disconnectedCallback(): void {
      this.unsubDeviceChanges?.();
      this.unsubDeviceChanges = undefined;
      super.disconnectedCallback();
    }

    protected listenToDeviceChanges(): void {
      this.unsubDeviceChanges = onDeviceChange(
        this.handleDeviceChange.bind(this),
      );
    }

    protected handleDeviceChange(device: Device): void {
      this.deviceContext.device = device;
      this.deviceContext.isMobileDevice = device === Device.Mobile;
      this.deviceContext.isDesktopDevice = device === Device.Desktop;

      this.setAttribute(this.mobileDeviceAttrName, String(this.isMobileDevice));

      this.setAttribute(
        this.desktopDeviceAttrName,
        String(this.isDesktopDevice),
      );

      this.dispatchEvent(new DeviceChangeEvent({ detail: device }));
    }

    get device(): DeviceObserver['device'] {
      return this.deviceContext.device;
    }

    get isMobileDevice(): DeviceObserver['isMobileDevice'] {
      return this.deviceContext.isMobileDevice;
    }

    get isDesktopDevice(): DeviceObserver['isDesktopDevice'] {
      return this.deviceContext.isDesktopDevice;
    }
  }

  return DeviceObserverMixin;
}
