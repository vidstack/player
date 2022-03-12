---
title: Audio Player Installation (CDN)
description: Instructions to get your audio player up and running through a CDN.
---

!!!step :title=Register Element :desc=Add the following `script` tag to register the `vds-audio-player` custom element.

```html:copy-highlight{4}
<!doctype html>
<html>
<head>
	<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player/dist-cdn/define/vds-audio-player.js"></script>
</head>
<body>
	<!-- ... -->
</body>
</html>
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-audio-player
	src="https://media-files.vidstack.io/audio.mp3"
	controls
	loading="lazy"
>
	<!-- `<source>` and `<track>` elements can go here. -->
	<vds-media-ui slot="ui">
  	<!-- UI elements go here. -->
	</vds-media-ui>
</vds-audio-player>
```

!!!
