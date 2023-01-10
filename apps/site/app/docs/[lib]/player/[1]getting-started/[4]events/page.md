---
title: Events
description: Introduction to rich events when working with Vidstack Player.
---

# Events

In this section, we'll look at the rich event system that's available when working with the player.

## Media Events

The media provider fires a superset of `HTMLMediaElement` events. You can kebab-case and prefix any
[native media event type](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events)
with `vds-` to get the custom variant.

- `loadedmetadata` -> `vds-loaded-metadata`
- `canplay` -> `vds-can-play`
- `play` -> `vds-play`

Prefer our events as they smooth out any unexpected behaviour across browsers, attach additional
metadata to the event `detail`, and contain rich information such as the [request event](#request-events)
that triggered it or the origin event that kicked it off.

{% code_snippet name="events" /%}

## Request Events

Request events are fired when 'requesting' the controller to update the provider's state. For example,
the `vds-play-request` event is a request to begin/resume playback, and as a consequence it'll
trigger a `play()` call. The provider should respond with a `vds-play` event to confirm the
request was satisfied.

{% code_snippet name="request" /%}

## Event Triggers

All events in the library keep a history of **trigger events** which are stored as a
chain. Each event points to the event that came before it all the way up to the **origin event**.
The following is an example of a chain that is created when the play button is clicked:

{% triggers_visual /%}

{% code_snippet name="triggers" /%}
