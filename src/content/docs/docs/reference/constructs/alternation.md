---
title: 'Alternation'
description: 'Reference – Matching one of several alternatives'
---

An alternation matches one of several alternatives.

## Syntax

```pomsky
let Alternation = ('|'? Alternatives)?;

let Alternatives = Alternative ('|' Alternative)*;

let Alternative = FixExpression+;
```

See _[FixExpression](/docs/reference/grammar/#fixexpression)_.

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

## Issues

Alternations aren't yet properly optimized. Planned optimizations include:

- Common prefixes: `'test' | 'testament' | 'testing'`#po to
  `test(?:|ament|ing)`#re
- Single char alternation: `'a' | 'c' | '?'`#po to `[ac?]`#re

## History

- Support for leading pipes added in Pomsky 0.6
- Initial implementation in Pomsky 0.1
