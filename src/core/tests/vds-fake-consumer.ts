import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { FakeConsumer } from './FakeConsumer';

export const FAKE_CONSUMER_TAG_NAME = `${LIB_PREFIX}-fake-consumer`;

safelyDefineCustomElement(FAKE_CONSUMER_TAG_NAME, FakeConsumer);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-consumer': FakeConsumer;
  }
}
