import { oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { DeviceChangeEvent, InputDeviceChangeEvent } from '../player.events';
import { Player } from '../Player';

export async function switchToMobileDevice(
  player: Player,
): Promise<DeviceChangeEvent> {
  setTimeout(() => setViewport({ width: 360, height: 640 }));
  return (oneEvent(
    player,
    DeviceChangeEvent.TYPE,
  ) as unknown) as DeviceChangeEvent;
}

export async function switchToDesktopDevice(
  player: Player,
): Promise<DeviceChangeEvent> {
  setTimeout(() => setViewport({ width: 1024, height: 640 }));
  return (oneEvent(
    player,
    DeviceChangeEvent.TYPE,
  ) as unknown) as DeviceChangeEvent;
}

export async function useTouchInputDevice(
  player: Player,
): Promise<InputDeviceChangeEvent> {
  setTimeout(() => {
    window.dispatchEvent(new TouchEvent('touchstart'));
  });
  return (oneEvent(
    player,
    InputDeviceChangeEvent.TYPE,
  ) as unknown) as InputDeviceChangeEvent;
}

export async function useMouseInputDevice(
  player: Player,
): Promise<InputDeviceChangeEvent> {
  setTimeout(() => {
    window.dispatchEvent(new MouseEvent('mousemove'));
  });
  return (oneEvent(
    player,
    InputDeviceChangeEvent.TYPE,
  ) as unknown) as InputDeviceChangeEvent;
}

export async function useKeyboardInputDevice(
  player: Player,
): Promise<InputDeviceChangeEvent> {
  setTimeout(() => {
    window.dispatchEvent(new KeyboardEvent('keydown'));
  });
  return (oneEvent(
    player,
    InputDeviceChangeEvent.TYPE,
  ) as unknown) as InputDeviceChangeEvent;
}
