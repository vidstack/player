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

Vidstack media events smooth out any unexpected behaviour across browsers, attach additional
metadata to the event `detail`, and contain rich information such as the [request event](#request-events)
that triggered it or the origin event that kicked it off.

{% code_snippet name="events" /%}

## Request Events

Request events are fired when 'requesting' the controller to update the provider's state. For example,
the `media-play-request` event is a request to begin/resume playback, and as a consequence it'll
trigger a `play()` call. The provider should respond with a `play` event to confirm the request was
satisfied.

{% code_snippet name="request" /%}

## Event Triggers

All events in the library keep a history of **trigger events** which are stored as a
chain. Each event points to the event that came before it all the way up to the **origin event**.
The following is an example of a chain that is created when the play button is clicked:

{% triggers_visual /%}

{% code_snippet name="triggers" /%}

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
