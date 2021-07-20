import { MEDIA_CONTAINER_ELEMENT_TAG_NAME, MediaContainerConnectEvent, MediaContainerElement } from './MediaContainerElement.js';
declare global {
    interface HTMLElementTagNameMap {
        [MEDIA_CONTAINER_ELEMENT_TAG_NAME]: MediaContainerElement;
    }
    interface GlobalEventHandlersEventMap {
        [MediaContainerConnectEvent.TYPE]: MediaContainerConnectEvent;
    }
}
