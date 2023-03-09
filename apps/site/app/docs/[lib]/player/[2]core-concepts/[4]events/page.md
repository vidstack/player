---
title: Events
description: Introduction to rich events when working with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at the rich event system that's available when working with the player.

## Media Events

The player element fires a superset of [`HTMLMediaElement` events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events):

- `play` -> `$event:play`
- `canplay` -> `$event:can-play`
- `loadedmetadata` -> `$event:loaded-metadata`

Vidstack media events smooth out any unexpected behavior across browsers, attach additional
metadata to the event `detail`, and contain rich information such as the [request event](#request-events)
that triggered it or the origin event that kicked it off.

{% code_snippet name="events" /%}

👉 A complete list of media events fired can be found in the [Player API reference](/docs/player/components/layout/player/api#events).

## Request Events

Vidstack Player is built upon a request and response model for updating media state. Requests
are dispatched as events to the `$tag:media-player` component. The player attempts to satisfy
requests by performing operations on the provider based on the given request, and then attaching it
to the corresponding media event.

For example, the `media-play-request` event is a request to begin/resume playback, and as a
consequence it'll trigger a `play()` call on the provider. The provider will respond with a
`play` or `play-fail` event to confirm the request was satisfied.

{% code_snippet name="request" /%}

**When are request events fired?**

Media request events are fired by Vidstack components generally in response to user actions.
Most actions are a direct consequence to UI events such as pressing a button or dragging a
slider. However, some actions may be indirect such as scrolling the player out of view, switching
browser tabs, or the device going to sleep.

**How are request events fired?**

Request events are dispatched by using the
[`MediaRemoteControl`](/docs/player/core-concepts/state-management#updating). A good practice is
to always attach [event triggers](#event-triggers) to ensure requests can be traced back to
their origin. This is the same way all Vidstack components dispatch requests internally.

👉 A complete list of request events can be found in the [Player API reference](/docs/player/components/layout/player/api#events).

## Event Triggers

All events in the library keep a history of **trigger events** which are stored as a
chain. Each event points to the event that came before it all the way up to the **origin event**.

The following is an example of a chain that is created when the play button is clicked and
media begins playing:

![Playing event chain diagram]($lib/img/event-chain.png)

{% code_snippet name="triggers" /%}

### Walking

The event trigger chain can be walked through to discover additional information about how the event
was triggered. For example, you could detect whether a playing event is resuming from a buffering
event like so:

{% code_snippet name="walking" /%}

## Event Types

All event types are named using _PascalCase_ and _suffixed_ with the word `Event`
(e.g., `SliderDragStartEvent`). Furthermore, media events are all _prefixed_ with the word `Media` as
seen in the examples below.

```ts {% copy=true %}
import {
  type MediaCanPlayEvent,
  type MediaPlayEvent,
  type MediaStartedEvent,
  type MediaTimeUpdateEvent,
} from 'vidstack';
```
