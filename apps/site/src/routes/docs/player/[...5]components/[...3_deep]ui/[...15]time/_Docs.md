## Usage

The `<vds-time>` component displays time formatted text (e.g., `01:30` represents 1 minute 30 seconds).
The time can be based on either the current time, buffered amount, seekable amount, or duration.

<slot name="usage" />

The `type` <AttrWord /> can be set to:

- `current`: The current playback time.
- `seekable`: The seekable amount of media (i.e., where the user can seek to without buffering).
- `buffered`: The buffered amount of media. Similar to `seekable`, but the
  [seekable amount can be greater than the buffered amount](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/buffering_seeking_time_ranges#seekable)
  due to `byte-range:ignore` requests.
- `duration`: The total length of media.

## Remaining Time

You can use the `remainder` <AttrWord /> to display the duration minus the selected `type`.

<slot name="remaining-time" />
