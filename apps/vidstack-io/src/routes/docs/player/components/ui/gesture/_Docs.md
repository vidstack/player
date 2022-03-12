## Usage

The `<vds-gesture>` component enables actions to be performed on the media provider based on
defined user gestures. Some examples include:

- Clicking the player to toggle playback.
- Double-clicking the player to toggle fullscreen.
- Tapping the sides of the player to seek forwards or backwards.
- Pausing media when the user's mouse leaves the player.

<slot name="usage" />

You can position the gesture using CSS so it's only triggered in certain regions of the player:

```css:copy
/* Gesture can be interacted with _anywhere_ on the player. */
vds-gesture.anywhere {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

/* Gesture can be interacted with on the _right 25%_ of the player. */
vds-gesture.right-25 {
	position: absolute;
	top: 0;
	right: 0;
	width: 25%;
	height: 100%;
}
```

### Type

The `type` <AttrWord /> seen in the snippet above can be any valid DOM event type
(e.g., `touchstart`, `mouseleave`, etc.). An event listener is attached to the given event type on
the media container, and when fired, it will trigger the `action` on the media provider.

### Action

The `action` <AttrWord /> represents the media state change that will occur when the gesture
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

The `repeat` <AttrWord /> represents of number of times a gesture event `type` should be
repeated before the action is performed. If you want an event to occur _twice_ before the action
is performed, this will be a _single_ repitition (i.e., value of `1`).

<slot name="repeat" />

### Priority

The `priority` <AttrWord /> represents the level of importance given to this gesture. If multiple
gestures occur at the same time, the priority will determine which gesture actions are
performed. Higher priority gestures in a single batch will cause lower level priorities to be
ignored.

Priorities are useful for layering gestures. You can think of `priority` like `z-index`, except
lower priority values mean a higher index:

<slot name="priority" />

### Contextual Menu

Due to event listeners being attached directly to the media container, they don't block the
video element's contextual menu (i.e., the menu opened when you right-click the video element):

<script>
import ContextualMenu from '$img/contextual-menu.png'
</script>

<img
	src={ContextualMenu}
	alt="The native video element with the contextual menu opened."
/>

## Styling

:::danger
Be careful when styling other components such as a poster or overlay on top of gestures. The
`pointer-events:ignore` CSS property should be `none` unless you explicity want to block the gesture
in a given region on the player.
:::

In the following example, we've applied the following gestures:

- Pause media when the user's mouse leaves the player.
- Toggle playback when the user clicks the player.
- Toggle fullscreen when the user double clicks the player.
- Seek playback backwards thirty seconds when the user double-clicks on the left region (`25%`) of the player.
- Seek playback forwards thirty seconds when the user double-clicks on the right region (`25%`) of the player.

The click gesture priorities from highest to lowest is:

seeking -> toggling fullscreen -> toggling playback.

Notice pausing on mouseleave will occur regardless of the priority set because it doesn't conflict with other
gesture event types (i.e., they generally don't occur at the same time).

<slot name="styling" />

```css
vds-gesture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.seek-gesture {
  width: 25%;
}

.seek-gesture.right {
  left: unset;
  right: 0;
}
```
