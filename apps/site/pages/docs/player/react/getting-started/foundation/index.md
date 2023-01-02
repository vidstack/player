---
title: Foundation
description: Introduction to using Vidstack Player with React.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of using Vidstack Player with React.

## Importing Components

You can import all components from the path `@vidstack/player-react`. Component names mirror
the element tag name except they're in PascalCase without the `vds` prefix.

- `vds-media` -> `Media`
- `vds-video` -> `Video`
- `vds-play-button` -> `PlayButton`

```js
import { Media, PlayButton, Video } from '@vidstack/player-react';
```

Keep in mind that you're implicitly registering the underlying custom element by importing a
React component.

## Element References

All components forward the underlying custom element reference, so you can use the familiar
`useRef` hook to get a hold of it. This is _generally_ only required when calling a method.

```tsx
import { type VideoElement } from '@vidstack/player';
import { Media, Video } from '@vidstack/player-react';
import { useEffect, useRef } from 'React';

function MyPlayer() {
  const provider = useRef<VideoElement>(null);

  useEffect(() => {
    provider.current!.startLoadingMedia();
  }, []);

  return (
    <Media>
      <Video loading="custom" ref={provider}>
        <video src="..." />
      </Video>
    </Media>
  );
}
```

## Properties

We expose all custom element properties on the React wrapper, which gets forwarded to the
element itself; therefore, you can pass in complex data types such as objects and arrays without
any issues.

```tsx
import { Hls, Media } from '@vidstack/player-react';

function MyPlayer() {
  return (
    <Media>
      <Hls hlsLibrary={() => import('hls.js')} hlsConfig={{ lowLatencyMode: true }}>
        <video src="..." />
      </Hls>
    </Media>
  );
}
```

## Events

All custom events are forwarded to a callback whose name mirrors the original event name but in
PascalCase:

- `vds-play` -> `onVdsPlay`
- `vds-playing` -> `onVdsPlaying`
- `vds-can-play` -> `onVdsCanPlay`

```tsx
import { type MediaPlayingEvent } from '@vidstack/player';
import { Media, Video } from '@vidstack/player-react';

function MyPlayer() {
  function onPlaying(event: MediaPlayingEvent) {
    // ...
  }

  return (
    <Media>
      <Video onVdsPlaying={onPlaying}>
        <video src="..." />
      </Video>
    </Media>
  );
}
```

## Media Hooks

We provide a few hooks to make it easy for you to interact with the current media such as
getting the current state of playback (e.g., "is the media paused?"), or dispatching
[media request events](/docs/player/getting-started/events/#request-events) (e.g., request media to
play/pause).

### `useMediaContext`

The media context hook enables you to subscribe directly to specific media state changes, rather
than listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```tsx
import { Media, Video } from '@vidstack/player-react';
import { useState } from 'react';

function MediaPlayer() {
  const [paused, setPaused] = useState(false);

  return (
    <Media>
      <Video onVdsPlay={() => setPaused(false)} onVdsPause={() => setPaused(true)}>
        {/* ... */}
      </Video>
    </Media>
  );
}
```

{% yes %}
Tracking media state via store hook:
{% /yes %}

```tsx
import { type MediaElement } from '@vidstack/player';
import { Media, useMediaContext } from '@vidstack/player-react';
import { useRef } from 'react';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);

  // - This is a live subscription to the paused store.
  // - All stores are lazily subscribed to on prop access.
  const { paused } = useMediaContext(media);

  return <Media ref={media}>{/* ... */}</Media>;
}
```

```tsx
function MediaChild() {
  // No ref required if used inside `<Media>` child component.
  const { paused } = useMediaContext();
}

function MediaPlayer() {
  return (
    <Media>
      <MediaChild />
    </Media>
  );
}
```

Your IDE should provide helpful suggestions and docs on the context properties that are available. You
can also use the [`MediaContext`](https://github.com/vidstack/vidstack/blob/main/packages/player/src/media/MediaContext.ts)
interface on GitHub as a reference.

### `useMediaRemote`

The media remote hook provides a simple facade for dispatching
[media request events](/docs/player/getting-started/events/#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```tsx
import { useMediaContext, useMediaRemote } from '@vidstack/player-react';
import React from 'react';

function PlayButton() {
  const remote = useMediaRemote();
  const { paused } = useMediaContext();

  function onPointerUp({ nativeEvent }: React.PointerEvent) {
    if (paused) {
      // - We are providing the "trigger" here.
      // - Trigger events allow us to trace events back to their origin.
      // - The media play event will have this pointer event in its chain.
      remote.play(nativeEvent);
    } else {
      remote.pause(nativeEvent);
    }
  }

  return <button onPointerUp={onPointerUp}>{/* ... */}</button>;
}
```

Your IDE should provide helpful suggestions and docs on the available methods. You can also use
the [`MediaRemoteControl`](https://github.com/vidstack/vidstack/blob/main/packages/player/src/media/interact/MediaRemoteControl.ts)
source on GitHub as a reference.

### `useMediaElement`

The following hook provides you with a reference to the nearest parent `MediaElement`. You can
generally avoid using this hook unless you need direct access to some DOM API on the media element.

```tsx
import { useMediaElement } from '@vidstack/player-react';

function MediaChild() {
  const media = useMediaElement();
  // ...
}
```

{% no %}
Avoid calling methods directly on the provider element:
{% /no %}

```tsx
import { useMediaElement } from '@vidstack/player-react';
import { useEffect } from 'react';

function MediaChild() {
  const media = useMediaElement();

  useEffect(() => {
    // BAD: try to avoid doing this as you will lose valuable information
    // provided by event chains. Prefer the request/response model by using
    // the `useMediaRemote` hook.
    media.provider?.play();
  }, [media]);
}
```
