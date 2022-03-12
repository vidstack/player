import { WithMediaPlayer } from '../player/index.js';
import { FakeMediaProviderElement } from './FakeMediaProviderElement.js';

/**
 * A fake media player that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the player in the desired state.
 */
export class FakeMediaPlayerElement extends WithMediaPlayer(FakeMediaProviderElement) {}
