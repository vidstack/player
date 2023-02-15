---
title: State Management
description: How to read and update media state with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at the API available for reading and updating media state.

## Reading

You can retrieve a snapshot of the current media state like so:

```js
const player = document.querySelector('media-player');

player.onAttach(() => {
  const {
    paused,
    playing,
    waiting,
    currentTime,
    // ...
  } = player.state;
});
```

## Subscribing

The `<media-player>` element has a media store that keeps track of the running media state.
The store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```js
const player = document.querySelector('media-player');

let paused = true;

player.addEventListener('pause', () => {
  paused = true;
});

player.addEventListener('play', () => {
  paused = false;
});
```

{% yes %}
Tracking media state via store subscription:
{% /yes %}

```js
const player = document.querySelector('media-player');

player.onAttach(() => {
  // Any media state accessed will create a dependency.
  // The given callback will re-run as `paused` or `playing` state changes.
  const unsubscribe = player.subscribe(({ paused, playing }) => {
    console.log('Paused:', paused);
    console.log('Playing:', playing);
  });

  unsubscribe();
});
```

You can create individual subscriptions if needed like so:

```js
const player = document.querySelector('media-player');

player.onAttach(() => {
  const unsubPaused = player.subscribe(({ paused }) => {
    // ...
  });

  const unsubCurrentTime = player.subscribe(({ currentTime }) => {
    // ...
  });
});
```

## Updating

Media state updates can be requested directly on the player element like so:

```js
const player = document.querySelector('media-player');

player.onAttach(() => {
  // This is queued and called when media can be played.
  player.paused = false;
  // This is attempted immediately - will fail if media not ready.
  player.play();
});
```

👉 All player properties and methods can be found in the [Player API reference](/docs/player/components/layout/player/api).

### Media Remote

The `MediaRemoteControl` class provides a simple facade for dispatching
[media request events](/docs/player/core-concepts/events#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```ts
import { MediaRemoteControl } from 'vidstack';

// 1. Create the media remote control.
const remote = new MediaRemoteControl();

button.addEventListener('pointerup', (pointerEvent) => {
  // 2. Make a play request and pass the pointer event as the trigger.
  remote.play(pointerEvent);
});
```

You can set a target to dispatch events from if you're performing actions without trigger events
like so:

```ts
import { MediaRemoteControl } from 'vidstack';

// 1. Create the media remote control.
const remote = new MediaRemoteControl();

// 2. Set a target element to dispatch media requests from.
const button = document.querySelector('button');
remote.setTarget(button);

// 3. Dispatch request.
remote.togglePaused();
```

## Player Element

The `MediaRemoteControl` can attempt to find the nearest parent player element once a target has
been attached like so:

```ts
import { isHLSProvider, MediaRemoteControl } from 'vidstack';

// 1. Create the media remote control.
const remote = new MediaRemoteControl();

// 2. Set a target element to search from.
const button = document.querySelector('button');
remote.setTarget(button);

// 3. Find player element
const player = remote.getPlayer(); // `MediaPlayerElement | null`

player?.onAttach(() => {
  if (isHLSProvider(player.provider)) {
    // ...
  }
});
```
