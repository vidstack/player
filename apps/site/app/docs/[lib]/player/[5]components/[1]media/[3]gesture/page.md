---
title: Gesture
description: This component enables actions to be performed on the media based on user gestures.
---

## Usage

The `$tag:media-gesture` component enables actions to be performed on the media provider based on
defined user gestures. Some examples include:

- Clicking or touching the player to toggle playback.
- Double-pressing the player to toggle fullscreen.
- Tapping the sides of the player to seek forwards or backwards.
- Pausing media when the user's mouse leaves the player.

{% code_preview name="usage" css=true copyHighlight=true highlight="html:3-6|react:3-6"  /%}

### Event

The `action` property seen in the snippet above can be any valid DOM event type
(e.g., `touchstart`, `mouseleave`, etc.). An event listener is attached to the given event type on
the media outlet, and when fired, it will trigger the `action` on the media provider.

In addition, any event can be prefixed with `dbl` (e.g., `dblpointerup`) to ensure it's fired
twice in succession (within 200ms) before the gesture action is triggered.

### Action

The `action` property represents the media state change that will occur when the gesture
is performed.

```ts
export type GestureAction =
  | 'play'
  | 'pause'
  | `seek:${number}`
  | `toggle:${'paused' | 'muted' | 'fullscreen' | 'user-idle'}`;
```

## Contextual Menu

Due to event listeners being attached directly to the media outlet, they don't block the
video element's contextual menu (i.e., the menu opened when you right-click the video element):

![The native video element with the contextual menu opened.]($lib/img/contextual-menu.png)

## Positioning

Gestures are absolutely positioned, sized, and layered with CSS like so:

```css
/* This gesture covers the entire media outlet (video canvas). */
media-gesture[action='toggle:paused'] {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* This gesture covers the right 20% of the media outlet. */
media-gesture[action='seek:10'] {
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  /* Higher z-index means this gesture will override any below it. */
  z-index: 1;
}
```

## Tailwind

{% code_snippet name="tailwind" copyHighlight=true highlight="html:3-22|react:3-18"  /%}
