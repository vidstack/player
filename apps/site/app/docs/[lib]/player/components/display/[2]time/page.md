---
description: This component is used to display certain media states as a unit of time, such as the current time or duration.
---

## Usage

The `$tag:media-time` component displays time formatted text (e.g., `01:30` represents 1 minute
30 seconds). The time can be based on either the current time, buffered amount, seekable amount,
or duration.

{% code_snippet name="usage" copyHighlight=true highlight="html:3|react:7" /%}

The `type` property can be set to:

- `current`: The current playback time.
- `buffered`: The buffered amount of media.
- `duration`: The total length of media.

{% code_preview name="demo" size="medium" /%}

## Remaining Time

You can use the `remainder` property to display the duration minus the selected `type`.

{% code_snippet name="remainder" copyHighlight=true highlight="html:4|react:8" /%}
