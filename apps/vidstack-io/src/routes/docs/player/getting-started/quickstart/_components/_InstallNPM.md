Locally installing the package via NPM is best when you're integrating the library with
build tools such as Parcel, Rollup, Vite, or Webpack. We ship both an unoptimized
development bundle that includes logs, and a production bundle that is specially minified to
get the bundle size as small as possible. Thanks to
[Node package exports](https://nodejs.org/api/packages.html#package-entry-points)
your bundler will automatically load the correct type based on the Node process environment (`NODE_ENV`).

#### Bundle vs. CDN

So you can best decide what install method is best for you, we'll quickly look at some good
reasons to locally bundle instead of using a CDN.

- It provides the greatest control over the library. If you're looking to build your own
  player elements or modify certain behaviour, then this is the path of least resistance.

- It provides the optimal development experience working with the library because your IDE
  can provide you with type/value validation and documentation. We also ship a helpful
  integration for VSCode so you can get autocomplete suggestions for our custom elements
  when writing HTML.

- It leads to less duplication of code as dependencies of this library (e.g, Lit) will be
  bundled only once. If you're using a CDN, any dependencies that are used both in your
  application and the player library will be loaded twice.

- Reduces the final bundle size as your bundler can perform tree-shaking through static
  analysis to eliminate dead-code (i.e., unused imports). We've marked side-effect files in
  the library to improve this process further.

- Reduces the number of HTTP requests and round-trips required to load the player.
  Ultimately, this speeds up the time it takes for the player to load because your bundler
  can optimize the loading and evaluating time of JavaScript by grouping code into chunks.

- You can easily take advantage of dynamic imports to determine when the browser loads the
  library. You don't want the loading of player-related code to block your users from
  interacting with your application.
