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
Each element contains documentation on how to register it, how to use it, and an API reference.

You can register an element by importing it from the `@vidstack/player/define/*` path. When the
import is loaded it will safely register the element and any dependencies in
the [custom elements registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).
By 'safely' we mean that the register import paths are safe to use on both client-side and server-side.

Firstly, we register the elements we're using by grabbing the import code snippet from the component's
respective docs, or letting autocomplete help us out in our IDE:

```js {% copyHighlight=true highlight="4" %}
// Discover elements by typing this in your IDE.
import '@vidstack/player/define/';
import '@vidstack/player/define/vds-media.js';
import '@vidstack/player/define/vds-video.js';
```

{% callout type="info" %}
The `.js` extension in the import path is required for [Node exports](https://nodejs.org/api/packages.html#package-entry-points)
to work. This feature is used so your bundler can import the development or production distribution
automatically based on your Node environment setting (`NODE_ENV`).
{% /callout %}

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

### Define All

{% callout type="danger" %}
The `.js` extension in the import path is required for [Node exports](https://nodejs.org/api/packages.html#package-entry-points)
We _do not_ recommend importing everything. By importing `dangerously-all.js`, you're importing
all providers and elements in the library which will bloat your final application bundle size.
{% /callout %}

We generally recommend only registering what you'll be using. Each element's respective docs
contains a register code snippet you can copy and paste as needed. However, you can register
all elements if you're testing things out, or in a playground environment like so:

```js {% copy=true %}
import '@vidstack/player/define/dangerously-all.js';
```

You can also register only all UI elements like so (safer):

```js {% copy=true %}
import '@vidstack/player/define/dangerously-all-ui.js';
```

## Media Store

The `<vds-media>` element has a media store that keeps track of the running state of the player.
A store in the player is a simple pub/sub mechanism for creating reactive state, updating the value,
and subscribing to state changes. The implementation was derived from
[Svelte Stores](https://svelte.dev/docs#run-time-svelte-store).

The store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

{% no %}
Tracking media state via events:
{% /no %}

```js
const provider = document.querySelector('vds-video');

let paused = true;

provider.addEventListener('vds-pause', () => {
  paused = true;
});

provider.addEventListener('vds-play', () => {
  paused = false;
});
```

{% yes %}
Tracking media state via store subscription:
{% /yes %}

```js
const media = document.querySelector('vds-media');

const unsubscribe = media.store.paused.subscribe(($paused) => {
  console.log('Is Paused:', $paused);
});

unsubscribe();
```

## Typescript

We've written the player library with TypeScript, and we distribute all types with the
`@vidstack/player` package. VSCode will detect them by default, but global event types need to
be registered separately; otherwise, the following will happen:

```js
// The event type will default to `Event` instead of `MediaPlayEvent`.
provider.addEventListener('vds-play', (event) => {});
```

Events are a core part of working with the player library, so we highly recommend you resolve
this by adding the following to your TypeScript configuration file:

```json {% title="tsconfig.json" copyHighlight=true highlight="3" %}
{
  "compilerOptions": {
    "types": ["@vidstack/player/globals"]
  }
}
```

### Element Types

You can import element types directly from the package if you're using TypeScript like so:

```ts {% copy=true %}
import { type PlayButtonElement, type VideoElement } from '@vidstack/player';

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
  type MediaTimeUpdateEvent,
} from '@vidstack/player';
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
  "html.customData": ["./node_modules/@vidstack/player/vscode.html-data.json"]
}
```

{% /step %}

{% /steps %}

## Lit Helpers

The following sections cover helper functions you can use when working with [Lit](https://lit.dev)
elements.

### `mediaStoreSubscription`

The `mediaStoreSubscription` enables you to subscribe directly to specific media state changes
like so:

```ts
import { LitElement, mediaStoreSubscription } from '@vidstack/player';

class MyElement extends LitElement {
  constructor() {
    super();
    mediaStoreSubscription(this, 'paused', ($paused) => {
      // ...
    });
  }
}
```

Your IDE should provide helpful suggestions and docs on the store properties that are available. You
can also use the [`MediaContext`](https://github.com/vidstack/vidstack/blob/main/packages/player/src/media/MediaContext.ts)
interface on GitHub as a reference.

### `MediaRemoteControl`

The `MediaRemoteControl` class provides a simple facade for dispatching
[media request events](/docs/player/getting-started/events/#request-events). This can be used to
request media playback to play/pause, change the current volume level, seek to a different time
position, and other actions that change media state.

```ts
import { html, LitElement } from 'lit';
import { MediaRemoteControl } from '@vidstack/player';

class PlayButtonElement extends LitElement {
  protected _remote = new MediaRemoteControl(this);

  protected _makePlayRequest(trigger: Event) {
      // - We are providing the "trigger" here.
      // - Trigger events allow us to trace events back to their origin.
      // - The media play event will have this pointer event in its chain.
    this._remote.play(trigger);
  }

  function render() {
    return html`
      <button @pointerup=${this._makePlayRequest}>
        <!-- ... -->
      </button>
    `
  }
}
```

Your IDE should provide helpful suggestions and docs on the available methods. You can also use
the [`MediaRemoteControl`](https://github.com/vidstack/vidstack/blob/main/packages/player/src/media/interact/MediaRemoteControl.ts)
source on GitHub as a reference.
