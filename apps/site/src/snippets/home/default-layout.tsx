import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import React from 'react';
import Image from 'next/image';

import { MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

function YourPlayer() {
  return (
    <MediaPlayer title="..." src="/stream.m3u8" aspectRatio="16/9">
      <MediaProvider>
        <Image src="/poster.webp" alt="..." placeholder="blur" />
        <Track src="/chapters.vtt" lang="en-US" kind="chapters" default />
      </MediaProvider>
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        thumbnails="/thumbnails.vtt"
        style={{
          '--video-brand': '#f5f5f5',
        }}
      />
    </MediaPlayer>
  );
}
