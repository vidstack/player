import { MediaPlayer } from '@vidstack/react';

<MediaPlayer
  textTracks={[
    {
      src: '/media/subs/english.vtt',
      type: 'vtt',
      kind: 'subtitles',
      label: 'English',
      language: 'en-US',
      default: true,
    },
  ]}
>
  {/* ... */}
</MediaPlayer>;
