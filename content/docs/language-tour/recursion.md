---
title: 'Recursion'
description: 'Match arbitrarily nested expressions'
excerpt: ''
date: 2024-12-20T11:55:00+00:00
lastmod: 2024-12-20T11:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7017
toc: true
---

What if you want to match a nested mathematical expression, like `((1 + 2) / 5) * (-3)`? This requires _recursion_ if we want to support arbitrary nesting. A way to implement this is

```pomsky
let spaces = ' '*;
let number = '-'? [d]+;

(number | '(' recursion ')')
(spaces ['+-*/'] spaces recursion)*
```

Anywhere the `recursion` keyword appears, the entire expression is recursively matched again.

Note that recursion is currently only supported in the PCRE and Ruby flavors.
