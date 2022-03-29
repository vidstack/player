---
description: Brief introduction to Vidstack Player.
---

# Player Foundation

In this section, we'll go through some of the basics of working with the library.
The 'Core Concepts' section dives deeper into what we'll be covering here; this page only
contains a high-level overview.

## Player Structure

The player is made up of three core parts:

```html
<!-- 1. The media element (aka media controller). -->
<vds-media>
  <!-- 2. The media provider. -->
  <vds-video>
    <!-- ... -->
  </vds-video>

  <!-- 3. The media user interface. -->
  <div class="media-controls">
    <vds-play-button></vds-play-button>
    <!-- ... -->
  </div>
</vds-media>
```

1. The `<vds-media>` element contains all media elements. It's main jobs are:
   - Providing the [media store](#media-store) context down to all child consumers (i.e., UI elements)
     so they can subscribe to media state changes.
   - Listening for [media request events](#request-events) so it can try and satisfy them (e.g.,
     accepting a play request and satisfying it by calling play on the media provider).
   - Exposing media state through HTML attributes and CSS properties for [styling](./styling.md) purposes.
2. A media provider is an adapter that wraps an existing provider such as
   the native HTMLMediaElement (i.e., `<video>`), or embedded media (i.e., `<iframe>`). It's main
   jobs are:
   - Handling the media loading process.
   - Providing a minimal and consistent set of properties for controlling the provider (e.g.,
     `paused` property for controlling playback).
   - Providing a consistent events interface by firing `vds-*` specific custom media events (e.g.,
     `vds-play`).
3. The media user interface (UI) is a collection of simple DOM elements and Vidstack
   components that are shown to the user for controlling the media. Vidstack components use a
   media store context to get the current state of media and fire [request events](#request-events)
   to trigger a state change.

## Elements

We provide a variety of elements out of the box that help enhance the player. Some provide visual
controls such as `<vds-play-button>` or `<vds-time-slider>`, and others manage one or many player
instances such as `<vds-media-sync>` or `<vds-media-visibility>`.

We recommend either searching (`cmd + k`) for what you're looking for or browsing the sidebar.
Each element contains documentation on how to register it, how to use it, and an API reference.

You can register an element by importing it from the `@vidstack/player/define/*` path. When the
import is loaded it will safely register the element and any dependencies in
the [custom elements registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).
By 'safely' we mean that the register import paths are safe to use on both client-side and server-side.

Firstly, we register the elements we're using by grabbing the import code snippet from the component's
respective docs, or letting autocomplete help us out in our IDE:

```js:copy-highlight{4}
import '@vidstack/player/define/vds-media.js';
import '@vidstack/player/define/vds-video.js';
// Discover elements by typing this in your IDE.
import '@vidstack/player/define/';
```

:::info
The `.js` extension in the import path is required for [Node exports](https://nodejs.org/api/packages.html#package-entry-points)
to work. This feature is used so your bundler can import the development or production distribution
automatically based on your Node environment setting (`NODE_ENV`).
:::

Next, we can use the defined elements and the browser will "upgrade" them once the script
above has loaded and run.

```html
<!-- Browser will upgrade custom elements once they're defined. -->
<vds-media>
  <vds-video>
    <!-- This will immediately render because it's in the light DOM. -->
    <video src="..."></video>
  </vds-video>
  <!-- ... -->
</vds-media>
```

## Media Events

The media provider fires a superset of `HTMLMediaElement` events. You can kebab-case and prefix any
[native media event type](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events)
with `vds-` to get the custom variant.

- `loadedmetadata` -> `vds-loaded-metadata`
- `canplay` -> `vds-can-play`
- `play` -> `vds-play`

Prefer our events as they smooth out any unexpected behaviour across browsers, attach additional
metadata to the event `detail`, and contain rich information such as the [request event](#request-events)
that triggered it or the origin event that kicked it off.

```js
const provider = document.createElement('vds-video');

provider.addEventListener('vds-loaded-metadata', (event) => {
  // Original media event (`loadedmetadata`) is still available.
  const originalMediaEvent = event.triggerEvent;

  // Event detail contains goodies.
  const { currentSrc, duration, poster, mediaType } = event.detail;
});
```

:::tip
You can find a list of all events fired by the provider in the API section of the respective
provider's documentation.
:::

### Request Events

Request events are fired when 'requesting' the controller to update the provider's state. For example,
the `vds-play-request` event is a request to begin/resume playback, and as a consequence it'll
trigger a `play()` call. The provider should respond with a `vds-play` event to confirm the
request was satisfied.

```js
const media = document.createElement('vds-media');
const provider = document.createElement('vds-video');

media.addEventListener('vds-play–request', () => {
  console.log('Play request was made.');
});

provider.addEventListener('vds-play', (event) => {
  // Request events are attached to media events.
  const playRequestEvent = event.requestEvent;
  console.log('Play request was satisfied.');
});

playButton.dispatchEvent('vds-play-request', { bubbles: true });
```

### Event Triggers

All events in the library keep a history of **trigger** events. They are stored as a
chain of events, where each event points to the event that came before it. The chain goes back
to the **origin event**, which is the event that started the chain.

```js
import { hasTriggerEvent } from '@vidstack/player';

const provider = document.createElement('vds-video');

provider.addEventListener('vds-play', (event) => {
  // Was this triggered by an actual person?
  const userPlayed = event.isOriginTrusted;
});

provider.addEventListener('vds-playing', (event) => {
  // Is this resuming from buffering?
  if (hasTriggerEvent(event, 'vds-waiting')) {
    // ...
  }
});
```

Here's an example chain (each <- represents a call to `triggerEvent`):

`vds-playing` <- `playing` (native) <- `vds-play` <- `play` (native) <- `vds-play-request`
<- `pointerdown` (origin event) <- `null`.

## Media Store

The `<vds-media>` element has a media store that keeps track of the running state of the player.
A store in the player is a simple pub/sub mechanism for creating reactive state, updating the value,
and subscribing to state changes. The implementation was derived from
[Svelte Stores](https://svelte.dev/docs#run-time-svelte-store).

The store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

:::no
Tracking media state via events:
:::

```js
const provider = document.createElement('vds-video');

let paused = true;

provider.addEventListener('vds-pause', () => {
  paused = true;
});

provider.addEventListener('vds-play', () => {
  paused = false;
});
```

:::yes
Tracking media state via store subscription:
:::

```js
const media = document.createElement('vds-media');

const unsubscribe = media.store.paused.subscribe(($paused) => {
  console.log('Is Paused:', $paused);
});

unsubscribe();
```

## Typescript

### Element Types

You can import element types directly from the package if you're using TypeScript like so:

```ts:copy
import {
	type VideoElement,
	type PlayButtonElement
} from '@vidstack/player';

let provider: VideoElement;
```

:::tip
All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `AudioElement`).
:::

### Event Types

Event types can be imported directly from the package if you're using TypeScript like so:

```ts:copy
import {
	type MediaPlayEvent,
	type MediaCanPlayEvent,
	type MediaTimeUpdateEvent,
} from '@vidstack/player';
```

:::tip
All event types are named using _PascalCase_ and _suffixed_ with the word `Event`
(e.g., `SliderDragStartEvent`). Furthermore, media events are all _prefixed_ with the word `Media` as
seen in the example above.
:::
