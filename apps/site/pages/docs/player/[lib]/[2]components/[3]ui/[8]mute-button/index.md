---
description: This component is used to mute and unmute media.
---

## Usage

The `$tag:vds-mute-button` component will toggle the `muted` state of media as it's pressed by
dispatching a `vds-mute-request`, and `vds-unmute-request` event to the media controller.

{% code_snippets name="usage" css=true copyHighlight=true highlight="html:3-6|react:7-10" /%}

## Styling

Here's a simple styled `$tag:vds-mute-button` example containing a mute and unmute icon:

{% code_preview name="styling" size="medium" css=true copyHighlight=true highlight="html:3-16|react:7-20" /%}
