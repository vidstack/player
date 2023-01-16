---
title: State Management
description: How to read and update media state with our React hooks.
---

# {% $frontmatter.title %}

In this section, we'll look at the React hooks available for reading and updating media state.

## `useMediaState`

The media state hook enables you to subscribe directly to specific media state changes, rather
than listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```tsx
import { Media, Video } from '@vidstack/react';
import { useState } from 'react';

function MediaPlayer() {
  const [paused, setPaused] = useState(true);

  return (
    <Media>
      <Video onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
        {/* ... */}
      </Video>
    </Media>
  );
}
```

{% yes %}
Tracking media state via hook:
{% /yes %}

```tsx
import { Media, useMediaState } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaElement } from 'vidstack';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);

  // - This is a live subscription to the paused store.
  // - All stores are lazily subscribed to on prop access.
  const { paused } = useMediaState(media);

  return <Media ref={media}>{/* ... */}</Media>;
}
```

```tsx
function MediaPlayer() {
  return (
    <Media>
      <MediaChild />
    </Media>
  );
}

function MediaChild() {
  // No ref required if used inside `<Media>` child component.
  const { paused } = useMediaState();
}
```

Your IDE should provide helpful suggestions and docs on the context properties that are available. You
can also use the [`MediaState`](https://github.com/vidstack/vidstack/blob/main/packages/vidstack/src/player/media/state.ts)
interface on GitHub as a reference.

## `useMediaRemote`

The media remote hook provides a simple facade for dispatching
[media request events](/docs/player/core-concepts/events#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```tsx
import { useMediaRemote, useMediaState } from '@vidstack/react';
import React from 'react';

function PlayButton() {
  const remote = useMediaRemote();
  const { paused } = useMediaState();

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

## `useMediaElement`

The following hook provides you with a reference to the nearest parent `MediaElement`. You can
generally avoid using this hook unless you need direct access to some DOM API on the media element.

```tsx
import { useMediaElement } from '@vidstack/react';

function MediaChild() {
  const media = useMediaElement();
  // ...
}
```

{% no %}
Avoid calling methods directly on the provider element:
{% /no %}

```tsx
import { useMediaElement } from '@vidstack/react';
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
