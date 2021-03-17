import './vds-fake-media-provider';
import './vds-fake-context-consumer';

import { fixture, html } from '@open-wc/testing';
import { TemplateResult } from 'lit-html';

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
