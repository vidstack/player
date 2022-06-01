---
description: This component is used to create a range input for controlling the current time of playback.
---

## Usage

The `$tag:vds-time-slider` component (aka scrubber) extends [`$tag:vds-slider`](/docs/player/components/ui/slider/) ,
and two-way binds the slider's value with the provider's current playback time position.

The slider receives time updates from the provider through the media store, and it'll actively
dispatch a `vds-seeking-request` event (throttled to once per `100ms`) as the slider value
changes. Seeking requests let the media controller know that the user is actively seeking, but
they haven't determined the final playback position they want to seek to. When the user stops
dragging the slider, a `vds-seek-request` event will be fired to request updating the
current playback time to the slider's value.

The slider's range is assumed to be in seconds between `0` (min) and length of media (max).

{% code_snippet name="usage" copyHighlight=true highlight="html:2-4|react:7" /%}

## Styling

In the following example, we add a conventional time slider inside some media:

{% code_preview name="styling" css=true copyHighlight=true highlight="html:3-11|react:7-15" /%}
