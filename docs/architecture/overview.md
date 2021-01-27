# Vidstack Player `1.x`

**THIS DOCUMENT IS A WORK IN PROGRESS.**

Vidstack Player exists to simplify the process of integrating media with a custom player into a 
web application. The main benefits are that it provides a unified API across multiple providers, 
and the foundational components required to easily build and design the player interface.

## Design Goals

- **Composable.** All components should be easily used independently or in any valid configuration
  together. There should be minimal template lock-in or cross-component dependencies.
- **Modular.** Use only what you need and discard what you don't.
- **Extendable.** Make it easy to add what we haven't included out of the box, or to transform what
  we give you into what you need.
- **Ergonomic.** Frontend developers who are involved with styling components are typically more
  comfortable with HTML/CSS than they are with JS, and usually prefer to achieve their styling
  objectives without it. Offering them an ergonomic declarative way to customize components,
  and style them without any JS would allow them to achieve their objectives much more efficiently
  and comfortably.
- **Ready.** For everyday users wanting to get up and running ASAP there should be clean and
  simple defaults out of the box.
- **Lightweight.** To avoid delaying page loads or time to first frame for the user, the library
  should be as light as possible. Preferably less than ~30kB.
- **Accessible.** Anyone should be able to use the player at its utmost potential, regardless of
  any external factors such as disabilities or network connection.
- **Universal.** The player should be able to be rendered on both the client-side (CSR) and
  server-side (SSR), integrable with any frontend stack/framework, and function appropriately 
  across all devices/screens.
- **Modern.** The player should be built for the modern web and avoid bloated polyfills and outdated
  environments as much as possible. This only leads to technical bloat and time wasted. It will not
  support older browsers and will only target modern evergreen browsers that fully implement the
  Custom Elements V1 specification, e.g. Chrome, Firefox, Safari.
- **Testable.** All aspects of the player should be built with testability in mind. A comprehensive
  set of tests covering unit, visual, visual regression and integration are required to minimize bugs
  and regressions.
  
### What's changing from Vime `5.x`?

