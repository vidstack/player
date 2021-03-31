<!-- [@wcom/cli] AUTO GENERATED BELOW -->

## Examples

```html
<vds-buffering-indicator show-while-booting delay="500">
  <!-- `hidden` attribute will automatically be applied/removed -->
  <div hidden>
    <!-- ... -->
  </div>
</vds-buffering-indicator>
```

## Properties

| Property                     | Description                                                                                                                                                                                                                                      | Type             | Default |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------- |
| `delay`                      | Delays the showing of the buffering indicator in the hopes that it resolves itself within that delay. This can be helpful in avoiding unnecessary or fast flashing indicators that may stress the user out. The delay number is in milliseconds. | `number`         | `0`     |
| `showWhileBooting`           | Whether the indicator should be shown while the provider/media is booting, in other words before it's ready for playback (`canPlay === false`).                                                                                                  | `boolean`        | `false` |
| `styles` _(readonly/static)_ |                                                                                                                                                                                                                                                  | `CSSResultArray` |         |

## Events

| Event                | Description                                     | Type                   |
| -------------------- | ----------------------------------------------- | ---------------------- |
| `vds-buffering-hide` | Emitted when the buffering indicator is hidden. | `VdsCustomEvent<void>` |
| `vds-buffering-show` | Emitted when the buffering indicator is shown.  | `VdsCustomEvent<void>` |

## Slots

| Slot | Description                                                  |
| ---- | ------------------------------------------------------------ |
|      | Used to pass in the content to be displayed while buffering. |
