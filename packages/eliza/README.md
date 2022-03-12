# Vidstack Eliza

[![package-badge]][package]
[![discord-badge]][discord]

[package]: https://www.npmjs.com/package/@vidstack/eliza
[package-badge]: https://img.shields.io/npm/v/@vidstack/eliza/latest
[discord]: https://discord.com/invite/7RGU7wvsu9
[discord-badge]: https://img.shields.io/discord/742612686679965696?color=%235865F2&label=%20&logo=discord&logoColor=white

Eliza (short for Element Analyzer) is a lightweight CLI tool that parses your TypeScript
files and collects [metadata](./src/meta/component.ts) about your Lit Components. Metadata can be
transformed into whatever output you require via plugins.

The following are some plugins available out of the box:

- **JSON:** Transforms component metadata into JSON format.
- **VSCode:** Transforms component metadata into [VSCode Custom Data](https://github.com/microsoft/vscode-custom-data).

## Install

```bash
$: npm install @vidstack/eliza -D
```

## Usage

First, create a `eliza.config.ts` file at the root your project directory and include some plugins...

```ts
// FILE: eliza.config.ts

import { jsonPlugin, vscodeHtmlDataPlugin } from '@vidstack/eliza';

export default [jsonPlugin(), vscodeHmlDataPlugin()];
```

Next, simply run the `analyze` command:

```bash
$: eliza src/**/*.ts
```

For more information call `eliza analyze -h` to see what arguments are available.

## Documenting

````ts
/**
 * Description about my component here.
 *
 * @tagname my-element
 * @slot Used to pass in additional content inside (default slot).
 * @slot another-slot - Used to pass content into another part.
 * @csspart root - The component's root element.
 * @cssprop --my-component-bg - The background color of the component.
 * @example
 * ```html
 * <my-component></my-component>
 * ```
 * @example
 * ```html
 * <!-- Hidden. -->
 * <my-component hidden></my-component>
 * ```
 */
export class MyElement extends LitElement {
  /**
   * Whether the component is hidden.
   */
  @property({ type: Boolean }) hidden = false;

  /**
   * The size of the component.
   *
   * @deprecated - Use `size` instead.
   */
  @property({ attribute: 'size' }) sizing: 'small' | 'big' = 'small';

  /**
   * The current size of the component - example of a `readonly` property.
   */
  get currentSize(): 'small' | 'big' {
    return this.size;
  }

  /**
   * Call this method to show the component.
   */
  onShow() {
    // ...
  }

  /**
   * `protected` and `private` methods will not be included in `ComponentMeta`.
   *
   * You can also hide metadata by adding the following tag...
   *
   * @internal - For private use... don't touch!
   */
  protected internalMethod() {
    // ...
  }
}
````

## Plugins

```ts
export interface Plugin {
  /**
   * The name of the plugin.
   */
  name: string;

  // *** PHASE 1 ***

  /**
   * Optional - Called when initializing the plugin, receives the TypeScript `Program` as an
   * argument.
   */
  init?(program: Program): Promise<void>;

  /**
   * Optional - Called immediately after the `discover` and `build` steps. It's a chance for you
   * to query/add/update/delete any component metadata.
   */
  postbuild?(
    component: ComponentMeta,
    sourceFile: SourceFile,
  ): Promise<ComponentMeta | null | undefined | void>;

  // *** PHASE 3 ***

  /**
   * Optional - Links/merges heritage (mixins/subclasses/interfaces) metadata with its respective
   * component metadata. It's important to note that there's a base `link` process that'll do this
   * out of the box which will run before any plugin `link` step.
   */
  link?(
    component: ComponentMeta,
    heritage: HeritageMeta,
    sourceFile: SourceFile,
    sourceFiles: SourceFile[],
  ): Promise<ComponentMeta | null | undefined | void>;

  /**
   * Optional - Called immediately after ALL plugins complete their `link` step. Similar to
   * `postbuild`, it's a chance for you to query/add/update/delete any component metadata.
   */
  postlink?(
    component: ComponentMeta,
    sourceFile: SourceFile,
    sourceFiles: SourceFile[],
  ): Promise<ComponentMeta | null | undefined | void>;

  // *** PHASE 4 ***

  /**
   * Optional - Receives the final component metadata collection and transforms it.
   */
  transform?(
    components: ComponentMeta[],
    sourceFiles: Map<ComponentMeta, SourceFile>,
  ): Promise<void>;

  // *** PHASE 5 ***

  /**
   * Optional - Called when destroying the plugin.
   */
  destroy?(): Promise<void>;
}
```
