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

## Player Sizing

By default, the browser will use the [intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
of the loaded media to set the dimensions of the provider. As media loads over the network,
the element will jump from the default `150px` width and `300px` height to the intrinsic media size,
triggering a layout shift which is a [poor user experience indicator](https://web.dev/cls) for
both your users and search engines (i.e., Google).

To avoid a layout shift, you can declare fixed dimensions for the media using the video `width` and
`height` attributes like so:

```html{6-7}:copy
<!--
  This works in specific use-cases, but prefer using an aspect
  ratio container (keep reading).
-->
<video
  width="1280"
  height="720"
></video>
```

{/if}

However, we recommend you prefer to use an aspect ratio container which holds a fixed
ratio (e.g., `16:9`). Ideally the ratio set should match the ratio of the media content
itself (intrinsic aspect ratio). This will ensure you're media size adapts responsively to the
viewport size. See our [`vds-aspect-ratio`](../../../components/ui/aspect-ratio/index.md)
component on how you can achieve this.

## Player Skins

You might not be interested in designing your player and rather a quick, beautiful default look.
Skins which provide what you're looking for are not available just yet but on our roadmap. We'll
announce it on our channels once it's ready. Follow us on [Twitter](https://twitter.com/vidstackjs?lang=en)
or [Discord](https://discord.com/invite/7RGU7wvsu9) to be notified when it's ready.

{#if frameworkType !== 'React'}
<DangerouslyAll {installMethod} />
{/if}
