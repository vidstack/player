## Usage

:::info
The video provider extends the API of the native `<video>` element so you can replace
it with `<vds-video>` and it'll just work! Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
for more information about the native `<video>` element.
:::

Embeds video content into documents via the native `<video>` element. It may contain
one or more video sources, represented using the `src` attribute or the `<source>` element: the
browser will choose the most suitable one.

The list of [supported media formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)
varies from one browser to the other. You should either provide your video in a single format
that all the relevant browsers support, or provide multiple video sources in enough different
formats that all the browsers you need to support are covered.

<slot name="usage" />

## Player

The `<vds-video-player>` component is a light extension on top of `<vds-video>` to enable a custom
player UI to be built. Thus, the entire video provider's API is available when interacting with it.

<slot name="player" />

## Multiple Sources

<slot name="multiple-sources" />
