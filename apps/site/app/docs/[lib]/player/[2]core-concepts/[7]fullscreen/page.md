---
title: Fullscreen
description: How to manage fullscreen with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how to request and track fullscreen changes with Vidstack Player.

## Methods

You can request to enter or exit fullscreen on the `<media-player>` element like so:

```ts {% copy=true highlight="2" %}
try {
  await player.enterFullscreen();
} catch (e) {
  // This will generally throw if:
  // 1. Fullscreen API is not available.
  // 2. Or, the user has not interacted with the document yet.
}
```

```ts {% copy=true highlight="2" %}
try {
  await player.exitFullscreen();
} catch (e) {
  // This will generally throw if:
  // 1. Fullscreen API is not available.
}
```

### Target

By default, calling the `enterFullscreen()` method will first attempt to use the
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) so the
custom media UI is displayed, otherwise it'll fallback to the current media provider.

You can specify that you only want to display the provider in fullscreen and not the entire media
by specifying the fullscreen target like so:

```ts
// Accepts `prefer-media`, `media`, `provider`
player.enterFullscreen('provider');
```

{% callout type="warning" %}
By setting `target` to `provider`, the controller will only request fullscreen on the
media provider, meaning your custom UI will _not_ be displayed when in fullscreen.
{% /callout %}

## Media Store

The following fullscreen properties are available on the media store:

- `canFullscreen`: Whether fullscreen API is currently available.
- `fullscreen`: Whether the player is currently in fullscreen mode.

{% code_snippet name="subscribe" highlight="react:8" /%}

## Media Remote

The [media remote](/docs/player/core-concepts/state-management#updating) provides methods for
dispatching `media-enter-fullscreen-request` and `media-exit-fullscreen-request` request
events like so:

{% code_snippet name="remote" highlight="html:3,10|react:6,12" /%}

## Styling

The following media attributes are available for styling based on the current fullscreen state:

```css
media-player[data-can-fullscreen] {
  /* fullscreen API is available. */
}

media-player:not([data-can-fullscreen]) {
  /* fullscreen API is _not_ available. */
}

media-player[data-fullscreen] {
  /* fullscreen is active. */
}

media-player:not([data-fullscreen]) {
  /* fullscreen is _not_ active. */
}
```

## Events

The following events are available for detecting fullscreen changes or errors:

{% code_snippet name="fullscreen-events" /%}

## Screen Orientation

The player uses the native [Screen Orientation API](https://caniuse.com/screen-orientation) to
lock the document's orientation. You can specify the preferred fullscreen orientation like so:

{% code_snippet name="screen-orientation" /%}

This will lock the screen orientation as specified by `$attr:fullscreen-orientation` while the
media enters fullscreen, and it will be unlocked while exiting. Read more about
the [available screen orientation types](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock#parameters).

### Events

The following events are available for detecting screen orientation changes:

{% code_snippet name="screen-orientation-events" /%}
