import { TIME_ELEMENT_TAG_NAME, TimeElement } from './TimeElement.js';
declare global {
    interface HTMLElementTagNameMap {
        [TIME_ELEMENT_TAG_NAME]: TimeElement;
    }
}
