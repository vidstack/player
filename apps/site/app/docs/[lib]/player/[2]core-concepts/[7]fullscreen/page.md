---
title: Fullscreen
description: How to manage fullscreen with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how to manage fullscreen.

## Requests

You can request to enter or exit fullscreen on the `<vds-media>` element like so:

{% code_snippet name="request" /%}

### Target

By default, calling the `enterFullscreen()` method will first attempt to use the
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) so the
custom media UI is displayed, otherwise it'll fallback to the current media provider. When loading
media with

You can specify that you only want to display the provider in fullscreen and not the entire media
by specifying the fullscreen target like so:

```ts
// Accepts `prefer-media`, `media`, `provider`
media.enterFullscreen('provider');
```

{% callout type="warning" %}
By setting `target` to `provider`, the controller will only request fullscreen on the
media provider element, meaning your custom UI will _not_ be displayed when in fullscreen.
{% /callout %}

### Media Remote

The media remote provides methods for dispatching `media-enter-fullscreen` and
`media-exit-fullscreen` requests like so:

{% code_snippet name="remote" /%}

## Styling

The following media attributes are available for styling based on the current fullscreen state:

```css
vds-media[can-fullscreen] {
  /* fullscreen API is available. */
}

vds-media:not([can-fullscreen]) {
  /* fullscreen API is _not_ available. */
}

vds-media[fullscreen] {
  /* fullscreen is active. */
}

vds-media:not([fullscreen]) {
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
