---
description: Brief introduction to Vidstack Player.
---

# Player Foundation

In this section, we'll go through some of the basics of working with Vidstack Player.
The 'Core Concepts' section dives deeper into what we'll be covering here; this page only
contains a high-level overview.

## Elements

We provide a variety of elements out of the box that help enhance the player. Some provide visual
controls such as `vds-play-button` or `vds-time-slider`, and others manage one or many player
instances such as `vds-media-sync` or `vds-media-visibility`. We recommend either searching
(`cmd + k`) for what you're looking for or browsing the sidebar. Each element contains
documentation on how to register it, how to use it, and an API reference.

You can register an element by importing it from the `@vidstack/player/define/*` path. When the
import is loaded it will safely register the element and any dependencies in
the [custom elements registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).
By 'safely' we mean that the register function will check if it's being called server-side, or
if the element has already been registered to avoid throwing an error. In short, this means that the
import is safe to use on both client-side and server-side.

Firstly, we register the elements we're using by grabbing the import code snippet from the component's
respective docs, or letting autocomplete help us out in our IDE:

```js:copy-highlight{2}
// Discover elements by typing this in your IDE.
import '@vidstack/player/define/';
import '@vidstack/player/define/vds-video-player.js';
import '@vidstack/player/define/vds-play-button.js';
```

:::info
The `.js` extension in the import path is required for [Node exports](https://nodejs.org/api/packages.html#package-entry-points)
to work. This feature is used so your bundler can import the development or production distribution
automatically based on your Node environment setting (`NODE_ENV`).
:::

Next, we can use the defined elements, and the browser will "upgrade" them once the script
above has run. Progressive enhancement is one of the best parts of custom elements because they
can be used before they're defined!

```html
<!-- Browser will upgrade elements once the script above has run. -->
<vds-video-player>
  <vds-media-ui>
    <vds-play-button />
  </vds-media-ui>
</vds-video-player>
```

## Typescript

### Element Types

You can import element types directly from the package if you're using TypeScript like so:

```ts:copy
import {
	type VideoPlayerElement,
	type PlayButtonElement
} from '@vidstack/player';

let player: VideoPlayerElement;
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

## Media State

The player exposes a superset of the [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
API. Therefore, you can swap out a native provider (e.g., `<video>`) for a Vidstack implementation
(e.g., `<vds-video-player>`) and it'll just work :tada:

You can update media state by changing attribute or property values. Actions that require the
media to be ready are queued and applied right after the `vds-can-play` event is fired. Only the
last change is executed if it's applied more than once before media is ready for playback.
Therefore, we always recommend updating state through attributes or properties unless you
explicitly want to handle the result of some method.

:::tip
You might decide to call the `play()` method instead of using the `paused` property to be
notified of when an error is thrown to handle failure. The player already handles cases like
this and will fire a `vds-play-fail` event, and in the case of autoplay a `vds-autoplay-fail` event.
:::

### Attribute

```html
<!-- Paused. -->
<vds-video-player paused />
<!-- Still Paused. -->
<vds-video-player paused="false" />
<!-- Not Paused. -->
<vds-video-player />
```

### Property

```js
// Safely queued and executed after player is ready.
player.paused = false;
// Executed immediately regardless of player state (throws).
player.play();
```

## Media Events

:::tip
You can find a list of all events fired by the player in the API section of the respective
provider's documentation.
:::

The player fires a superset of `HTMLMediaElement` events. You can kebab-case and prefix any
[native media event type](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events)
with `vds-` to get the custom variant.

- `loadedmetadata` -> `vds-loaded-metadata`
- `canplay` -> `vds-can-play`
- `play` -> `vds-play`

The player still dispatches the original media event (e.g., `play`) for backwards compatibility. Prefer
the custom variant as it smooths out any issues, and contains rich information such as the
request event that triggered it, or the origin event that kicked it off.

### Request Events

Request events are fired when 'requesting' the player to update the provider's state. For example,
the `vds-play-request` event is a request to begin/resume playback, and as a consequence it'll
trigger a `play()` call. The provider should respond with a `vds-play` event to confirm the
request was satisfied.

```js
player.addEventListener('vds-play–request', () => {
  console.log('Play request was made.');
});

player.addEventListener('vds-play', (event) => {
  // Request events are attached to media events.
  const playRequestEvent = event.requestEvent;
  console.log('Play request was satisfied.');
});

playButton.dispatchEvent('vds-play-request', { bubbles: true });
```

Request events are fired by child elements of the player. For example, the
`<vds-play-button>` element will fire a `vds-play-request` and `vds-pause-request` based on it's
pressed state.

### Event Triggers

All events in the player keep a history of **trigger** events. They are stored as a
chain of events, where each event points to the event that came before it. The chain goes back
to the **origin event**, which is the event that started the chain.

```js
player.addEventListener('vds-play', (event) => {
  // Was this triggered by an actual person?
  const userPlayed = event.isOriginTrusted;
});

player.addEventListener('vds-playing', (event) => {
  // Is this resuming from buffering?
  if (event.triggerEvent?.type === 'vds-waiting') {
    // ...
  }
});
```

Here's an example chain (each <- represents a call to `triggerEvent`):

`vds-playing` <- `playing` (native) <- `vds-play` <- `play` (native) <- `vds-play-request`
<- `pointerdown` (origin event) <- `null`.

## Media Store

The player has a media store that keeps track of the running state of the player. A store in
the player is a simple pub/sub mechanism for creating reactive state, updating the value,
and subscribing to state changes. The implementation was derived
from [Svelte Stores](https://svelte.dev/docs#run-time-svelte-store).

The store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself. You can access it off
the `store` property on the player.

:::no
Tracking media state via events:
:::

```js
let paused = true;

player.addEventListener('vds-pause', () => {
  paused = true;
});

player.addEventListener('vds-play', () => {
  paused = false;
});
```

:::yes
Tracking media state via store subscription:
:::

```js
const unsubscribe = player.store.paused.subscribe(($paused) => {
  console.log('Is Paused:', $paused);
});

unsubscribe();
```
