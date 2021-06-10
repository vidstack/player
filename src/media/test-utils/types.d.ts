import { MediaContainerElement } from '../container';
import { MediaControllerElement } from '../controller';
import { FakeMediaProviderElement } from './fake-media-provider';

export interface MediaFixture {
	controller: MediaControllerElement;
	container: MediaContainerElement;
	provider: FakeMediaProviderElement;
}
