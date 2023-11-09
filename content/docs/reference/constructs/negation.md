---
title: 'Negation'
description: 'Reference – Negating what an expression matches'
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

Anything that can be compiled to a lookaround, word boundary, or a character set can be negated.

## Syntax

```pomsky
let Negation = '!' FixExpression;
```

See _[FixExpression](/docs/reference/grammar/#fixexpression)_.

## Example

```pomsky
let no_boundary = !%;
!no_boundary (!>> !'a')
```

## Support

Negation is supported in all flavors.

## Behavior

The following kinds of expression can be negated:

- Word boundary `%`
- Lookarounds `<<`, `>>`
- Character set `[...]`
- Strings with exactly one code point
- Negations

Negation happens late in the compilation process, after variable and range expansion, and some
optimizations. It unwraps non-capturing groups with only one element.

Arbitrary nesting is allowed; `!!x` is equivalent to `x`, if `x` is negatable.

## Compilation

Negated word boundaries are compiled to `\B`. In JavaScript, this requires that Unicode is disabled.
Negative lookbehind is compiled to `(?<!...)`, negative lookahead is compiled to `(?!...)`.
Negative character sets are compiled to `[^...]`. When a character set contains exactly one
shorthand, we try to just negate the shorthand to remove the character set; for example, `![s]`
can be compiled to `\S`.

Pomsky requires that a character set is not empty. `[]` is rejected at the syntax level. Another way
to create an empty character set is to negate a full character set, e.g. `![s !s]`. This must
therefore forbidden.

## Issues

Detecting full character sets is not yet implemented properly. The current implementation only
rejects some common cases, like `![w !w]`, but fails to reject `![w !d]`, for example.

Negation currently does not work for alternations like `!('a' | 'c')`.

## History

- Negation changed to a late compilation step in Pomsky 0.11
  - `!` syntactically allowed everywhere
  - resolved after variable and range expansion
  - can unwrap groups and turn single-char strings into character sets
  - arbitrary nesting of negations
- Initial implementation in Pomsky 0.1
  - `!` syntactically only allowed before `%`, `<<`, `>>`, and `[`
  - no double negation
