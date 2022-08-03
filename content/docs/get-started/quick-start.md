---
title: 'Quick Start'
description: 'Summary of how to start using pomsky.'
excerpt: 'Summary of how to start using pomsky.'
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'get-started'
weight: 102
toc: true
---

## Playground

Using [the playground](https://playground.pomsky-lang/) is the easiest and most convenient
way to get started using pomsky. It supports syntax highlighting and shows errors directly in your
code.

## CLI

The CLI allows you to compile pomsky expressions to regexes in the command line.

### Use pre-built binaries

Binaries are available for Windows, Linux and macOS. Download them from the
[releases page](https://github.com/rulex-rs/pomsky/releases).

### Use AUR package

On Arch Linux, you can use the [AUR package](https://aur.archlinux.org/packages/pomsky-bin) with

```sh
yay -S pomsky-bin
```

### Install from source

This requires that a recent Rust toolchain is installed. Instructions for how to install Rust can be
found [here](https://www.rust-lang.org/tools/install).

Install the CLI with

```
cargo install pomsky-bin
```

### Get help

To find out how to use the CLI, run

```
pomsky --help
```

## Rust macro

If you want to write a pomsky expression directly in your Rust source code, the
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
