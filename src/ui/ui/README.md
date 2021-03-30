# vds-ui

Simple container that holds a collection of user interface components.

This is a general container to hold your UI components but it also enables you to show/hide
the player UI when media is not ready for playback by applying styles to the `root/root-hidden`
CSS parts. It also handles showing/hiding UI depending on whether native UI can't be
hidden (_cough_ iOS).

⚠️ **IMPORTANT:** The styling is left to you, it will only apply the `root-hidden` CSS part.

<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-video src="/media/video.mp4" poster="/media/poster.png">
  <!-- ... -->
  <vds-ui>
    <!-- ... -->
  </vds-ui>
</vds-video>
```

```css
vds-ui::part(root) {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in;
}

vds-ui::part(root-hidden) {
  opacity: 0;
  visibility: hidden;
}
```

## Properties

| Property                     | Description                   | Type             | Default          |
| ---------------------------- | ----------------------------- | ---------------- | ---------------- |
| `parts` _(readonly/static)_  |                               | `string[]`       | `undefined`      |
| `rootElement` _(readonly)_   | The component's root element. | `HTMLDivElement` | `HTMLDivElement` |
| `styles` _(readonly/static)_ |                               | `CSSResultArray` | `undefined`      |

## Slots

| Slot | Description                    |
| ---- | ------------------------------ |
|      | Used to pass in UI components. |

## CSS Parts

| Name              | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| `root`            | The component's root element (`<div>`).                                       |
| `root-audio-view` | Applied when the current `viewType` is `audio`.                               |
| `root-hidden`     | Applied when the media is NOT ready for playback and the UI should be hidden. |
| `root-video-view` | Applied when the current `viewType` is `video`.                               |
