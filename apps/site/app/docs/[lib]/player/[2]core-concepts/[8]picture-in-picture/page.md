---
title: Picture In Picture
description: How to manage picture-in-picture with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how to request and track
[picture-in-picture](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API)
(PIP) changes with Vidstack Player.

## Methods

You can request to enter or exit picture-in-picture mode on the `<media-player>` element like so:

```ts {% copy=true highlight="3" %}
try {
  // `PictureInPictureWindow` will be returned if supported.
  const pipWindow = await player.enterPictureInPicture();
  if (pipWindow) {
    // ...
  }
} catch (e) {
  // This will generally throw if:
  // 1. PIP API is not available.
  // 2. Or, the user has not interacted with the document yet.
}
```

```ts {% copy=true highlight="2" %}
try {
  await player.exitPictureInPicture();
} catch (e) {
  // This will generally throw if:
  // 1. PIP API is not available.
}
```

## Media Store

The following picture-in-picture properties are available on the media store:

- `canPictureInPicture`: Whether PIP API is currently available.
- `pictureInPicture`: Whether the player is currently in PIP mode.

{% code_snippet name="subscribe" highlight="react:8" /%}

## Media Remote

The [media remote](/docs/player/core-concepts/state-management#updating) provides methods for
dispatching `media-enter-pip-request` and `media-exit-pip-request` request events like so:

{% code_snippet name="remote" highlight="html:3,10|react:6,12" /%}

## Styling

The following media attributes are available for styling based on the current picture-in-picture
state:

```css
media-player[data-can-pip] {
  /* PIP API is available. */
}

media-player:not([data-can-pip]) {
  /* PIP API is _not_ available. */
}

media-player[data-pip] {
  /* PIP is active. */
}

media-player:not([data-pip]) {
  /* PIP is _not_ active. */
}
```

## Events

The following events are available for detecting picture-in-picture changes or errors:

{% code_snippet name="pip-events" /%}
