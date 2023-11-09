---
title: 'Repetition'
description: 'Reference – Matching an expression potentially multiple times'
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

Repetitions allow matching an expression multiple times.

## Syntax

```pomsky
let Repetition = AtomExpression RepetitionSuffix*;

let RepetitionSuffix = RepetitionCount RepetitionMode?;

let RepetitionCount =
    | '*'
    | '+'
    | '?'
    | RepetitionBraces;

let RepetitionBraces =
    | '{' Number '}'
    | '{' Number? ',' Number? '}';

let RepetitionMode =
    | 'greedy'
    | 'lazy';
```

See _[AtomExpression](/docs/reference/grammar/#atomexpression)_.

There is a restriction that a `?` and `+` repetitions may not appear immediately after another
repetition (unless the first repetition is followed by `lazy` or `greedy`). This is to prevent
confusion, since `.*?` means a lazy repetition and `.*+` a possessive repetition in regular
expressions.

## Example

```pomsky
.{4,12}
.+ lazy
('test'{3,})?
```

## Support

Repetition is supported in all flavors. In some flavors, repetition is not supported within a
lookbehind assertion.

## Behavior

Every repetition has a lower bound and an optional upper bound. The braces (`{lower,upper}`) are
the canonical way to represent a repetition.

<!-- prettier-ignore -->
| Syntax                   | Lower, upper bound |
| ------------------------ | ------------------ |
| {{<po>}}.{,}{{</po>}}    | 0, infinity        |
| {{<po>}}.{4,}{{</po>}}   | 4, infinity        |
| {{<po>}}.{,10}{{</po>}}  | 0, 10              |
| {{<po>}}.{4,10}{{</po>}} | 4, 10              |
| {{<po>}}.{5}{{</po>}}    | 5, 5               |
| {{<po>}}.?{{</po>}}      | 0, 1               |
| {{<po>}}.*{{</po>}}      | 0, infinity        |
| {{<po>}}.+{{</po>}}      | 1, infinity        |

There are two repetition modes, _greedy_ and _lazy_ repetition. In greedy mode (the default), the
regex engine tries to match the repeated expression as often as possible, whereas in lazy mode, the
regex engines tries to match it as few times as possible.

The default repetition mode can be changed with `enable lazy;` or `disable lazy;`.

## Compilation

Pomsky first determines the lower and upper bound of each repetition. After variable and range
expansion, it may simplify nested repetitions using rules like the following:

- {{<po>}}x{1}{{</po>}} = {{<po>}}x{{</po>}}
- {{<po>}}''{a,b}{{</po>}} = {{<po>}}''{{</po>}}
- {{<po>}}x{a,b}{c}{{</po>}} = {{<po>}}x{a·c,b·c}{{</po>}}
- {{<po>}}x{a}{b,c}{{</po>}} = {{<po>}}x{a·b,a·c}{{</po>}}
- {{<po>}}(x{1,a})?{{</po>}} = {{<po>}}x{0,a}{{</po>}}
- {{<po>}}x{1,a}?{{</po>}} = {{<po>}}x{0,a}{{</po>}}
- {{<po>}}x*{a,b}{{</po>}} = {{<po>}}x*{{</po>}}
- {{<po>}}x{a,b}{c,d}{{</po>}} = {{<po>}}x{a·c,b·d}{{</po>}} if both a and c are 0 or 1

Note that most of these optimizations are only valid if either both repetitions are lazy or both
are greedy.

Pomsky will then produce a maximally compact repetition, using `?`, `+` or `?` if possible, or using
`{n}`, `{n,}` or `{m,n}` otherwise. If the repetition is lazy, another `?` is added. For example,
{{<po>}}'x'{1,} lazy{{</po>}} compiles to `x+?`.

Sometimes the repeated expression must be wrapped in a non-capturing group, e.g.
{{<po>}}'test'_{{</po>}} is compiled to `(?:test)_`.

## Security concerns

Repetition (especially when nested) can be extremely slow, exhibiting exponential runtime, when
executing the regex in a backtracking regex engine. Most regex engines use backtracking.

From the regex flavors supported by Pomsky, only Rust never uses backtracking, so it can guarantee
linear runtime performance with respect to the haystack × regex length.

## History

- Implemented basic optimizations im Pomsky 0.8
- Made `+` following a repetition illegal in Pomsky 0.6
- Made `?` following a repetition illegal in Pomsky 0.3
- Changed the default repetition mode from lazy to greedy in Pomsky 0.3
- Implemented in Pomsky 0.1
