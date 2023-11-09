---
title: 'Recursion'
description: 'Recursion – Recursively match the entire expression'
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

Recursion allows you to recursively match the entire expression.

## Syntax

```pomsky
let Recursion = 'recursion';
```

## Example

One can parse mathematical terms with the following:

```pomsky
let op = ['+-*/'];
let num = [digit]+;

'-'? (num | '(' recursion ')') atomic(op recursion)*
```

Care is needed to avoid ambiguity when possible, to prevent infinite recursion or excessive
backtracking.

## Support

Recursion is only supported in PCRE and Ruby.

Support for recursion is gated by the `recursion` feature. Specify features with the
`--allowed-features` option.

## Behavior

When a recursion expression is encountered, the regex engine saves the state of the match and starts
over matching the whole regular expression at the current position. When the match succeeds, it
restores the previous state and continues. Repeated recursions form a _stack_, similar to how
recursion works in programming languages. It is possible to backtrack from/into recursion; this
can be limited with atomic groups.

## Compilation

Recursion compiles to `\g<0>`, which is equivalent to calling the 0'th capturing group as
subroutine, since regex engines implicitly create a capturing group with index `0` containing the
whole match.

## Issues

Pomsky does not detect infinite recursion. Recursion can also cause excessive backtracking.

## History

- Added recursion in Pomsky 0.11
