---
title: 'Dot'
description: 'Reference – Matching an arbitrary code point except a line break'
---

The dot matches an arbitrary code point except a line break. In multiline mode, the dot also matches
line breaks.

## Syntax

```pomsky
let Dot = '.';
```

## Example

```pomsky
.{4,12}
```

## Support

The dot is supported in all flavors.

In .NET, the dot matches a UTF-16 code unit rather than a full code point, so a character outside
the Basic Multilingual Plane matches two dots (`..`).

Support for the dot is gated by the `dot` feature. Specify features with the `--allowed-features`
option.

## Behavior

The dot matches a single code point (except in .NET, see above), but not a line break.

Regex engines disagree on what constitutes a line break character. This is
[explained here](https://www.regular-expressions.info/dot.html#linebreak) in detail. To get the
same behavior everywhere, use `![n]` or `![v]` instead.

When _multiline mode_ is enabled in the regex engine, the dot matches every code point, including
line breaks.

## Compilation

The dot is compiled to `.`.

## Issues

Regex engines disagree on what constitutes a line break character, so the dot is not really
portable.

## History

Added in Pomsky 0.8
