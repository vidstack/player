---
title: Components
description: Introduction to using Vidstack Player components with HTML.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of working with the custom elements in Vidstack Player.

## Elements

We provide a variety of components out of the box that help enhance the player.

Some are concerned with layout such as `<vds-media>` and `<vds-aspect-ratio>`, some provide visual
controls such as `<vds-play-button>` or `<vds-time-slider>`, and others manage player instances.

We recommend either searching (`cmd + k`) for what you're looking for or browsing the sidebar.
Each element contains documentation on how to use/style it, and an API reference.

You can register _all_ elements like so:

```js
import { defineCustomElements } from 'vidstack/elements';

defineCustomElements();
```

Or, individually like so:

```js {% copy=true %}
// The `.js` extension is required.
import 'vidstack/define/vds-media.js';
import 'vidstack/define/vds-video.js';
```

Next, we can use the defined elements and the browser will "upgrade" them once the script above
has loaded and run.

```html
<!-- Browser will upgrade custom elements once they're defined. -->
<vds-media>
  <vds-video>
    <!-- This will render immediately because it's in the light DOM. -->
    <video src="..."></video>
  </vds-video>
  <!-- ... -->
</vds-media>
```

## Attach Hook

Vidstack elements go through a two-step process in which they're defined then attached before
they're finally ready to be interacted with:

```ts
const media = document.querySelector('vds-media');

// 1. Like any other custom element it needs to be defined:
customElements.whenDefined('vds-media', () => {
  // `vds-media` is now defined.

  // 2. Wait for the custom element instance to be attached.
  media.onAttach(() => {
    // Safe to now interact with instance props/methods.
    media.play();
  });
});
```

You can await the `defineCustomElements` call to ensure _all_ elements are defined:

```ts
import { defineCustomElements } from 'vidstack/elements';

async function onLoad() {
  await defineCustomElements();
  const media = document.querySelector('vds-media');
  media.onAttach(() => {
    // ...
  });
}

document.addEventListener('load', onLoad, { once: true });
```

## Keep Alive

By default, Vidstack elements will be destroyed when they've disconnected from the DOM and have not
re-connected after an animation frame tick. You can specify that an element should be kept
alive like so:

```html
<!-- Keep this element and all children alive until manually destroyed. -->
<vds-media keep-alive>
  <!-- This will be kept alive as well. -->
  <vds-video></vds-video>
  <!-- ... -->
</vds-media>
```

Now, you can manually destroy the element instance and all children by calling the `destroy()`
method on the element that you specified to keep alive like so:

```ts
const media = document.querySelector('vds-media');
// This will destroy the media element instance and all child instances.
media.destroy();
```

{% callout type="info" %}
You don't need to worry about keeping elements alive if you're using a framework integration such
as React. Elements will be disposed of correctly based on the framework lifecycle.
{% /callout %}

## Attributes

Most component props can be set directly in HTML via attributes like so:

```html
<!-- The following will set the `type` and `format` props. -->
<vds-time type="current" format="time"></vds-time>
```

All attributes in Vidstack are the kebab-case variant of the property name. For example, the
`fooBar` property would be the attribute `foo-bar`.

## Events

Events can be listened to by obtaining a reference to the element instance and attaching an
event listener like so:

```ts
const media = document.querySelector('vds-media');

media.addEventListener('play', function onPlay() {
  // ...
});
```

## Instance

Obtaining a reference to the element instance enables you to manipulate the custom element itself
and directly call properties/methods like so:

```ts
const media = document.querySelector('vds-media');

// Set a instance property:
media.muted = true;

// Call a instance method:
media.play();
```

## Element Types

All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `MediaElement`).

```ts {% copy=true %}
import { type MediaElement, type VideoElement } from 'vidstack';

let media: MediaElement;
```
