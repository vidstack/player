import { MediaContainerElement } from '../container.js';
import { MediaControllerElement } from '../controller.js';
import { FakeMediaProviderElement } from './fake-media-provider.js';

export interface MediaFixture {
	controller: MediaControllerElement;
	container: MediaContainerElement;
	provider: FakeMediaProviderElement;
}
