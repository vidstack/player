import React from 'react';

import { useMediaPlaylist } from '@vidstack/nextjs';
import { MediaPlayer, MediaProvider } from '@vidstack/react';

function WatchPage() {
  // prettier-ignore
  const {
    playlist,
    currentMedia,
    setMedia
  } = useMediaPlaylist({
    userId: '...',
    filter: {
      // ❌ Type-safe - did you mean "react course"?
      tags: ['react-cours'],
    },
  });

  // 📦 Media asset bundle - synced with dashboard.
  // 🔒 Secure playback by default!
  // prettier-ignore
  const {
    src, type, poster, textTracks,
    title, description, views,
    duration, watchedPercent
  } = currentMedia;

  return (
    <div className="...">
      <MediaPlayer src={currentMedia}>
        <MediaProvider />
        {/* 🎀 Beautiful custom UI here. */}
      </MediaPlayer>

      {/* ⏭️ Watch next section. */}
      <div className="flex flex-col space-y-4 ...">
        {playlist.map((media) =>
          // prettier-ignore
          <div
            className="flex flex-col ..."
            onClick={() => setMedia(media)}
          >
            <img src={media.poster} alt={media.posterAlt} />
            <div>{media.title}</div>
            <div>{media.description}</div>
            {/* ... */}
          </div>,
        )}
      </div>
    </div>
  );
}
