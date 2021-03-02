import { fixture, html, oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { TemplateResult } from 'lit-html';

import { DeviceChangeEvent } from '../device/DeviceObserver';
import { MediaProvider } from '../provider/MediaProvider';
import { FakeContextConsumer } from './FakeContextConsumer';
import { FakeMediaProvider } from './FakeMediaProvider';

export function emitEvent(el: HTMLElement, event: Event): void {
  setTimeout(() => el.dispatchEvent(event));
}

export async function buildFakeMediaProvider(
  slot?: TemplateResult,
): Promise<FakeMediaProvider> {
  return await fixture<FakeMediaProvider>(
    html`<vds-fake-media-provider>${html`${slot}`}</vds-fake-media-provider>`,
  );
}

export async function buildFakeMediaProviderWithFakeConsumer(
  slot?: TemplateResult,
): Promise<[FakeMediaProvider, FakeContextConsumer]> {
  const provider = await buildFakeMediaProvider(html`
    ${slot}
    <vds-fake-context-consumer></vds-fake-context-consumer>
  `);

  const consumer = provider.querySelector(
    'vds-fake-context-consumer',
  ) as FakeContextConsumer;

  return [provider, consumer];
}

export async function switchToMobileDevice(
  provider: MediaProvider,
): Promise<DeviceChangeEvent> {
  setTimeout(() => setViewport({ width: 360, height: 640 }));
  return (oneEvent(
    provider,
    DeviceChangeEvent.TYPE,
  ) as unknown) as DeviceChangeEvent;
}

export async function switchToDesktopDevice(
  player: MediaProvider,
): Promise<DeviceChangeEvent> {
  setTimeout(() => setViewport({ width: 1024, height: 640 }));
  return (oneEvent(
    player,
    DeviceChangeEvent.TYPE,
  ) as unknown) as DeviceChangeEvent;
}
