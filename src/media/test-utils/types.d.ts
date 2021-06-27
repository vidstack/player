import { MediaContainerElement } from '../container/index.js';
import { MediaControllerElement } from '../controller/index.js';
import { FakeMediaProviderElement } from './fake-media-provider/index.js';

export interface MediaFixture {
	controller: MediaControllerElement;
	container: MediaContainerElement;
	provider: FakeMediaProviderElement;
}
