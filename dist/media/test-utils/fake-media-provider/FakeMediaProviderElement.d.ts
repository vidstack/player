export const FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME: "vds-fake-media-provider";
/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProviderElement extends MediaProviderElement {
    /**
     * Used to define accessors that are used during testing to update the context object.
     *
     * @protected
     */
    protected defineContextAccessors(): void;
    forceMediaReady(): void;
}
import { MediaProviderElement } from "../../provider/MediaProviderElement.js";
