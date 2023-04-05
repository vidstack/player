import { MediaPlayer } from '@vidstack/react';

<MediaPlayer
  // You can dynamically update this array by adding or removing tracks.
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
