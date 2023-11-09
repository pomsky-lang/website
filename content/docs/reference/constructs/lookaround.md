---
title: 'Lookaround'
description: 'Reference – Assert what appears before or after a position'
excerpt: ''
date: 2023-10-23T09:31:00+00:00
lastmod: 2023-10-23T09:31:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'constructs'
weight: 8201
toc: true
---

Lookarounds assert that a certain expression matches before or after the current position. As an
assertion, a lookaround does not contain any text; it matches _between_ two code points.

## Syntax

```pomsky
let Lookaround = LookaroundPrefix Expression;

let LookaroundPrefix =
    | '<<'
    | '>>';
```

See _[Expression](/docs/reference/grammar/#expression)_.

A lookaround must be wrapped in parentheses if it is followed by another expression:

```pomsky
(>> [word]) [Greek]
```

Note that a lookaround contains an expression, so it introduces a new scope and can include
statements.

## Example

```pomsky
(!<< [w])
(>>
  disable unicode;
  let aw = [w];
  aw{3}
)
```

## Support

Support for lookaround is gated by the `lookahead` and `lookbehind` features. Specify features with
the `--allowed-features` option.

Lookahead is supported almost everywhere. Lookbehind support is more limited:

### PCRE

PCRE does not support arbitrary-length lookbehind. PCRE must be able to determine the length of
the lookbehind in advance, so {{<po>}}<< 'foo'{3}{{</po>}} works, but {{<po>}}<< 'foo'+{{</po>}}
does not. PCRE has a special case that a lookbehind containing an alternation works even if the
alternatives have different lengths, but each alternative must be constant-length.

### JavaScript

JavaScript fully supports lookahead and lookbehind. However, lookbehind is still unsupported in
some older browsers (notably, Safari up to version 16.3).

### Java

Before Java 13, repetition in lookbehind was required to be _finite_, `*` and `+` did not work.
Since Java 13, repetition can be unbounded, but may not correctly handle repetition with multiple
quantifiers if one of them is unbounded. Lookbehind also may not contain backreferences.

### Python

Python supports lookahead and _constant-length_ lookbehind. Repetitions and alternations like
{{<po>}}<< 'a' | 'bb'{{</po>}} are forbidden in lookbehind.

### Ruby, .NET

Full support for both lookahead and lookbehind

### Rust

Lookaround not supported

## Behavior

Lookahead checks if the contained expression matches at the current position. If it matches, the
lookahead succeeds, otherwise it fails. Lookahead can be negated. A negative lookahead succeeds if
the expression does _not_ match. After the lookahead succeeded, the regex engine returns to the
position in the string where it was before the lookahead, so the string matching the lookahead is
not consumed.

Conceptually, lookbehind works in the same way, except that the expression is matched in reverse
direction against the text preceding the current position. In reality, however, many regex engines
do not match in reverse direction but go back _n_ characters and check if the next _n_ characters
match the lookbehind.

## Compilation

- `>> ...` is compiled to `(?=...)`
- `!>> ...` is compiled to `(?!...)`
- `<< ...` is compiled to `(?<=...)`
- `!<< ...` is compiled to `(?<!...)`

## Issues

The various limitations on lookbehind by different regex engines are not enforced at the moment.

## Security concerns

Lookbehind can be slow in some regex engines.

## History

Initial implementation in Pomsky 0.1
