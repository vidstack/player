---
description: Introduction to using Vidstack Player with Vue.
---

# Vue

In this section, you'll find a simple overview of how to use the library with Vue.

## Configuration

Vue has excellent documentation on
[using custom elements](https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue).
Follow the Vue docs and set the
[`isCustomElement` compiler option](https://vuejs.org/api/application.html#app-compileroptions-iscustomelement)
like so:

```js:copy-highlight{2}
app.config.compilerOptions = {
	isCustomElement: (tag) => tag.startsWith('vds-'),
}
```

## Importing Components

You can import any component from the path `@vidstack/player/define/*`. The import will safely
register the custom element and any dependencies so you can start using it.

```vue:title=MyPlayer.vue:copy
<script>
	// `.js` extension is required for Node exports to work.
  import '@vidstack/player/define/vds-video-player.js';
  import '@vidstack/player/define/vds-play-button.js';
</script>

<template>
	<vds-video-player>
		<vds-media-ui>
			<vds-play-button />
		</vds-media-ui>
	</vds-video-player>
</template>
```

You can read more about [importing elements](../getting-started/foundation.md#elements) in the
'Foundation' walkthrough.

## Element References

You can use [template refs](https://vuejs.org/guide/essentials/template-refs.html) to obtain a
reference to the underlying custom element if needed. This is _generally_ only required when
calling a method.

### Options API

```vue:copy
<script lang="ts">
import { type VideoPlayerElement } from '@vidstack/player';

export default {
	mounted() {
		const player = this.$refs.player as VideoPlayerElement;
		const canPlayType = player.canPlayType('video/mp4');
		// ...
	}
};
</script>

<template>
	<vds-video-player ref="player" />
</template>
```

### Composition API

```vue:copy
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type VideoPlayerElement } from '@vidstack/player';

const player = ref<VideoPlayerElement>(null);

onMounted(() => {
	const canPlayType = player.value!.canPlayType('video/mp4');
	// ...
});
</script>

<template>
	<vds-video-player ref="player" />
</template>
```

## Properties

Vue automatically checks DOM-property presence using the `in` operator and will prefer setting
the value as a DOM property if the key is present; therefore, you can pass in complex data types
such as objects and arrays without any issues.

```vue
<template>
  <vds-hls :hls-config="{ lowLatencyMode: true }" />
</template>
```

Typically this would fail since `hls-config` is _not_ a property on `HlsElement`, but we define
it as one, so you can go on with your day and not worry about whether to use `hls-config` or `.hlsConfig`.

## Events

You can listen to custom events just as you would listen to any other event. All event types
can be imported from the `@vidstack/player` module.

### Options API

```vue:copy
<script lang="ts">
import { type MediaPlayingEvent } from '@vidstack/player';

export default {
	methods: {
		onPlaying(event: MediaPlayingEvent) {
			// ...
		}
	}
};
</script>

<template>
	<vds-video-player @vds-playing="onPlaying" />
</template>
```

### Composition API

```vue:copy
<script lang="ts">
import { type MediaPlayingEvent } from '@vidstack/player';

function onPlaying(event: MediaPlayingEvent) {
	// ...
}
</script>

<template>
	<vds-video-player @vds-playing="onPlaying" />
</template>
```

## Media Store

The media store enables you to subscribe directly to specific media state changes, rather than
listening to potentially multiple DOM events and binding it yourself.

We're working on a `useMediaStore` composable so you can easily two-way bind to media state. Follow
us on [Twitter](https://twitter.com/vidstackjs?lang=en) or [Discord](https://discord.com/invite/7RGU7wvsu9)
to be notified of when it's ready.
