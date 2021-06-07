import { MediaContainerElement } from '../container';
import { MediaControllerElement } from '../controller';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';

export interface MediaFixture {
	controller: MediaControllerElement;
	container: MediaContainerElement;
	provider: FakeMediaProviderElement;
}
