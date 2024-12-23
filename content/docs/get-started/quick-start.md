---
title: 'Quick Start'
description: 'Summary of how to start using Pomsky.'
excerpt: 'Summary of how to start using Pomsky.'
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'get-started'
weight: 6003
toc: true
---

Go to...

<a href="https://playground.pomsky-lang.org/" class="large-action-btn" target="_blank">Playground</a>
<a href="#cli" class="large-action-btn">CLI</a>
<a href="#javascript-plugin" class="large-action-btn">JavaScript</a>
<a href="#rust" class="large-action-btn">Rust</a>

## CLI

The CLI allows you to compile Pomsky expressions in the command line. You can install it by...

- downloading a pre-built binary
- using the shell or PowerShell installer
- using the Windows msi installer
- installing the `@pomsky-lang/cli` NPM module globally
- installing the `pomsky-bin` AUR package
- building from source

See the **[releases page](https://github.com/pomsky-lang/pomsky/releases)** for instructions.

To find out how to use the CLI, run

```
pomsky --help
```

## JavaScript plugin

Pomsky can be used with the npm module [`@pomsky-lang/unplugin`](https://www.npmjs.com/package/@pomsky-lang/unplugin). This is a compiler plugin, usable with Vite / Rollup / Webpack / ESBuild / ESM.

If you're using Vite, add it to your config like this:

```js
import { defineConfig } from 'vite'
import pomsky from '@pomsky-lang/unplugin'

export default defineConfig({
  plugins: [pomsky()],
})
```

Then you can import `*.pom` files from JavaScript/TypeScript:

```js
import myRegex from './myRegex.pom'

myRegex().test('does this string match?')
```

or declare Pomsky expressions with the built-in `pomsky$` macro:

```js
const myRegex = pomsky$(`% [word]{5} %`)

myRegex().test('does this string match?')
```

## Rust macro

If you want to write a Pomsky expression directly in your Rust source code, the
[pomsky-macro](https://crates.io/crates/pomsky-macro) got you covered. Run this command:

```sh
cargo add pomsky-macro
```

Then you can import and use it with

```rs
use pomsky_macro::pomsky;

const MY_REGEX: &str = pomsky!(["great!"] | "great!");
```

Documentation can be [found here](https://docs.rs/pomsky-macro/latest/pomsky_macro/).

## VSCode integration

The [playground](https://playground.pomsky-lang.org/) is the easiest way to start writing Pomsky expressions. However, to edit Pomsky files locally, we recommend installing the [Pomsky extension](https://marketplace.visualstudio.com/items?itemName=pomsky-lang.pomsky-vscode) for VSCode. It provides a lot of convenient features:

- Syntax highlighting
- Underlined errors and warnings
- Auto-completion
- Running unit tests
- Live preview of compiled expression
- Hover tooltips and inlay hints
- Go to definition, find usages
- Refactor/rename variables
