import { contextRecordProvider, provideContextRecord } from '@wcom/context';
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
      this.setAttribute('mobile', String(this.deviceContext.isMobileDevice));
      this.setAttribute('desktop', String(this.deviceContext.isDesktopDevice));
      this.dispatchEvent(new DeviceChangeEvent({ detail: device }));
    }

    get device(): DeviceObserver['device'] {
      return this.deviceContext.device;
    }
  }

  return DeviceObserverMixin;
}
