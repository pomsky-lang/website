---
title: 'Intersection'
description: 'Matching multiple things at once'
excerpt: ''
date: 2024-12-19T13:55:00+00:00
lastmod: 2024-12-19T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7016
toc: true
---

A Pomsky expression can be thought of as a _set_ of valid strings. For example, {{<po>}}['abc']{2}{{</po>}} represents the set {aa, ab, ac, ba, bb, bc, ca, cb, cc}. These sets can be infinite, if the expression has an unbounded repetition. And with `|` (an alternation), these sets can be merged. More precisely, {{<po>}}a | b{{</po>}} is the _union_ of `a` and `b`.

Well, if we can create the union of two expressions, can we also create their intersection? This is a tricky question: Because of how regex engines work, we have two different features for this, with different limitations. First, we can use a **lookahead assertion**:

```pomsky
(>> a) b
```

This first checks that `a` matches, then returns to the original position in the string, and continues to match `b`. The problem: It doesn't check if `a` and `b` match with the same length. If `a` and `b` can have different lengths, you need to keep this in mind.

The other way is to use `&`, but it only works if each set is just one codepoint in length. For example:

```pomsky
[Latin] & [Nd]
```

This is the intersection of two character sets – the set of characters in the `Latin` script, and the set of characters in the `Nd` (decimal number) category. Alternatively, we could use the lookahead trick and write

```pomsky
(>> [Latin]) [Nd]
```

However, `&` is more readable, and (depending on the regex engine) more efficient. Moreover, Rust supports `&`, but not `>>`.
