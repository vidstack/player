import createContext, {
  ContextRecord,
  ContextRecordProvider,
} from '@wcom/context';

import { IS_CLIENT, IS_MOBILE } from '../../utils/support';
import { Device, DeviceProps } from './DeviceObserver';

const guessDevice =
  (IS_CLIENT && window.innerWidth <= 480) || IS_MOBILE
    ? Device.Mobile
    : Device.Desktop;

export type DeviceContext = ContextRecord<DeviceProps>;
export type DeviceContextProvider = ContextRecordProvider<DeviceProps>;

export const deviceContext: DeviceContext = Object.freeze({
  device: createContext(guessDevice),
  isMobileDevice: createContext(guessDevice === Device.Mobile),
  isDesktopDevice: createContext(guessDevice === Device.Desktop),
});
