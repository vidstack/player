# vds-video

Enables loading, playing and controlling videos via the HTML5 `<video>` element.

<!-- AUTO GENERATED BELOW -->

## Examples

```html
<vds-video src="/media/video.mp4" poster="/media/poster.png">
  <!-- ... -->
</vds-video>
```

```html
<vds-video poster="/media/poster.png">
  <source src="/media/video.mp4" type="video/mp4" />
  <track
    default
    kind="subtitles"
    src="/media/subs/en.vtt"
    srclang="en"
    label="English"
  />
  <vds-ui>
    <!-- ... -->
  </vds-ui>
</vds-video>
```

## Properties

| Property                     | Description                                                                                                                                                                                                   | Type                                                             | Default     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------- |
| `styles` _(readonly)_        |                                                                                                                                                                                                               | `CSSResultArray`                                                 | `undefined` |
| `poster`                     | A URL for an image to be shown while the video is downloading. If this attribute isn't specified, nothing is displayed until the first frame is available, then the first frame is shown as the poster frame. | `string ∣ undefined`                                             | `undefined` |
| `currentPoster` _(readonly)_ | The URL of the current poster. Defaults to `''` if no media/poster has been given or loaded.                                                                                                                  | `string`                                                         | `undefined` |
| `controlsList`               | Determines what controls to show on the media element whenever the browser shows its own set of controls (e.g. when the controls attribute is specified).                                                     | `"nodownload" ∣ "nofullscreen" ∣ "noremoteplayback" ∣ undefined` | `undefined` |
| `autoPiP`                    | 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as the user switches back and forth between this document and another document or application.                | `boolean ∣ undefined`                                            | `undefined` |
| `disablePiP`                 | 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or to request picture-in-picture automatically in some cases.                                                  | `boolean ∣ undefined`                                            | `undefined` |
| `disableRemotePlayback`      | 🧑‍🔬 **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast, DLNA, AirPlay, etc). | `boolean ∣ undefined`                                            | `undefined` |

## Slots

| Slot | Description                                                                                   |
| ---- | --------------------------------------------------------------------------------------------- |
|      | Pass in UI components and `<source>`/`<track>` elements to the underlying HTML5 media player. |

## CSS Parts

| Name        | Description                                 |
| ----------- | ------------------------------------------- |
| `container` | The container element that wraps the video. |
| `video`     | The video element.                          |
