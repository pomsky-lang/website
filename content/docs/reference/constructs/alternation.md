---
title: 'Alternation'
description: 'Reference – Matching one of several alternatives'
excerpt: ''
date: 2023-10-23T09:31:00+00:00
lastmod: 2023-10-23T09:31:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'constructs'
weight: 4
toc: true
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
i.e. `| |` is not allowed. Use an empty string instead, e.g. {{<po>}}'foo' | '' | 'bar'{{</po>}}.

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

- Common prefixes: {{<po>}}'test' | 'testament' | 'testing'{{</po>}} to
  {{<regexp>}}test(?:|ament|ing){{</regexp>}}
- Single char alternation: {{<po>}}'a' | 'c' | '?'{{</po>}} to {{<regexp>}}[ac?]{{</regexp>}}

## History

- Support for leading pipes added in Pomsky 0.6
- Initial implementation in Pomsky 0.1
