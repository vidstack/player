import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { FakeContextConsumer } from './FakeContextConsumer';

export const FAKE_CONTEXT_CONSUMER_TAG_NAME = `${LIB_PREFIX}-fake-context-consumer`;

safelyDefineCustomElement(FAKE_CONTEXT_CONSUMER_TAG_NAME, FakeContextConsumer);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-context-consumer': FakeContextConsumer;
  }
}
