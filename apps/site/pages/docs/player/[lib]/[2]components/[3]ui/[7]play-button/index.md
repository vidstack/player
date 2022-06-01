---
description: This component is used to play and pause media.
---

## Usage

The `$tag:vds-play-button` component will toggle the `paused` state of media as it's pressed by
dispatching a `vds-play-request`, and `vds-pause-request` event to the media controller.

{% code_snippets name="usage" css=true copyHighlight=true highlight="html:3-6|react:7-10" /%}

## Styling

Here's a simple styled `$tag:vds-play-button` example containing a play and pause icon:

{% code_preview name="styling" size="medium" css=true copyHighlight=true highlight="html:3-13|react:7-17" /%}

{% callout type="tip" %}
You can extend the preview above by adding a replay SVG icon, and showing it whilst hiding the play icon
when the `media-ended` attribute is present.
{% /callout %}
