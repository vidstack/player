---
description: This page showcases how to create a loading indicator for when media has paused due to a lack of data.
---

## Usage

We don't provide a buffering indicator component out of the box because you can easily create one with
some HTML, CSS, and [media attributes](../../../getting-started/styling.md#media-attributes).

The `waiting:ignore` attribute can be used to show the indicator while media is buffering.
Optionally, the `can-play:ignore` attribute could also be used to display the indicator while
media is initially loading.

```css copy
/* Show buffering indicator while media is not ready, or buffering. */
vds-media:not([can-play]) .buffering-icon,
vds-media[waiting] .buffering-icon {
  opacity: 1;
}
```

## Styling

In the following example, we put together a conventional buffering spinner, and position it at the
center of the player:

<slot name="styling" />

```css copy
.media-buffering-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* prevent blocking lower elements (e.g., gestures). */
  pointer-events: none;
  /** place above poster (optional). */
  z-index: 1;
}

.media-buffering-icon {
  width: 96px;
  height: 96px;
  color: white;
  opacity: 0;
  transition: opacity 200ms ease;
}

.media-buffering-track {
  opacity: 0.25;
}

.media-buffering-track-fill {
  opacity: 0.75;
  stroke-dasharray: 100;
  stroke-dashoffset: 50;
}

/* Show buffering indicator while media is not ready, or buffering. */
vds-media:not([can-play]) .media-buffering-icon,
vds-media[waiting] .media-buffering-icon {
  opacity: 1;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```
