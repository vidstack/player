import { fixture, html, oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { TemplateResult } from 'lit-html';

import { DeviceChangeEvent } from '../device/DeviceObserver';
import { Player } from '../Player';
import { MockMediaProvider } from '../provider/MockMediaProvider';
import { ProviderConnectEvent } from '../provider/provider.events';

export function emitEvent(el: HTMLElement, event: Event): void {
  setTimeout(() => el.dispatchEvent(event));
}

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

export async function buildPlayerWithMockProvider(
  slot?: TemplateResult,
): Promise<[Player, MockMediaProvider]> {
  const player = await fixture<Player>(html`<vds-player>
    <vds-mock-media-provider></vds-mock-media-provider>
    ${slot}
  </vds-player>`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const provider = player.querySelector('vds-mock-media-provider')!;
  await connectProviderToPlayer(player, provider);

  return [player, provider];
}

export async function connectProviderToPlayer(
  player: Player,
  provider: MockMediaProvider,
): Promise<void> {
  setTimeout(() =>
    provider.dispatchEvent(new ProviderConnectEvent({ detail: provider })),
  );

  await oneEvent(player, ProviderConnectEvent.TYPE);
}
