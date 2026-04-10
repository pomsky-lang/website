---
title: 'Modifier'
description: 'Reference – Change how the expression should be treated'
---

Modifiers change how the following expression should be treated.

## Syntax

```pomsky
let Modifier = ModifierKeyword BooleanSetting ';';

let ModifierKeyword =
    | 'enable'
    | 'disable';

let BooleanSetting =
    | 'lazy'
    | 'unicode';
```

## Example

```pomsky
enable lazy;
disable unicode;

[w]*
(
  disable lazy;
  .+
)
```

## Support

Modifiers are supported in all flavors.

Support for each mode is gated by the `lazy-mode` and `ascii-mode` features. Specify features with
the `--allowed-features` option.

## Behavior

Modes can be enabled and disabled in any scope.

There are two modifiers that can be enabled or disabled:

### Lazy

Enabling lazy mode means that all repetitions in the same scope are lazy by default; opting out
is done with the `greedy` keyword, e.g.

```pomsky
enable lazy;

[w]* greedy
```

### Unicode

Unicode mode is enabled by default. Disabling it means that the expression in the same scope
is no longer Unicode aware and assumes an ASCII-only input. As a result, shorthand character classes
are compiled differently (e.g. `[space]` is compiled to `[ \t-\r]`), and Unicode properties (e.g.
`[Greek]`) are unavailable. Non-ASCII strings and code points are still allowed.

In JavaScript, Unicode must be disabled in order to use `%`, `<` and `>` word boundaries.

Disabling Unicode can vastly improve runtime performance, especially for `[word]` and `[digit]`.
Alternatively, you can use `[ascii_word]`, `[ascii_digit]`, and so on.

## Compilation

Modifiers produce no output, but they change how other expressions are compiled.

## Issues

The dot and word boundaries are Unicode-aware in some regex engines even when Unicode mode is
disabled.

Some mode modifiers are not yet implemented, most importantly `ignore_case`, `single_line` and
`multi_line`.

## History

- Hygiene of modifiers fixed in Pomsky 0.12
- Non-Unicode mode added in Pomsky 0.10
- Lazy mode added in Pomsky 0.3
