---
description: This component is used to create a range input for controlling the volume of media.
---

## Usage

The `$tag:vds-volume-slider` component extends [`$tag:vds-slider`](/docs/player/components/ui/slider/),
and two-way binds the slider's value with the provider's volume level.

The slider receives volume updates from the provider through the media store, and dispatches a
`vds-volume-change-request` event to request updating the current volume level on the provider as
the slider value changes.

The media volume range is between `0` (min) and `1` (max), but on the slider it's between `0` and
`100`. The conversion is automatically handled by this component.

{% code_snippet name="usage" copyHighlight=true highlight="html:2-4|react:7" /%}

## Styling

In the following example, we add a mute button and conventional volume slider inside some media:

{% code_preview name="styling" css=true copyHighlight=true highlight="html:3-25|react:7-29" /%}
