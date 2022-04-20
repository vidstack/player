## Importing Everything

:::admonition type="danger"
We _do not_ recommend importing everything. By importing `dangerously-all.js`, you're importing
all providers and elements in the library which will bloat your final application bundle size.
:::

We generally recommend only registering what you'll be using. Each element's respective docs
contains a register code snippet you can copy and paste as needed. However, you can register
all elements if you're testing things out, or in a playground environment like so:

```js copy
import '@vidstack/player/define/dangerously-all.js';
```

You can also register only all UI elements like so (safer):

```js copy
import '@vidstack/player/define/dangerously-all-ui.js';
```
