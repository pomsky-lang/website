---
title: 'Formal grammar'
description: "Pomsky's syntax specification"
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'reference'
weight: 8001
toc: true
---

## Summary

This document uses Pomsky syntax to describe Pomsky's syntax. Here's an incomplete summary,
which is enough to read the grammar:

- Variables are declared as {{<po>}}let var_name = expression;{{</po>}}. This means that `var_name`
  can be parsed by parsing `expression`.

- Verbatim text is wrapped in double quotes ({{<po>}}""{{</po>}}) or single quotes
  ({{<po>}}''{{</po>}}).

- <!-- prettier-ignore -->
  A {{<po>}}*{{</po>}} after a rule indicates that it repeats 0 or more times.

- A {{<po>}}+{{</po>}} after a rule indicates that it repeats 1 or more times.

- A {{<po>}}?{{</po>}} after a rule indicates that the rule is optional.

- Rules can be grouped together by wrapping them in parentheses ({{<po>}}(){{</po>}}).

- Alternative rules are each preceded by a vertical bar ({{<po>}}|{{</po>}}).

## Formal grammar

Comments start with `#` and end at the end of the same line. Comments and whitespace are ignored;
they can be added anywhere between tokens. Tokens are

- identifiers (e.g. `foo`)
- keywords and reserved words (e.g. `lazy`)
- operators and punctuation (e.g. `<<` or `;`)
- numbers (e.g. `30`)
- string literals (e.g. `"foo"`)
- codepoints

as [documented here](/docs/reference/tokens/) in detail.

### Note about this grammar

Even though this grammar is written using Pomsky syntax, it isn't actually accepted by the Pomsky
compiler, because it uses cyclic variables.

### Expression

```pomsky
let Expression = Statement* Alternation;
```

See _[Alternation](/docs/reference/constructs/alternation/)_.

### Statement

```pomsky
let Statement =
    | LetDeclaration
    | Modifier
    | Test;
```

See _[LetDeclaration], [Modifier], [Test]_.

[LetDeclaration]: /docs/reference/constructs/variables
[Modifier]: /docs/reference/constructs/modifier
[Test]: /docs/reference/constructs/tests/

### FixExpression

An expression which can have a prefix or suffix.

```pomsky
let FixExpression =
    | Lookaround
    | Negation
    | Repetition;
```

See _[Lookaround], [Negation], [Repetition]_.

[Lookaround]: /docs/reference/constructs/lookaround
[Negation]: /docs/reference/constructs/negation
[Repetition]: /docs/reference/constructs/repetition

### AtomExpression

```pomsky
let AtomExpression =
    | String
    | CodePoint
    | Group
    | CharacterSet
    | InlineRegex
    | Boundary
    | Reference
    | NumberRange
    | Variable
    | Dot
    | Recursion;
```

See _[String], [CodePoint], [Group], [CharacterSet], [InlineRegex], [Boundary], [Reference], [NumberRange], [Dot], [Recursion]_.

[String]: /docs/reference/tokens/#string
[CodePoint]: /docs/reference/tokens/#codepoint
[Group]: /docs/reference/constructs/group
[CharacterSet]: /docs/reference/constructs/charset
[InlineRegex]: /docs/reference/constructs/inline-regex
[Boundary]: /docs/reference/constructs/boundary
[Reference]: /docs/reference/constructs/reference
[NumberRange]: /docs/reference/constructs/number-range
[Dot]: /docs/reference/constructs/dot
[Recursion]: /docs/reference/constructs/recursion
