---
description: This is the top-most component in the library used to group media elements and control the flow of media state.
---

## Usage

All media elements exist inside the `$tag:vds-media` component. It's main jobs are to manage
media state, dispatch media events, satisfy media requests, and expose media state through HTML
attributes and CSS properties for styling purposes.

{% code_snippet name="usage" copy=true  /%}

## Connect Event

The `<vds-media>` element will fire a `media-connect` event that will bubble up the DOM so you
can obtain a reference to it when it's ready:

{% code_snippet name="connect-event" copy=true  /%}
