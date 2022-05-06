<script>
  import clsx from 'clsx';

  import { page } from '$app/stores';
  import { Chip } from '@svelteness/kit-docs';
  
  import QuickstartSteps from './_components/_QuickstartSteps.svelte';

  import { installMethod as _installMethod } from '$lib/stores/installMethod';
  import { lib as _lib } from '$lib/stores/lib';
  
  const installOptions = ['NPM', 'CDN'];
  const libOptions = ['HTML', 'React'];
  const providerOptions = ['Audio', 'Video', 'HLS'];

  let installMethod = getSelectionFromPath(installOptions) ?? 'NPM';
  let libType = getSelectionFromPath(libOptions) ?? 'HTML';
  let providerType = getSelectionFromPath(providerOptions) ?? 'Video';

  function getSelectionFromPath(values) {
    for (const value of values) {
      if ($page.url.pathname.includes(`/${value.toLowerCase()}`)) {
        return value;
      }
    }
  }
</script>

# Quickstart

This section will get you up and running with the library. You'll find specific instructions below
depending on the type of installation method (NPM/CDN), library (HTML/React), and provider
(Audio/Video/HLS) you opt to use.

## Browser Support

:::admonition type="info"
We support at _minimum_ ~92.74% of users tracked on [caniuse](https://caniuse.com).
:::

Ensure the following browser support table is suitable for your application. We've built the
library for the modern web; thus, we try to avoid bloated polyfills and outdated environments as
much as possible. At the moment, we only support browsers that fully implement
the [Custom Elements V1](https://caniuse.com/custom-elementsv1).

We've tried to be conservative with these numbers; take this as a lower bound. We likely support a
greater range of browsers and versions, but we won't note it here until we test it; if you're not
sure, best try it yourself and let us know!

<ul class="not-prose flex flex-col space-y-2.5 font-mono text-gray-inverse">
	<li>Edge 79+</li>
	<li>Firefox 72+</li>
	<li>Chrome 73+</li>
	<li>Safari 13.1+</li>
	<li>Opera 64+</li>
	<li>iOS Safari 13.7+</li>
	<li>Android Browser 81+</li>
	<li>Opera Mobile 59+</li>
	<li>Chrome for Android 88+</li>
</ul>

<div class="992:flex-row 992:items-center relative mb-10 flex flex-col">

## Player Installation

<div class="992:ml-2.5 mt-1 992:mt-8 -ml-1 inline-flex space-x-1.5 text-white dark:text-black">
  <Chip class={clsx(installMethod === 'CDN' ? 'bg-lime-600 dark:bg-lime-300' : 'hidden')}>
    {installMethod}
  </Chip>
  <Chip class={clsx(libType === 'HTML' ? 'hidden' : 'bg-sky-600 dark:bg-sky-300')}>
    {libType}
  </Chip>
  <Chip class="bg-indigo-600 dark:bg-indigo-300">
    {providerType}
  </Chip>
</div>

</div>

<QuickstartSteps bind:installMethod bind:libType bind:providerType {installOptions} {libOptions} {providerOptions}>
<slot />
</QuickstartSteps>

Congratulations, you're done! You should see the media player on your site :tada:

## TypeScript

We've written the player library with TypeScript, and we distribute all types with the
`@vidstack/player` package. VSCode will detect them by default, but global event types need to
be registered separately; otherwise, the following will happen:

```js
// The event type will default to `Event` instead of `MediaPlayEvent`.
provider.addEventListener('vds-play', (event) => {});
```

Events are a core part of working with the player library, so we highly recommend you resolve
this by adding the following to your TypeScript configuration file:

```json title=tsconfig.json|copyHighlight{3}
{
  "compilerOptions": {
    "types": ["@vidstack/player/globals"]
  }
}
```

## Media Controls

By default, we'll remove the controls on the underlying `<audio>` or `<video>` element as we
expect a custom user interface (UI) to be presented. Set the `controls` property on the provider
component if you'd like to display the native UI controls like so:

:::lib

```html slot="html"
<vds-video controls>
  <video controls></video>
</vds-video>
```

```jsx slot="react"
<Video controls>
  <video controls></video>
</Video>
```

:::

## Media Autoplay

We manually handle autoplay so we can detect when it fails. In addition, the `autoplay` attribute
will take priority over the `preload` attribute so media won't be lazy loaded.

Therefore, ensure you set `autoplay` on the provider component instead of the underlying media
element like so:

:::lib

```html slot="html"
<vds-video autoplay>
  <!-- Do not set autoplay on media element. -->
  <video></video>
</vds-video>
```

```jsx slot="react"
<Video autoplay>
  {/* Do not set autoplay on media element. */}
  <video></video>
</Video>
```

:::

## Media Poster

You might've noticed that we declare two posters in the player markup. The one on the Vidstack
provider element is the poster that you expect your users to load and see. The other on the
`<video>` element is shown temporarily as the primary poster loads, or if JavaScript is disabled
by a client or crawler (i.e., search engine).

You can choose to load a low-res image that the user will see while the main poster is loading or
a `124x70` (or greater) sized image explicitly designed to show in search results.

:::admonition type="info"
See the [Structured Video Data](https://developers.google.com/search/docs/advanced/structured-data/video)
documentation by Google to learn how to explicitly provide rich information about your videos.
:::

## Player Sizing

By default, the browser will use the [intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
of the loaded media to set the dimensions of the provider. As media loads over the network,
the element will jump from the default `150px` width and `300px` height to the intrinsic media size,
triggering a layout shift which is a [poor user experience indicator](https://web.dev/cls) for
both your users and search engines (i.e., Google).

To avoid a layout shift, we recommend you fill `100%` of your media container and use an aspect
ratio container which holds a fixed ratio (e.g., `16/9`). Ideally the ratio set should match the
ratio of the media content itself (i.e., intrinsic aspect ratio). See our
[`vds-aspect-ratio`](/docs/player/components/ui/aspect-ratio) component for how you can
achieve this. Once complete, your media content should now adapt responsively without a layout
shift!

:::admonition type="info"
You may still see a layout shift if the `vds-aspect-ratio` component script is imported late.
Consider including it in your critical render path (e.g., in your root `App.*` file).

```js title=App.*|copy
import '@vidstack/player/define/vds-aspect-ratio.js';
```

:::
