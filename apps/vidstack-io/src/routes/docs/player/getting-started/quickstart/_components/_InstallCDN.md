Using a CDN like [JSDelivr](https://jsdelivr.com) is the simplest and fastest way to start
using the player library. We provide a CDN bundle that includes all package dependencies,
and it's specially minified to get the bundle size as small as possible.

#### Why use a CDN?

So you can best decide what install method is best for you, we'll quickly look at some good
reasons to use a CDN. Refer to the NPM option to find good counter reasons using the select
menu above.

- It's simple. There's no build step or anything to install. Add a few script tags, and
  you're ready to start creating a player, making this an ideal option for development,
  playground, and low-code environments (e.g., WordPress and Shopify).

- If you aren't importing from the library or building any custom elements, there may be no
  point in checking it into Git. It's one less dependency to track, version control, and
  load in your Git repository. Refer to the NPM install option to find good reasons why you
  should still bundle it locally (if possible).

- You'll get much faster load times because JSDelivr uses a
  [multi-CDN architecture](https://www.jsdelivr.com/network/infographic) and has more than 750
  points of presence (PoPs). All other users of our library who are also using the CDN will pull
  the code closer to all PoPs while keeping the cache warm every time they make a request.

- It'll reduce the load and stress on your server. If you're already at your server limit
  computationally or financially, it may be best to delegate loading of some resources to an
  externally managed CDN.
