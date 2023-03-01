---
description: This page showcases how to create a loading indicator for when media has paused due to a lack of data.
---

## Usage

We don't provide a buffering indicator component out of the box because you can easily create one
with some HTML, CSS, and [media data attributes](/docs/player/styling/references#media-attributes).

The `data-waiting` attribute can be used to show the indicator while media is buffering.
Optionally, the `data-can-play` attribute could also be used to display the indicator while
media is initially loading.

```css {% copy=true %}
/* Show buffering indicator while media is not ready, or buffering. */
media-player:not([data-can-play]) .buffering-icon,
media-player[data-waiting] .buffering-icon {
  opacity: 1;
}
```

## Styling

In the following example, we put together a conventional buffering spinner, and position it at the
center of the player:

{% code_preview name="styling" size="medium" css=true copyHighlight=true highlight="html:3-23|react:7-27" /%}

## Tailwind

The [styling](#styling) example above built with Tailwind:

{% code_snippet name="tailwind" copy=true /%}
