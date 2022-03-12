---
title: Editor Setup
description: IDE configuration settings to improve the experience of working with Vidstack Player.
---

<script>
import VsCodeAutocomplete from '$img/vscode-autocomplete.png'
</script>

# Editor Setup

<p>In this section you'll find {__markdown.description}</p>

## TypeScript

We've written the player library with TypeScript, and we distribute all types with the
`@vidstack/player` package. VSCode will detect them by default, but global event types need to
be registered separately; otherwise, the following will happen:

```js
// The event type will default to `Event` instead of `MediaPlayEvent`.
player.addEventListener('vds-play', (event) => {});
```

Events are a core part of working with the player library, so we highly recommend you resolve
this by adding the following to your TypeScript configuration file:

```json:title=tsconfig.json:copy-highlight{3}
{
	"compilerOptions": {
		"types": ["@vidstack/player/globals"]
	}
}
```

## VSCode

VSCode provides support for extending the known HTML entities through
[VSCode Custom Data](https://github.com/microsoft/vscode-custom-data). Once set up, it enables
autocomplete suggestions for custom player elements and on-hover information such as
documentation and type data.

<img
	src={VsCodeAutocomplete}
	alt="Before and after screenshot difference of using the VsCode custom data extension."
/>

:::steps

!!!step :title=Create Settings File :desc=Create a VSCode settings JSON file at the root of your project directory.

```bash:copy
touch .vscode/settings.json
```

!!!

!!!step :title=Add Custom HTML Data :desc=Add the custom HTML data file path to `html.customData` inside the newly created settings file.

```json:title=.vscode/setting.json:copy
{
  "html.customData": ["./node_modules/@vidstack/player/vscode.html-data.json"],
}
```

!!!

:::
