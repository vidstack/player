import createContext, {
  ContextRecord,
  ContextRecordProvider,
} from '@wcom/context';

import { IS_CLIENT, IS_MOBILE } from '../../utils/support';
import { Device, DeviceObserver } from './DeviceObserver';

const guessDevice =
  (IS_CLIENT && window.innerWidth <= 480) || IS_MOBILE
    ? Device.Mobile
    : Device.Desktop;

export interface DeviceContextProps extends DeviceObserver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  /**
   * Whether the current `device` is mobile (shorthand for `device === Device.Mobile`).
   */
  readonly isMobileDevice: boolean;

  /**
   * Whether the current `device` is desktop (shorthand for `device === Device.Desktop`).
   */
  readonly isDesktopDevice: boolean;
}

export type DeviceContext = ContextRecord<DeviceContextProps>;
export type DeviceContextProvider = ContextRecordProvider<DeviceContextProps>;

export const deviceContext: DeviceContext = {
  device: createContext(guessDevice),
  isMobileDevice: createContext(guessDevice === Device.Mobile),
  isDesktopDevice: createContext(guessDevice === Device.Desktop),
};
