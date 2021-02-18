import { oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { DeviceChangeEvent } from '../player.events';
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
