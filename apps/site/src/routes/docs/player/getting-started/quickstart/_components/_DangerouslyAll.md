<script>
	export let installMethod;
</script>

## Importing Everything

:::danger
We _do not_ recommend importing everything. By importing `dangerously-all.js`, you're importing
all providers and elements in the library which will bloat your final application bundle size.
:::

We generally recommend only registering what you'll be using. Each element's respective docs
contains a register code snippet you can copy and paste as needed. However, you can register
all elements if you're testing things out, or in a playground environment like so:

{#if installMethod === 'NPM'}

```js:copy
import '@vidstack/player/define/dangerously-all.js';
```

{:else}

```html:copy
<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player/dist-cdn/define/dangerously-all.js"></script>
```

{/if}

You can also register only all UI elements like so (safer):

{#if installMethod === 'NPM'}

```js:copy
import '@vidstack/player/define/dangerously-all-ui.js';
```

{:else}

```html:copy
<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player/dist-cdn/define/dangerously-all-ui.js"></script>
```

{/if}
