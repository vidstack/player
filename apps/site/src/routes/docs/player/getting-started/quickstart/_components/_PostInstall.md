<script>
  import DangerouslyAll from './_DangerouslyAll.md';

  export let installMethod;
  export let frameworkType;
  export let providerLink;
  export let providerApiLink;
  export let providerType;
</script>

Congratulations, you're done! You should see the media player rendered on your site :tada:

{#if providerType !== 'Audio'}

## Player Poster

You might've noticed that we declare two posters in the player markup. The one on the Vidstack
provider element is the poster that you expect your users to load and see. The other on the
`<video>` element is shown temporarily as the primary poster loads, or if JavaScript is disabled
by a client or crawler (i.e., search engine).

You can choose to load a low-res image that the user will see while the main poster is loading or
a `124x70` (or greater) sized image explicitly designed to show in search results.

:::info
See the [Structured Video Data](https://developers.google.com/search/docs/advanced/structured-data/video)
documentation by Google to learn how to explicitly provide rich information about your videos.
:::

## Player Sizing

By default, the browser will use the [intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
of the loaded media to set the dimensions of the provider. As media loads over the network,
the element will jump from the default `150px` width and `300px` height to the intrinsic media size,
triggering a layout shift which is a [poor user experience indicator](https://web.dev/cls) for
both your users and search engines (i.e., Google).

To avoid a layout shift, we recommend you use an aspect ratio container which holds a fixed
ratio (e.g., `16/9`). Ideally the ratio set should match the ratio of the media content
itself (i.e., intrinsic aspect ratio). This will ensure you're media size adapts responsively to the
viewport size. See our [`vds-aspect-ratio`](../../../components/ui/aspect-ratio/index.md)
component on how you can achieve this.

{/if}

## Player Skins

You might be interested in a quick and beautiful look out of the box rather than
designing your own. Skins which provide what you're looking for are not available just yet but
on our roadmap. Follow us on [Twitter](https://twitter.com/vidstackjs?lang=en) or
[Discord](https://discord.com/invite/7RGU7wvsu9) to be notified when it's ready.

{#if frameworkType !== 'React'}
<DangerouslyAll {installMethod} />
{/if}
