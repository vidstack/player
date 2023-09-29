Locally installing the package via [NPM](https://docs.npmjs.com/about-npm) is best when you're
integrating the library with build tools such as Parcel, Rollup, Vite, or Webpack. We ship both an
un-optimized development bundle that includes logs, and a production bundle that is specially
minified to get the bundle size as small as possible. Thanks to
[Node package exports](https://nodejs.org/api/packages.html#package-entry-points)
your bundler will automatically load the correct type based on the Node process environment `NODE_ENV`.
