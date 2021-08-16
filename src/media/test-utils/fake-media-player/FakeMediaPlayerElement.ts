import { WithMediaPlayer } from '../../player';
import { FakeMediaProviderElement } from '../fake-media-provider/FakeMediaProviderElement';

export const FAKE_MEDIA_PLAYER_ELEMENT_TAG_NAME = 'vds-fake-media-player';

/**
 * A fake media player that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the player in the desired state.
 */
export class FakeMediaPlayerElement extends WithMediaPlayer(
  FakeMediaProviderElement
) {}
