---
title: Video Player Installation (CDN)
description: Instructions to get your video player up and running through a CDN.
---

!!!step :title=Register Elements :desc=Add the following `script` tags to register the custom media elements.

```html:copy-highlight{4-5}
<!doctype html>
<html>
<head>
	<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/define/vds-media.js"></script>
	<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/define/vds-video.js"></script>
</head>
<body>
	<!-- ... -->
</body>
</html>
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-media>
  <vds-video
    loading="lazy"
    poster="https://media-files.vidstack.io/poster.png"
    preload="metadata"
  >
    <video
      controls
    	src="https://media-files.vidstack.io/720p.mp4"
      poster="https://media-files.vidstack.io/poster-seo.png"
      preload="none"
    ></video>
  </vds-video>
</vds-media>
```

!!!
