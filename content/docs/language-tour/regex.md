---
title: 'Inline regular expressions'
description: 'Insert text in the output regex with no escaping'
excerpt: ''
date: 2022-09-20T13:55:00+00:00
lastmod: 2022-09-20T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 212
toc: true
---

Although Pomsky on its own is very powerful, there might be situations where its syntax is not expressive
enough. In these rare situations, Pomsky has an escape hatch: The `regex` keyword allows specifying
an expression that is embedded in the output verbatim, without escaping:

```pomsky
regex 'hello|world?'
```

This emits the following regular expression:

```regexp
hello|world?
```

Note that this is **dangerous** and should be used only when absolutely necessary. Pomsky does not parse
the content of `regex` expressions, so it cannot ensure that it is valid.

## Regex expressions containing pipes

Pomsky doesn't know whether a `regex` expression contains pipes, and whether it is necessary to wrap it in
a group when embedding it in a larger pomsky expression. For example:

```pomsky
'a' regex 'b|c'
```

What do you expect the output to be? If you think that this should produce `a(?:b|c)`, you are mistaken.
The output is:

```regexp
ab|c
```

To get the expected output, a group must be added:

```pomsky
'a' regex '(?:b|c)'
```

The same can be achieved by adding parentheses outside like this:

```pomsky
'a' (regex 'a|b')
```

Although Pomsky usually removes redundant parentheses, these parentheses are not removed because Pomsky
can't tell if they're needed, so it trusts you to add them only when required.

## Repeated `regex` expressions

Pomsky wraps a `regex` expression in a group if it is followed by a repetition. For example:

```pomsky
regex 'test.'?
```

This returns:

```regexp
(?:test.)?
```

If this is not desired, include the repetition in the string literal:

```pomsky
regex 'test.?'
```
