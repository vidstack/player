---
title: Release (March 2022)
---

The March 2022 release includes major changes and improvements to the player Beta as we progress
towards 1.0.

## Installation Changes

In preparation for our 1.0 release we've moved over to the `next` NPM tag:

```bash:copy
npm i @vidstack/player@next
```

The install code snippets and CDN URLs have been updated in the docs. When we finally release
1.0 we'll switch from next to latest.

## New Player Architecture

We identified some core issues with the library which has lead us to re-write a lot of the
player internals.

:::no
Previously, the video player markup looked like this:
:::

```html
<vds-video-player src="...">
  <vds-media-ui slot="ui">
    <!-- ... -->
  </vds-media-ui>
</vds-video-player>
```

The following issues arise from designing the player this way:

- The underlying media element API needs to be duplicated on the `<vds-video-player>` element since
  you can't access the `<video>` element.
- The media UI exists inside the player, so it becomes difficult to design an unconventional UI
  outside of the media content (e.g., side chat panel).
- If JavaScript is disabled by a client or crawler (i.e., search engine), the video element
  is inaccessible because it lives inside the `<vds-video-player>` shadow DOM. This means
  the player is not SSR/SEO friendly out of the box.
- Providing players meant we needed to differentiate them from providers, which was difficult since
  the only thing a "player" provided was the `ui` slot. It also confused the internal architecture
  because we had to duplicate some code and documentation between them.
- Switching from one provider to another (e.g., Video -> Vimeo) means the entire player (including
  UI) needs to be re-rendered.
- The `<vds-video-player>` has an unidiomatic markup structure that doesn't mirror how you work
  with the `<video>` element. Passing in both media resources (i.e., `<source>` element) and media
  UI into a custom player element is not something users are familiar with in HTML.
- A "player" has a much larger scope of responsibilities than simply a media UI framework.
  It needs to take on the responsibility of providing advanced media features since the
  underlying `<video>` element can't be easily extended. The community has already done this
  work (e.g., `video.js`); we don't need to do it again.

:::yes
Now, the new video player markup looks like this:
:::

```html
<vds-media>
  <vds-video>
    <video src="..." controls preload="none"></video>
  </vds-video>
</vds-media>
```

With some comments:

```html
<!-- The media element (aka controller). -->
<vds-media>
  <!-- Media UI here (optional). -->

  <!-- Media provider can be nested if needed (e.g., inside `<div>`). -->
  <vds-video>
    <!-- We now have access to the familiar `<video>` element. -->
    <video src="..." controls preload="none"></video>
  </vds-video>

  <!-- Media UI here (optional). -->
  <div class="media-controls">
    <!-- ... -->
  </div>
</vds-media>
```

Why is this awesome?

- We don't need to duplicate the `<video>` element API because you can access it now.
- The media UI can exist anywhere around or inside the media content as desired.
- The video element will still render and display a set of controls even if the custom elements
  are never registered. This is great for clients without JavaScript and search engines indexing
  your site.
- We avoid handling the complexities of "patching" media state/events by connecting to the video
  element late by simply setting `preload="none"`, which enables us to take full control of the
  loading process.
- The scope of a provider is now well-defined. It's simply an adapter that progressively
  enhances the underlying media element once it's registered.
- The provider can be dynamically swapped out without re-rendering the UI.
- Users can use the familiar `<video>` element and simply wrap it with Vidstack elements to enhance
  it.
- Vidstack Player is mostly a UI framework now, so it can be used with any existing player in the
  wild that also enhances the native `<video>` element (e.g., Plyr or Video.js). You won't need
  to use them unless your circumstances require so. For example, you'd like to migrate to Vidstack
  slowly, or in the future you only want to use Vidstack for analytics. This is untested so
  let us know if you try it!
- Best practices by default. We no longer need to write documentation for how to handle cases like
  SEO/SSR separately, it works out of the box.

## Provider API

You might be wondering how you'll interact with the provider programmatically. The goal of Vidstack
is that you won't need to because there'll be an element you can drop in to handle most cases.

However, you can still use the native media element API if needed. Also, there's still a minimal
set of properties on the provider (e.g.,`<vds-video>`) for updating media state. So far, this includes
`paused`, `currentTime`, `muted`, and `volume`. The properties on our providers remain the same
regardless of which provider you use, and they are safely queued and only applied after media is
ready for playback.

Furthermore, we'll provide the `useMediaStore` hook and other helper functions for JS libraries
like React, Svelte, Lit, and Vue. The hook will provide a simple two-way binding for reading and
writing media state. Coming in the next release!

## Fresh Documentation

All the player documentation has been updated to the new player architecture :tada:

## Improved SSR Support

