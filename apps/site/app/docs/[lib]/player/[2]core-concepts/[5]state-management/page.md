---
title: State Management
description: How to read and update media state with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at the API available for reading and updating media state.

## Media State

You can retrieve a snapshot of the current media state like so:

```js
const media = document.querySelector('vds-media');

const {
  paused,
  playing,
  waiting,
  currentTime,
  // ...
} = media.state;
```

## Media Store

The `<vds-media>` element has a media store that keeps track of the running state of the player.
The store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```js
const media = document.querySelector('vds-media');

let paused = true;

media.addEventListener('pause', () => {
  paused = true;
});

media.addEventListener('play', () => {
  paused = false;
});
```

{% yes %}
Tracking media state via store subscription:
{% /yes %}

```js
const media = document.querySelector('vds-media');

const { paused } = media.store;

// The given function will re-run as the `paused` state changes.
const unsubscribe = paused.subscribe((paused) => {
  console.log('Paused:', paused);
});

unsubscribe();
```

## Media Remote

The `MediaRemoteControl` class provides a simple facade for dispatching
[media request events](/docs/player/core-concepts/events#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```ts
import { MediaRemoteControl } from 'vidstack';

// 1. Create the media remote control.
const remote = new MediaRemoteControl();

// 2. Set a target element to dispatch media requests from.
const button = document.createElement('button');
remote.setTarget(button);

button.addEventListener('pointerup', (pointerEvent) => {
  // 3. Make a play request and pass the pointer event as the trigger.
  remote.play(pointerEvent);
});
```
