---
title: Foundation
description: Introduction to using Vidstack Player with HTML.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of working with the custom elements in Vidstack Player.

## Elements

We provide a variety of elements out of the box that help enhance the player. Some provide visual
controls such as `<vds-play-button>` or `<vds-time-slider>`, and others manage one or many player
instances such as `<vds-media-sync>` or `<vds-media-visibility>`.

We recommend either searching (`cmd + k`) for what you're looking for or browsing the sidebar.
Each element contains documentation on how to use/style it, and an API reference.

## Media Store

The `<vds-media>` element has a media store that keeps track of the running state of the player.
A store in the player is a simple pub/sub mechanism for creating reactive state, updating the value,
and subscribing to state changes.

The store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```js
const provider = document.querySelector('vds-video');

let paused = true;

provider.addEventListener('pause', () => {
  paused = true;
});

provider.addEventListener('play', () => {
  paused = false;
});
```

{% yes %}
Tracking media state via store subscription:
{% /yes %}

```js
const media = document.querySelector('vds-media');

// The given function will re-run as the `paused` state changes.
const unsubscribe = media.store.paused((paused) => {
  console.log('Paused:', paused);
});

unsubscribe();
```

## Media Remote

The `MediaRemoteControl` class provides a simple facade for dispatching
[media request events](/docs/player/getting-started/events#request-events). This can be used to
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

## Typescript

We've written the player library with TypeScript, and we distribute all types with the
`vidstack` package. VSCode will detect them by default, but global event types need to
be registered separately; otherwise, the following will happen:

```js
// The event type will default to `Event` instead of `MediaPlayEvent`.
provider.addEventListener('vds-play', (event) => {
  event; // ❌ wrong type
});
```

Events are a core part of working with the player library, so we highly recommend you resolve
this by adding the following to your TypeScript configuration file:

```json {% title="tsconfig.json" copyHighlight=true highlight="3" %}
{
  "compilerOptions": {
    "types": ["vidstack/globals"]
  }
}
```

### Element Types

You can import element types directly from the package if you're using TypeScript like so:

```ts {% copy=true %}
import { type PlayButtonElement, type VideoElement } from 'vidstack';

let provider: VideoElement;
```

{% callout type="tip" %}
All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `AudioElement`).
{% /callout %}

### Event Types

Event types can be imported directly from the package if you're using TypeScript like so:

```ts {% copy=true %}
import {
  type MediaCanPlayEvent,
  type MediaPlayEvent,
  type MediaStartedEvent,
  type MediaTimeUpdateEvent,
} from 'vidstack';
```

{% callout type="tip" %}
All event types are named using _PascalCase_ and _suffixed_ with the word `Event`
(e.g., `SliderDragStartEvent`). Furthermore, media events are all _prefixed_ with the word `Media` as
seen in the example above.
{% /callout %}

## VSCode

VSCode provides support for extending the known HTML entities through
[VSCode Custom Data](https://github.com/microsoft/vscode-custom-data). Once set up, it enables
autocomplete suggestions for custom player elements and on-hover information such as
documentation and type data.

![Before and after screenshot difference of using the VSCode custom data extension.]($lib/img/vscode-autocomplete.png)

{% steps %}

{% step %}

### Create Settings File {% slot="title" %}

{% slot name="description" %}
Create a VSCode settings JSON file at the root of your project directory.
{% /slot %}

```bash {% copy=true %}
touch .vscode/settings.json
```

{% /step %}

{% step %}

### Add Custom HTML Data {% slot="title" %}

{% slot name="description" %}
Add the custom HTML data file path to `html.customData` inside the newly created settings file.
{% /slot %}

```json {% title=".vscode/setting.json" copy=true %}
{
  "html.customData": ["./node_modules/vidstack/vscode.html-data.json"]
}
```

{% /step %}

{% /steps %}
