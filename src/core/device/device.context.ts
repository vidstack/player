import createContext, { Context } from '@wcom/context';

import { IS_CLIENT, IS_MOBILE } from '../../utils/support';
import { Device, DeviceProps } from './DeviceObserver';

const guessDevice =
  (IS_CLIENT && window.innerWidth <= 480) || IS_MOBILE
    ? Device.Mobile
    : Device.Desktop;

export type DeviceContext = {
  readonly [P in keyof DeviceProps]: Context<DeviceProps[P]>;
};

export type DeviceContextProvider = {
  -readonly [P in keyof DeviceProps as `${P}Ctx`]: DeviceProps[P];
};

export const deviceContext: DeviceContext = Object.freeze({
  device: createContext(guessDevice),
  isMobileDevice: createContext(guessDevice === Device.Mobile),
  isDesktopDevice: createContext(guessDevice === Device.Desktop),
});
