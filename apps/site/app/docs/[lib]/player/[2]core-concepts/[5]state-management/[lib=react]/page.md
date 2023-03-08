---
title: State Management
description: How to read and update media state with our React hooks.
---

# {% $frontmatter.title %}

In this section, we'll look at the React hooks available for reading and updating media state.

## Reading

The `useMediaStore` hook enables you to subscribe directly to specific media state
changes, rather than listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```tsx
import { MediaPlayer } from '@vidstack/react';
import { useState } from 'react';

function Player() {
  const [paused, setPaused] = useState(true);
  return (
    <MediaPlayer onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
      {/* ... */}
    </MediaPlayer>
  );
}
```

{% yes %}
Tracking media state via store hook:
{% /yes %}

```tsx {% highlight="9" %}
import { MediaPlayer, useMediaStore } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);
  // - This is a live subscription to the media paused state.
  // - All subscriptions are lazily created on prop access.
  const { paused } = useMediaStore(player);
  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
```

Or, if inside a child of `<MediaPlayer>`:

```tsx {% highlight="6" %}
import { useMediaStore } from '@vidstack/react';

// This component is a child of `<MediaPlayer>`
function MediaPlayerUI() {
  // No ref required.
  const { paused } = useMediaStore();
  // ...
}
```

Your IDE should provide helpful suggestions and docs on the media props that are available. You
can also use the [`MediaState`](https://github.com/vidstack/vidstack/blob/main/packages/vidstack/src/player/media/state.ts)
interface on GitHub as a reference.

### Avoiding Renders

Media state can be directly accessed on the `<MediaPlayer>` component if you'd like to avoid
unnecessary re-renders:

```tsx {% highlight="9,11-14" %}
import { MediaPlayer } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  useEffect(() => {
    const { paused } = player.current!.state;

    // Or, subscribe for updates.
    return player.subscribe(({ currentTime }) => {
      // ...
    });
  }, []);

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
```

Or, if inside a child of `<MediaPlayer>`:

```tsx
import { useMediaPlayer } from '@vidstack/react';

// This component is a child of `<MediaPlayer>`
function MediaPlayerUI() {
  const player = useMediaPlayer();
  useEffect(() => {
    if (!player) return;
    // Same as example above here.
  }, [player]);
}
```

## Updating

The `useMediaRemote` hook provides a simple facade for dispatching
[media request events](/docs/player/core-concepts/events#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```tsx {% highlight="10-13" %}
import { MediaPlayer, useMediaRemote } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);
  const remote = useMediaRemote(player);

  useEffect(() => {
    remote.play();
    remote.pause();
    remote.togglePaused();
    // ...
  }, []);

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
```

Or, if inside a child of `<MediaPlayer>`:

```tsx {% highlight="6" %}
import { useMediaRemote } from '@vidstack/react';

// This component is a child of `<MediaPlayer>`
function MediaPlayerUI() {
  // No ref required.
  const remote = useMediaRemote();
  // ...
}
```

### Event Triggers

[Event triggers](/docs/player/core-concepts/events#event-triggers) enable connecting media events
back to their origin event. This can be useful when trying to understand how a media event was
triggered, or when analyzing data such as the time difference between the request and when the media
was actually played.

```tsx {% highlight="5,10" %}
import { useMediaRemote } from '@vidstack/react';
import { type PointerEvent } from 'react';

function PlayButton() {
  const remote = useMediaRemote();

  function onPointerUp({ nativeEvent }: PointerEvent) {
    // - We are providing the "trigger" here.
    // - The media play event will have this pointer event in its chain.
    remote.togglePaused(nativeEvent);
  }

  return <button onPointerUp={onPointerUp}>{/* ... */}</button>;
}
```

You can set a target to dispatch events from if you're performing actions without trigger events
like so:

```tsx {% highlight="7,10" %}
import { useMediaRemote } from '@vidstack/react';
import { useEffect, useRef } from 'react';

function Foo() {
  const div = useRef<HTMLDivElement>(null);
  // Pass `div` as target to dispatch media requests from.
  const remote = useMediaRemote(div);

  useEffect(() => {
    remote.seek(100);
  }, []);

  return <div ref={div}>{/* ... */}</div>;
}
```

## Media Player

The `useMediaPlayer` hook provides you with a reference to the nearest parent
`MediaPlayerElement` (i.e., `<media–player>`).

```tsx
import { useMediaPlayer } from '@vidstack/react';
import { useEffect } from 'react';

// This component is a child of `<MediaPlayer>`
function MediaPlayerUI() {
  const player = useMediaPlayer();
  useEffect(() => {
    if (!player) return;
    // ...
  }, [player]);
}
```

{% no %}
Avoid calling methods directly on the player element:
{% /no %}

```tsx
import { useMediaPlayer } from '@vidstack/react';
import { useEffect } from 'react';

// This component is a child of `<MediaPlayer>`
function MediaPlayerUI() {
  const player = useMediaPlayer();
  useEffect(() => {
    if (!player) return;
    // BAD: try to avoid doing this as you will lose valuable information
    // provided by event chains. Prefer the request/response model by using
    // the `useMediaRemote` hook.
    player.play();
  }, [player]);
}
```

All player properties and methods can be found in the [`<media-player>` API reference](/docs/player/components/layout/player/api).

## Media Provider

The `useMediaProvider` hook provides you with a reference to the current `MediaProvider`:

```tsx
import { useMediaProvider } from '@vidstack/react';
import { useEffect } from 'react';
import { isAudioProvider, isHLSProvider, isVideoProvider } from 'vidstack';

// This component is a child of `<MediaPlayer>`
function MediaPlayerUI() {
  const provider = useMediaProvider();

  useEffect(() => {
    if (isAudioProvider(provider)) {
      const audioElement = provider.audio;
    }

    if (isVideoProvider(provider)) {
      const videoElement = provider.video;
    }

    if (isHLSProvider(provider)) {
      provider.onInstance((hlsjs) => {
        // ...
      });
    }
  }, [provider]);
}
```