- **Get Lit 🔥.** Prefer a lightweight alternative to Stencil such as LitElement to:
  - Avoid heavy compilation/transpilation steps and processes.
  - Reduce library size (Stencil currently ships ~50kB of base framework
    code - [relevant?](https://twitter.com/adamdbradley/status/1349089465197862913)).
  - Have more control over package build and distribution.
  - Employ better design patterns when needed that are not allowed in Stencil such as inheritance.
  - [Go buildless](https://open-wc.org/guides/developing-components/going-buildless) to
    simplify tooling/processes around development/building/testing/packaging.
  - Make it easier for contributors as no knowledge of JSX is required with LitElement.
- The data flow between player, provider and UI will need to be assessed and improved.
- Features such as boot strategy (controls when/how providers are loaded) are not possible in v5
  because the player doesn't control the rendering of the provider. In addition there are
  inconsistencies with how providers are loaded because some logic is split between the player
  and the provider. Most logic will need to be housed in the player for better consistency.
- Simplify the process of designing custom components and reduce opinionated designs that cause
  developers to fight the system. In other words provide naked/functional components that the developer
  can do whatever they want with.
- Rethink integration packages and focus on a strong foundation, considering only what's
  necessary. The web has evolved and most modern frameworks completely support web components.
- Currently there is no way to tell whether an event was initiated by the provider
  or user. To enable devs to build out features like analytics on top of the player we'll need to
  improve/expand the events API, and clearly differentiate between provider/user initiated events.

## Project Structure

The following references have been used in determining an adequate project structure:

- [Carbon Design System - Web Components](https://github.com/carbon-design-system/carbon-web-components)
- [Adobe Spectrum - Web Components](https://github.com/adobe/spectrum-web-components)

### Folder Organization

- `src/bundle` → The bundle directory is the main entry point that exports all the public
  entities (classes, interfaces, components, types etc.).
  - `src/bundle/index.ts` → Exports all side-effect free code that doesn't register any
    elements in the `Window` custom elements registry.
  - `src/bundle/elements.ts` → Exports all code that is not side-effect free which
    registers all elements in the custom elements registry.
- `src/core` → This directory contains any functionality that is at the top of the player
  hierarchy such as the `Player` component.
- `src/providers` → This directory contains components/code that are responsible for
  loading players/media.
- `src/ui` → This directory contains components/code that are rendered in the browser
  generally for the end-user to interact with.
- `src/skins` → This directory contains components that are an amalgamation of UI components
  to build an out of the box look/style for the player which includes themes and icons.
- `src/utils` → This directory contains common helper functions that are used throughout the player.

### Packaging

The library will be bundled and released as a single package under the `@vidstack/player` package 
name. We have contemplated releasing all packages under their own namespace such as 
`@vidstack/player`, `@vidstack/youtube`, or `@vidstack/mute-toggle` but there seems to be no 
inherit value of doing so as no use-case has been identified for multiple NPM packages yet. 
Furthermore, there's no way to split the library in any meaningful way as all components are bound 
to the player component in one way or another. Splitting the library into multiple packages will 
only add more noise to the build/release process.

Here's a few examples of how modules can be imported:

- `import '@vidstack/player/bundle/elements'` → This will import all components and register
them in the `Window` custom elements registry.
- `import { Player, MuteToggle } from '@vidstack/player/bundle'` → This will import entities without 
registering them in the custom elements registry.
- `import '@vidstack/player/core/vds-player'` → This will import only the player component and 
register it.
- `import '@vidstack/player/skins/default/vds-default'` → This will import only the default UI skin 
and register it.

These import paths are made possible thanks to the [exports][node-exports] field in `package.json`. 
This field is available in Node 12+ and allows defining entry points of a package when imported by 
name, loaded either via a `node_modules` lookup or a self-reference to its own name. This means 
instead of `@vidstack/player/dist/bundle` we can import via `@vidstack/player/bundle` .

Furthermore, [conditional exports][node-conditional-exports] will enable multiple entry points 
depending on certain conditions, such as providing different ES module exports for `require` 
and `import` . This is primarily useful for providing SSR friendly bundles.

[node-exports]: https://nodejs.org/api/packages.html#packages_exports
[node-conditional-exports]: https://nodejs.org/api/packages.html#packages_conditional_exports

### Component Anatomy

- _{component-name}_
  - index.ts
  - vds-_{component-name}_.ts
  - _{component-name}_.stories.ts
  - _{component-name}_.styles.ts
  - test
    - _{component-name}_.test.ts
    - _{component-name}_.benchmark.ts

## Architecture

See [architecture.md](./architecture.md) and [player-api.md](./player-api.md).

### UI Design Patterns

See [ui-patterns.md](./ui-patterns.md).

### Framework Integrations

To help our adoptors to test and integrate the player we'll support React due to it's popularity 
and lack of support for custom web components. This will hopefully be near the tail end of the 
the `1.0` release. Other frameworks are not considered at this time to reduce maintanence costs, 
and the web has evolved so most of them already [support custom elements][custom-el-everywhere]. 
Hopefully it can become a community driven effort to support more frameworks such as Angular, Vue 
and Svelte.

React requires the following support for non-intrinsic elements:

- Element attributes mapping to non-string element property values (e.g. Boolean attributes).
- React props mapping to element props instead of element attributes.
- Handling custom events.

**How?**

Most likely by parsing component files for `@property()` and `@event()` decorators or using a 
[custom elements manifest][custom-el-manifest] generator, and then using this information 
to automatically generate React wrappers that will be located in `dist/react` and imported 
as regular React components such as `import { Player } from '@vidstack/player/react'`.

We could also consider adding stories for React integrations so we can test them and showcase 
their usage.

**SSR?**

As web components at this time don't support SSR, and `lit-element` and `lit-html` 
don't have CJS exports we'll need to create a SSR friendly bundle for React. The 
components in this bundle will simply render elements in the DOM with the correct attributes and be 
exported via CJS. This can be located at `dist/react-ssr`. See this [example][carbon-react-ssr] 
from Carbon Web Components.

Conditional exports in Node can be used to require the correct files when importing them 
server-side vs. client-side.

**References**

- [`createReactCustomElementType.ts`][create-react-el]
- [Carbon React Support PR][carbon-react-support]

[custom-el-manifest]: https://github.com/webcomponents/custom-elements-manifest
[carbon-react-support]: https://github.com/carbon-design-system/carbon-for-ibm-dotcom/pull/3475
[custom-el-everywhere]: https://custom-elements-everywhere.com
[create-react-el]:https://github.com/carbon-design-system/carbon-web-components/blob/master/src/globals/wrappers/createReactCustomElementType.ts
[carbon-react-ssr]: https://cdn.jsdelivr.net/npm/carbon-web-components@1.11.1/lib/components-react-node/button/button.js

### SSR

There are many reasons/advantages as to why someone might decide to render content server-side, 
this [article][goog-rendering-web] by Google deep dives into rendering on the web.

At this time web components are not SSR friendly because: 

> Rendering web components on the server is not possible because there is no way to declaratively
> represent shadow roots and their content in HTML — or to attach them to a host — without executing
> imperative JavaScript on the client.

and...

> Historically, it has been difficult to use Shadow DOM in combination with Server-Side Rendering 
> because there was no built-in way to express Shadow Roots in the server-generated HTML. There are 
> also performance implications when attaching Shadow Roots to DOM elements that have already been 
> rendered without them. This can cause layout shifting after the page has loaded, or temporarily 
> show a flash of unstyled content ("FOUC") while loading the Shadow Root's stylesheets.

However, [Declarative Shadow DOM][declarative-shadow-dom] removes these limitations and is coming 
in Chrome 88 with a simple [polyfill][declarative-shadow-dom-polyfill] also available. Thus, 
an SSR friendly bundle is possible now when using raw web-components but with LitElement the 
picture could be a little different...

**Solution**

This is still a **WIP** and but it might require using [LitElement 3.0 and LitHTML 2.0][lit-3].

[lit-3]: https://www.polymer-project.org/blog/2020-09-22-lit-element-and-lit-html-next-preview
[lit-ssr-quarter]: https://twitter.com/justinfagnani/status/1088218448570785797
[lit-ssr-repo]: https://github.com/PolymerLabs/lit-ssr
[declarative-shadow-dom]: https://web.dev/declarative-shadow-dom/
[declarative-shadow-dom-polyfill]: https://web.dev/declarative-shadow-dom/#polyfill
[goog-rendering-web]: https://developers.google.com/web/updates/2019/02/rendering-on-the-web#wrapup

### Internationalization (i18n)

Due to the core UI being functional components that don't contain any styling or text, i18n 
will become the responsibility of [skins](#skins) and potentially media providers.

### Skins

A Skin is an amalgamation of UI components, icons and themes to create an out of the box style/s
for the player. As noted, UI components will be naked functional components. For example, 
a `MuteToggle` will handle setting ARIA attributes and updating the muted state of the 
player when pressed, but no true structure/styling. Therefore, these components can be used to 
build out multiple skins.

**Icons**

A Skin can also include a set or multiple sets of icons which can then be loaded locally or from 
a CORS-enabled endpoint (eg: CDN). Icons should be placed in the `icons/` directory inside the 
root of the skin directory such as `*/skins/default-skin/icons/{icon-name}.svg`.

See the [`IconLibrary`][vime-icon-lib] component in Vime `5.x` as an example of how icons will be 
loaded and used throughout the player.

[vime-icon-lib]: https://github.com/vime-js/vime/tree/master/core/src/components/ui/icon-library

**Themes**

A Skin can use [CSS Custom Properties][css-props] to enable personalization/customization. A 
set of default looks/styles for the skin can be included as a theme, which is a `.css` file 
that contains preset values for the available CSS properties of that skin. Themes should be placed 
in the `themes/` directory inside the root of the skin directory such as 
`*/skins/default-skin/themes/{theme-name}.css`.

[css-props]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*

**i18n**

This is a **WIP** as all skins will generally include some text that should be localized. A
`I18N` component could be created and subclassed by a skin which generally includes a 
`translations` map and `language` key. Potentially a `lang/` directory could be created at the 
root of skin directory to make multiple locales available out of the box.

### Testing

**WIP**

- Benchmark - [Tachometer](https://github.com/Polymer/tachometer)
- Visual Manual - [Storybook](https://storybook.js.org/)
- Visual Regression - [Pixelmatch](https://github.com/mapbox/pixelmatch) / [CI Artifacts](https://docs.github.com/en/free-pro-team@latest/actions/guides/storing-workflow-data-as-artifacts)
- Unit - Open WC [Test Runner](https://open-wc.org/guides/developing-components/testing/#web-test-runner) and [Helper Package](https://open-wc.org/docs/testing/testing-package/)
- Integration - [Cypress](https://www.cypress.io/)?
- [Browser Stack](https://www.browserstack.com/)?

### Publish

✅ Follow Open WC [recommendations on publishing][open-wc-publish].

This project doesn't require any special build tools or preprocessors outside of 
TypeScript. The code is bundled as an ESM module targeting ECMAScript version `ESNext`. The 
general concept is that building is an [application-level concern][open-wc-app-level-concern].

[open-wc-publish]: https://open-wc.org/guides/developing-components/publishing
[open-wc-app-level-concern]: https://open-wc.org/guides/developing-components/publishing/#general-concept-building-is-an-application-level-concern

### Documentation

**WIP**

### Examples

**WIP**

- [Stackblitz](https://stackblitz.com/)

### Release

**WIP**
