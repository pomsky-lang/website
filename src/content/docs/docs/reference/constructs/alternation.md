---
title: 'Alternation'
description: 'Reference – Matching one of several alternatives'
---

An alternation matches one of several alternatives.

## Syntax

```pomsky
let Alternation = ('|'? Alternatives)?;

let Alternatives = Intersection ('|' Intersection)*;

```

See _[Intersection](/docs/reference/constructs/intersection/)_.

Note that an alternation may have a leading pipe. Also note that an alternative may not be empty,
i.e. `| |` is not allowed. Use an empty string instead, e.g. `'foo' | '' | 'bar'`#po.

## Example

```pomsky
| 'hello'
| 'pomsky'+
```

## Support

Alternation is supported in all flavors.

## Behavior

Alternatives are matched consecutively. The first alternative that matches is used.

## Compilation

Compiled to an alternation. The example above would be compiled to `hello|(?:pomsky)+`.

Alternations are subject to advanced optimizations:

- Merging of single-character alternations: `'a' | ['bc']`#po becomes `[a-c]`#re.
- Prefix merging: `'world' | 'wow'`#po becomes `wo(?:rld|w)`#re.
- Empty alternatives: If the first or last alternative is empty, it is replaced with a `?` or `??`
  quantifier.

These alternatives are sometimes combined. There is no guarantee regarding in which order the
optimizations are applied.

## Issues

Merging of alternatives is currently not supported if they are not adjacent.

## History

- Many optimizations added in Pomsky 0.12
- Support for leading pipes added in Pomsky 0.6
- Initial implementation in Pomsky 0.1