Combined with the [new architecture](#new-player-architecture) and previous work that
was completed, this library is completely SSR-friendly out of the box!

## Loading Improvements

We've implemented better defaults for preloading and lazy loading media. You don't need to
add specific attributes anymore, it'll just work!

### Custom Strategy

We've also added a new loading strategy called `custom`:

```html
<vds-video loading="custom">
  <!-- ... -->
</vds-video>
```

When present, you can manually load media at the right time like so:

```js
const provider = document.querySelector('vds-video');

// Call this method when media should begin loading.
provider.startLoadingMedia();
```

## Simpler Attributes and CSS Properties

We've simplified attribute and CSS property names in the library.

- We dropped the `media` prefix on media attributes (e.g., `media-paused` -> `paused`).
- We dropped the `media` prefix on CSS properties (e.g., `--vds-media-current-time` -> `--vds-current-time`).
- We dropped the `slider` prefix on CSS properties (e.g., `--vds-slider-fill-rate` -> `--vds-fill-rate`).

:::no
Previously:
:::

```html
<!-- 1. Media UI -->
<vds-media-ui
  media-paused
  media-waiting
  media-seeking
  ...
  style="--vds-media-current-time: 500;..."
></vds-media-ui>

<!-- 2. Slider -->
<vds-slider dragging style="--vds-slider-fill-rate: 500;..."></vds-slider>
```

:::yes
Now:
:::

```html
<!-- 1. Media -->
<vds-media paused waiting seeking ... style="--vds-current-time: 500;..."></vds-media>

<!-- 2. Slider -->
<vds-slider dragging style="--vds-fill-rate: 500;..."></vds-slider>
```

```css
/* Example CSS */
vds-media[paused] .media-controls {
  /* ... */
}
```

## User Idle Attribute

We've renamed `media-idle` to `user-idle`. This indicates when a user is not active during
media playback.

```css
/* Hide controls if user is idle, or media is not ready for playback. */
vds-media[user-idle] .media-controls,
vds-media:not([can-play]) .media-controls {
  opacity: 0;
}
```

## Late Discovery

Previously, elements would fire a discovery event so a parent element could find them. For example,
`<vds-video>` would fire a `vds-media-provider-connect` event, which the `<vds-media>` element
would listen for to "discover" it.

The problem is when you have elements in the light DOM, they can register before their parent based
on the wrong import order, or simply because a chunk was loaded first by the browser:

```js
// We're "accidentally" registering `<vds-video>` first.
import '@vidstack/player/define/vds-video.js';
// This will register after `<vds-video>`.
import '@vidstack/player/define/vds-media.js';
```

```html
<!-- Connected after `<vds-video>` so it will miss discovery event. -->
<vds-media>
  <!-- This will connect before `<vds-media>`. -->
  <vds-video></vds-video>
</vds-media>
```

This was true for other elements in the library, which needed to find each other. We've added
support for late discovery to resolve this. The fixed involved allowing elements to be registered
as a "discoverable." In doing so, they get cached when they connect to the DOM. When a parent
element first connects (aka "discoverer") they'll check the cache. If there's no match, they'll
continue to listen for the discovery event and wait for the child to connect as usual.

**TLDR; You can now import and register elements in any order and they'll still find each other!**

## Context Adoption

A context is a simple mechanism for easily passing state down a DOM tree. You have a provider
who "provides" a value, and consumer who "consumes" a value. This is a primitive for easily
sharing state between two elements who have no direct relationship.

For example, `<vds-play-button>` needs access to the media store, which is hosted on `<vds-media>`
so it can subscribe to the `paused` state. It doesn't need to know who provides such a value,
other than trusting another element will adhere to the provider side of the context contract.

Like the discovery issue mentioned above, a context consumer could connect before a
provider, which means it won't retrieve the state it needed to. We fixed this with an adoption
pool. If a context consumer doesn't register with a provider, it'll go into an adoption pool. When a
provider connects to the DOM, it can check the pool and adopt consumers who belong to it.

**TLDR; A context consumer will always connect to a provider, so elements will always be eventually
consistent with respect to media state.**

## Simpler HLS Detection

Previously, there was some convoluted logic for detecting media source changes and checking if it's
a HLS stream. We've simplified this by simply listening for an `abort` media event, and seeing
if the HLS provider can support streaming any of the current media sources. If it can,
we don't fire a `vds-abort` event and handle loading the stream.

## Ordered Request Queue

The `RequestQueue` in the library is used to queue actions to be invoked at a later time. For
example, we don't apply paused changes until media is ready for playback. Previously, the queue was
executed in a random order, which would mean actions weren't applied as they were provided. The
queue is now synchronous and flushes in the order it was given, so it's a more faithful "replay".

## Media Sync Promotion

The `<vds-media-sync>` element is no longer experimental. We also changed the `shared-volume`
attribute name to `sync-volume`. We'll be adding sync support for other media state like
`currentTime` soon.

## Coming Next

The foundation now seems strong :muscle: It's time to continue where we left off! Next steps
include:

- Build the `useMediaStore` hook for React, Svelte, and Vue.
- Add an introduction page to the docs.
- Finish off the 'Core Concepts' section of the docs.
- Continue building out the component playground so we can embed live code snippets into the docs.
- Set a date for the 1.0 release and grind towards it!
