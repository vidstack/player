# UI Design Patterns

## Functional Components

Functional components are naked (no styling) and only contain logic for accessbility and
core functionality. This gives consumers complete freedom to style the component as they desire.
For example, a `ToggleMuteControl` will only contain the logic for toggling the muted state of the
player, and handling ARIA attributes on the button.

Functional components are made possible thanks to the `<slot />` element and CSS classes. Following
the `ToggleMuteControl` example, it may apply classes such as `vmPressed` or `vmFocused` to
the root element in the light DOM so you can purely style your component with HTML/CSS only.

### Multiple States

If a functional component contains logic for multiple states then multiple `<slot />` elements can
be used. For example, a Toggle might have a `on` and `off` state which would translate to
`<slot name="on" />` and `<slot name="off" />`. Both slots should be rendered to enable
the consumer to style transitions between states. The toggle could apply the `vmHidden` CSS
class to the root light DOM element in either the `on` or `off` slot depending on which should
be currently visible.

### Dynamic Styling

A component may be styled based on some dynamic value. For example, styling a Scrubber
might require a `background-fill` based on the % of the video that's played. This can be
solved with [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). In this
case a `--vm-played-percent` property could be exposed to enable the consumer to achieve the
styling they desire.

## Listening to events on the Player

It's common for some lower level component in the Player subtree wanting to listen to events
dispatched on the `Player`. For example, there might be options on a `PlaybackControl` to toggle
its state when certain keys are pressed. Thus, an event listener needs to be setup on the player
to listen to the `keydown` event.

To cater for this need a `listen` context is created that can be consumed by components lower in
the Player subtree.

```ts
import createContext, { Context } from '@wcom/context';

type StopListeningToEvent = (() => void);

type EventListener = <T extends keyof HTMLElementEventMap>(
  type: T,
  handler: (event: HTMLElementEventMap[T]) => void,
  options?:  boolean | AddEventListenerOptions | EventListenerOptions,
): StopListeningToEvent;

interface PlayerContext {
  // ...
  listen: Context<EventListener>;
}

export const playerContext: PlayerContext = {
  // ...
  listen: createContext((type, handler, options) => {
    // Dispatch event the player can listen for to attach event listener.
    return () => {
      // Dispatch event the player can listen for to remove event listener.
    };
  });
}
```

## Component Communication

There are cases where isolated components need to be aware/communciate with each other.

**Examples:**

- Controls needs to be aware of components such as captions/settings to implement collision detection.
- IconLibrary needs to be aware of icons so when the icon library changes all icons can be redrawn.
- Settings needs to be aware of any controller that will be used to open/close it.

**Potential Solutions**

- **Context.** 

- **Modules.**

- Add ability to attach new context to the player.
- Use something similar to a service/observable (https://stackoverflow.com/a/39973879). Means
  these will need to be predefined on the player or the ability to add custom context from lower
  in tree is made possible.
- Use the `playerEventListener` context as a way to communicate (issue: might have missed events as
  elements are attached to DOM at different times).
- Use modules as used in v5 (issue: easily leaks to other player instances as the scope is shared so
  it might be useful where that's desired such as an IconRegistry):
  - [IconRegistry](https://github.com/vime-js/vime/blob/master/core/src/components/ui/icon-library/IconRegistry.ts)
  - [withControlsCollisionDetection](https://github.com/vime-js/vime/blob/master/core/src/components/ui/controls/controls/withControlsCollisionDetection.ts)
