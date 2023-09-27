import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

<MediaPlayer title="..." src="...">
  <MediaProvider />
  <DefaultAudioLayout icons={defaultLayoutIcons} />
  <DefaultVideoLayout icons={defaultLayoutIcons} />
</MediaPlayer>;
