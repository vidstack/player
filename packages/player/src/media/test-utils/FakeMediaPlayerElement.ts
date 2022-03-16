import { WithMediaPlayer } from '../player';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';

/**
 * A fake media player that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the player in the desired state.
 */
export class FakeMediaPlayerElement extends WithMediaPlayer(FakeMediaProviderElement) {}
