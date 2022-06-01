---
description: This component is used to perform media actions based on user gestures (e.g., double click for fullscreen).
---

## Usage

The `$tag:vds-gesture` component enables actions to be performed on the media provider based on
defined user gestures. Some examples include:

- Clicking the player to toggle playback.
- Double-clicking the player to toggle fullscreen.
- Tapping the sides of the player to seek forwards or backwards.
- Pausing media when the user's mouse leaves the player.

{% code_snippets name="usage" nums=true css=true copyHighlight=true highlight="html:3|react:7" /%}

### Type

The `type` property seen in the snippet above can be any valid DOM event type
(e.g., `touchstart`, `mouseleave`, etc.). An event listener is attached to the given event type on
the media container, and when fired, it will trigger the `action` on the media provider.

### Action

The `action` property represents the media state change that will occur when the gesture
is performed.

```ts
export type GestureAction =
  | 'play'
  | 'pause'
  | 'mute'
  | 'unmute'
  | 'enter-fullscreen'
  | 'exit-fullscreen'
  | `seek:${number}`
  | `toggle:${'paused' | 'muted' | 'fullscreen'}`;
```

### Repeat

The `repeat` property represents of number of times a gesture event `type` should be
repeated before the action is performed. If you want an event to occur _twice_ before the action
is performed, this will be a _single_ repetition (i.e., value of `1`).

{% code_snippet name="repeat" /%}

### Priority

The `priority` property represents the level of importance given to this gesture. If multiple
gestures occur at the same time, the priority will determine which gesture actions are
performed. Higher priority gestures in a single batch will cause lower level priorities to be
ignored.

Priorities are useful for layering gestures. You can think of `priority` like `z-index`, except
lower priority values mean a higher index:

{% code_snippet name="priority" /%}

### Contextual Menu

Due to event listeners being attached directly to the media container, they don't block the
video element's contextual menu (i.e., the menu opened when you right-click the video element):

![The native video element with the contextual menu opened.](/src/img/contextual-menu.png)

## Styling

{% callout type="danger" %}
Be careful when styling other components such as a poster or overlay on top of gestures. The
`pointer-events` CSS property should be `none` unless you explicitly want to block the gesture
in a given region of the player.
{% /callout %}

{% code_preview name="styling" size="large" css=true highlight="html:3-19|react:7-23" /%}

In the preview above, we've applied the following gestures:

- Pause media when the user's mouse leaves the player.
- Toggle playback when the user clicks the player.
- Toggle fullscreen when the user double clicks the player.
- Seek playback backwards thirty seconds when the user double-clicks on the left region (`25%`) of the player.
- Seek playback forwards thirty seconds when the user double-clicks on the right region (`25%`) of the player.

The click gesture priorities from highest to lowest is: seeking -> toggling fullscreen -> toggling playback.

Notice pausing on mouseleave will occur regardless of the priority set because it doesn't conflict with other
gesture event types (i.e., they generally don't occur at the same time).
