---
title: State Management
description: How to read and update media state with our React hooks.
---

# {% $frontmatter.title %}

In this section, we'll look at the React hooks available for reading and updating media state.

## Setup

The `<MediaProvider>` is required to enable using media hooks:

```tsx
import { Media, MediaProvider } from '@vidstack/react';

export function MediaPlayer() {
  return (
    <MediaProvider>
      <Media>
        {/* provider goes here */}
        <MediaPlayerUI />
      </Media>
    </MediaProvider>
  );
}

function MediaPlayerUI() {
  // Media hooks can be used here.
  return <div className="media-controls">{/* ... */}</div>;
}
```

## Reading

The media state hook enables you to subscribe directly to specific media state changes, rather
than listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```tsx
import { Media } from '@vidstack/react';
import { useState } from 'react';

function MediaPlayer() {
  const [paused, setPaused] = useState(true);
  return (
    <Media onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
      {/* ... */}
    </Media>
  );
}
```

{% yes %}
Tracking media state via hook:
{% /yes %}

```tsx {% highlight="8" %}
import { Media, useMediaState } from '@vidstack/react';
import { type MediaElement } from 'vidstack';

// This component is a child of `<MediaProvider>`
function MediaPlayerUI() {
  // - This is a live subscription to the media paused store.
  // - All stores are lazily subscribed to on prop access.
  const { paused } = useMediaState();

  // ...
}
```

Your IDE should provide helpful suggestions and docs on the media props that are available. You
can also use the [`MediaState`](https://github.com/vidstack/vidstack/blob/main/packages/vidstack/src/player/media/state.ts)
interface on GitHub as a reference.

### Avoiding Renders

Media state can be directly accessed on the `<Media>` component if you'd like to avoid unnecessary
re-renders:

```tsx {% highlight="9" %}
import { Media } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { type MediaElement } from 'vidstack';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);

  useEffect(() => {
    const { paused } = media.current!.state;
  }, []);

  return <Media ref={media}>{/* ... */}</Media>;
}
```

Or, if inside a child of `<MediaProvider>`:

```tsx {% highlight="8" %}
import { useMediaElement } from '@vidstack/react';

// This component is a child of `<MediaProvider>`
function MediaPlayerUI() {
  const media = useMediaElement();
  useEffect(() => {
    if (!media) return;
    const { paused } = media.state;
  }, [media]);
}
```

## Updating

The media remote hook provides a simple facade for dispatching
[media request events](/docs/player/core-concepts/events#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```tsx {% highlight="5,8" %}
import { useMediaRemote } from '@vidstack/react';

// This component is a child of `<MediaProvider>`
function MediaPlayerUI() {
  const remote = useMediaRemote();

  function requestPlay() {
    remote.play();
  }

  // ...
}
```

### Event Triggers

[Event triggers](/docs/player/core-concepts/events#event-triggers) enable connecting media events
back to their origin event. This can be useful when trying to understand how a media event was
triggered, or when analyzing data such as the time difference between the request and when the media
was actually played.

```tsx {% highlight="7,14,16" %}
import { useMediaRemote } from '@vidstack/react';
import { useRef, type PointerEvent } from 'react';

function PlayButton() {
  const button = useRef<HTMLButtonElement>(null);

  const remote = useMediaRemote(button);

  function onPointerUp({ nativeEvent }: PointerEvent) {
    if (paused) {
      // - We are providing the "trigger" here.
      // - Trigger events allow us to trace events back to their origin.
      // - The media play event will have this pointer event in its chain.
      remote.play(nativeEvent);
    } else {
      remote.pause(nativeEvent);
    }
  }

  return (
    <button ref={button} onPointerUp={onPointerUp}>
      {/* ... */}
    </button>
  );
}
```

## Media Element

The following hook provides you with a reference to the nearest parent `MediaElement` (i.e.,
`<vds-media>`).

```tsx
import { useMediaElement } from '@vidstack/react';
import { useEffect } from 'react';

// This component is a child of `<MediaProvider>`
function MediaPlayerUI() {
  const media = useMediaElement();

  useEffect(() => {
    if (!media) return;
    // ...
  }, [media]);
}
```

{% no %}
Avoid calling methods directly on the media element:
{% /no %}

```tsx
import { useMediaElement } from '@vidstack/react';
import { useEffect } from 'react';

// This component is a child of `<MediaProvider>`
function MediaPlayerUI() {
  const media = useMediaElement();

  useEffect(() => {
    if (!media) return;
    // BAD: try to avoid doing this as you will lose valuable information
    // provided by event chains. Prefer the request/response model by using
    // the `useMediaRemote` hook.
    media.play();
  }, [media]);
}
```

## Media Provider

The following hook provides you with a reference to the nearest parent `MediaProviderElement` (e.g.,
`<vds-video>` or `<vds-hls-video>`).

```tsx
import { useMediaProviderElement } from '@vidstack/react';
import { useEffect } from 'react';
import { isHLSVideoElement } from 'vidstack';

// This component is a child of `<MediaProvider>`
function MediaPlayerUI() {
  const provider = useMediaProviderElement();

  useEffect(() => {
    if (isHLSVideoElement(provider)) {
      provider.addEventListener(
        'instance',
        (event) => {
          const engine = event.detail; // hls.js instance
        },
        { once: true },
      );
    }
  }, [provider]);
}
```
