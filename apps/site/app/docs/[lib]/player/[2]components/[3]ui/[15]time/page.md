---
description: This component is used to display certain media states as a unit of time, such as the current time or duration.
---

## Usage

The `$tag:vds-time` component displays time formatted text (e.g., `01:30` represents 1 minute
30 seconds). The time can be based on either the current time, buffered amount, seekable amount,
or duration.

{% code_snippet name="usage" copyHighlight=true highlight="html:3|react:8" /%}

The `type` property can be set to:

- `current`: The current playback time.
- `seekable`: The seekable amount of media (i.e., where the user can seek to without buffering).
- `buffered`: The buffered amount of media. Similar to `seekable`, but the
  [seekable amount can be greater than the buffered amount](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/buffering_seeking_time_ranges#seekable)
  due to `byte-range` requests.
- `duration`: The total length of media.

{% code_preview name="demo" size="medium" copyHighlight=true highlight="html:3-9|react:7-23" /%}

## Remaining Time

You can use the `remainder` property to display the duration minus the selected `type`.

{% code_snippet name="remainder" copyHighlight=true highlight="html:4|react:7" /%}
