---
title: User
description: Introduction to user tracking with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at ways to track user actions with Vidstack Player.

{% callout type="warning"%}
This page is a work in progress.
{% /callout %}

## Events

All media events can be traced back to their origin, the event that started it all. The
native [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) event
property will indicate whether the action was performed by a user:

{% code_snippet name="request" /%}

📖 See [request events](/docs/player/core-concepts/events#request-events) for further reading.

## Seeking

User seeking can be tracked by waiting for the `$event:media-seeking-request` and
`$event:media-seek-request` events to fire, and then checking whether their origin is trusted:

{% code_snippet name="seeking" /%}

## Idle

The user idle state indicates whether the user has been inactive for a set period of time (default
is 2s). It can be tracked by subscribing to the `userIdle` property on the media store like so:

{% code_snippet name="idle" /%}
