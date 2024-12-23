---
title: 'Intersection'
description: 'Reference – Intersecting character sets'
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

Anything that can be compiled to a single character or character set set can be intersected.

## Syntax

```pomsky
let Intersection = FixSequence ('&' FixSequence)*;

let FixSequence = FixExpression+;
```

See _[FixExpression](/docs/reference/grammar/#fixexpression)_.

## Example

```pomsky
[Letter] & [Nd]
```

## Support

Intersections are supported in JavaScript, Java, Ruby, and Rust. JavaScript requires the [v flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets) a.k.a. `unicodeSets`.

## Behavior

The following kinds of expression can be intersected:

- Character set `[...]`
- Strings with exactly one code point
- Negations and alternations of the above

Like negation, intersection happens late in the compilation process, after variable expansion, and some
optimizations. It unwraps non-capturing groups with only one element.

## Compilation

An intersection is usually compiled to `[<a>&&<b>]`, where `<a>` and `<b>` are the intersected character sets. If they're not negated, the inner brackets are omitted, that is, `[w] & !['d']` is compiled to `[\w&&[^d]]`.

When both character sets are negated, De Morgan's first law is applied, and the character sets are merged:

```pomsky
![a] & ![b]
# becomes
![a b]
```

Pomsky requires that a character set is not empty. One way to create an empty character set is to intersect non-overlapping character sets, e.g. `'a' & 'b'`. This should therefore be forbidden.

## Issues

The detection whether character sets overlap is incomplete; it only works if the sets aren't negated and don't contain special character classes (like `word`) or Unicode properties.

Due to intersection's precedence rules in the parser, it often requires parentheses: `a & b c` is parsed as `a & (b c)`, but since it doesn't work on multiple characters, `(a & b) c` would be more logical. However, it was decided that this is ok, because the parentheses help with readability.

Intersection could be easily extended to support assertions, but this is not yet implemented.

An optimization to remove unnecessary character classes, properties, or ranges, is not yet implemented.

## History

- Initial implementation of intersection in Pomsky 0.12
