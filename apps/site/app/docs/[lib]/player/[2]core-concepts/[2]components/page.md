---
title: Components
description: Introduction to using Vidstack Player components with HTML.
---

# {% $frontmatter.title %}

In this section, we'll go through the basics of working with the custom elements in Vidstack Player.

## Elements

We provide a variety of components out of the box that help enhance the player.

Some are concerned with layout such as `<vds-aspect-ratio>` and `<vds-controls>`, some provide visual
controls such as `<vds-play-button>` or `<vds-time-slider>`, and others manage player instances.

We recommend either searching (`cmd + k`) for what you're looking for or browsing the sidebar.
Each element contains documentation on how to use/style it, and an API reference.

You can register _all_ elements like so:

```js
import { defineCustomElements } from 'vidstack/elements';

defineCustomElements();
```

Or, individually like so:

```js
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
const provider = document.querySelector('vds-video');

provider.addEventListener('play', function onPlay() {
  // ...
});
```

## Instance

Obtaining a reference to the element instance enables you to manipulate the custom element itself
and directly call properties/methods like so:

```ts
const provider = document.querySelector('vds-video');

// Set a instance property:
provider.muted = true;

// Call a instance method:
provider.play();
```

## Element Types

All element types are classes named using _PascalCase_ and _suffixed_ with the word `Element`
(e.g., `AudioElement`).

```ts {% copy=true %}
import { type PlayButtonElement, type VideoElement } from 'vidstack';

let provider: VideoElement;
```
