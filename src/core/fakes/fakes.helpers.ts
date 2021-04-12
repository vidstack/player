import './vds-fake-media-provider';
import './vds-fake-context-consumer';

import { fixture, html } from '@open-wc/testing';
import { TemplateResult } from 'lit-html';

import { FakeMediaConsumerElement } from './FakeMediaConsumerElement';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';
import { VDS_FAKE_MEDIA_CONSUMER_ELEMENT_TAG_NAME } from './vds-fake-context-consumer';

export function emitEvent(el: HTMLElement, event: Event): void {
  setTimeout(() => el.dispatchEvent(event));
}

export async function buildFakeMediaProvider(
  slot?: TemplateResult,
): Promise<FakeMediaProviderElement> {
  return await fixture<FakeMediaProviderElement>(
    html`<vds-fake-media-provider>${html`${slot}`}</vds-fake-media-provider>`,
  );
}

export async function buildFakeMediaProviderWithFakeConsumer(
  slot?: TemplateResult,
): Promise<[FakeMediaProviderElement, FakeMediaConsumerElement]> {
  const provider = await buildFakeMediaProvider(html`
    ${slot}
    <vds-fake-media-consumer></vds-fake-media-consumer>
  `);

  const consumer = provider.querySelector(
    VDS_FAKE_MEDIA_CONSUMER_ELEMENT_TAG_NAME,
  ) as FakeMediaConsumerElement;

  return [provider, consumer];
}
