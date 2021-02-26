import createContext from '@wcom/context';
import { IS_CLIENT, IS_MOBILE } from '../../utils';
import { Device } from './DeviceObserver';

const guessDevice =
  (IS_CLIENT && window.innerWidth <= 480) || IS_MOBILE
    ? Device.Mobile
    : Device.Desktop;

export const deviceContext = Object.freeze({
  device: createContext(guessDevice),
  isMobileDevice: createContext(guessDevice === Device.Mobile),
  isDesktopDevice: createContext(guessDevice === Device.Desktop),
});
