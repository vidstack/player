/**
 * @typedef {{
 * controller: MediaControllerElement;
 * container: MediaContainerElement;
 * provider: FakeMediaProviderElement;
 * }} MediaFixture
 */
/**
 * @param {import('lit').TemplateResult} [uiSlot]
 * @param {import('lit').TemplateResult} [mediaSlot]
 * @returns {Promise<MediaFixture>}
 */
export function buildMediaFixture(uiSlot?: import("lit-html").TemplateResult<1 | 2> | undefined, mediaSlot?: import("lit-html").TemplateResult<1 | 2> | undefined): Promise<MediaFixture>;
export type MediaFixture = {
    controller: MediaControllerElement;
    container: MediaContainerElement;
    provider: FakeMediaProviderElement;
};
import { MediaControllerElement } from "../controller/MediaControllerElement.js";
import { MediaContainerElement } from "../container/MediaContainerElement.js";
import { FakeMediaProviderElement } from "./fake-media-provider/FakeMediaProviderElement.js";
