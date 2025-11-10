---
title: 'Intersection'
description: 'Reference – Intersection of character sets'
---

It's possible to matche the intersection of several character sets, using the `&` operator.

## Syntax

```pomsky
let Intersection = '&'? Sequence ('&' Sequence)*;

let Sequence = FixExpression+;
```

See _[FixExpression](/docs/reference/grammar/#fixexpression)_.

Only character sets – and variables that resolve into character sets – can be intersected. The character sets can be negated.

Intersection has a higher operator precedence than alternation: `"test" | [Greek] & [Nd]`#po is parsed as `"test" | ([Greek] & [Nd])`#po.

## Example

```pomsky
[Nd] & [Greek]
[Nd] & ![Greek]
```

## Support

Intersection is supported in the JavaScript, Java, Ruby, and Rust flavors. In JavaScript, the
[v flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets)
is required for intersection to work.

Support for intersection is gated by the `intersection` feature. Specify features with the
`--allowed-features` option.

## Behavior

An intersection of two expression matches a text if both expressions match. Therefore, `A & B`#po
is equivalent to `(>> A) B`#po.

## Compilation

Intersection is compiled to an intersecting character class. For example, `[w] & [n]`#po is compiled to
`[\w&&\n]`#re. `[w] & ![n]`#po is compiled to `[\w&&[^\n]]`#re.

## Issues

- Intersection could be polyfilled in more regex flavors using lookahead, but this is not done at the moment.
- Intersection of an alternation is not allowed even if it would be optimized to a character class.
- Assertions (anchors, lookarounds) are not allowed in an intersection, even though they could be supported.

## History

- Initial implementation in Pomsky 0.12
