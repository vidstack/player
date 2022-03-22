# Next.js

In this section, you'll find a simple overview of how to use the library with
[Next.js](https://nextjs.org).

## Setup

Good news, you don't need to do anything to make it work with Next.js, simply follow the
[React guide](../libraries/react.md).

## SSR

Vidstack Player elements can be rendered server-side without any issues, but it's essential to remember
that this will only render elements in the
[light DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom#lightdom).
Therefore, the inner contents of any element you import from this library will not be rendered if
JavaScript is disabled either by a client or crawler (i.e., search engine).

Importantly, the `<video>` element won't be rendered because it exists inside the shadow DOM of the
provider/player, which may negatively affect SEO rankings or the experience for specific users. But
don't fear you can easily resolve this by passing the `<video>` element into the light DOM, and
hiding it once the custom element is defined by using the
[`:defined`](https://developer.mozilla.org/en-US/docs/Web/CSS/:defined) CSS pseudo class.

```jsx
<VideoPlayer src="...">
  <video src="..." />
</VideoPlayer>
```

```css:copy
/* Hide the `<video>` element once the custom element is defined. */
vds-video-player:defined > video {
  display: none;
}
```
