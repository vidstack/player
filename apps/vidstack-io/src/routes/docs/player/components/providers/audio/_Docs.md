## Usage

:::info
The audio provider extends the API of the native `<audio>` element so you can replace
it with `<vds-audio>` and it'll just work! Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
for more information about the native `<audio>` element.
:::

The audio provider is used to embed sound content into documents via the native
[`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) element. It may
contain one or more audio sources, represented using the `src` attribute or the `<source>` element:
the browser will choose the most suitable one.

<slot name="usage" />

## Player

The `<vds-audio-player>` component is a light extension on top of `<vds-audio>` to enable a custom player UI
to be built. Thus, the entire audio provider's API is available when interacting with it.

<slot name="player" />

## Multiple Sources

<slot name="multiple-sources" />
