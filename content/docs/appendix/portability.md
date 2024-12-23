---
title: 'Portability'
description: 'See how portable Pomsky expressions are'
excerpt: ''
date: 2024-12-23T13:21:58+00:00
lastmod: 2024-12-23T13:21:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'appendix'
weight: 10004
toc: true
---

Pomsky aims to be as portable as possible, polyfilling Unicode and unsupported features where feasible. That said, there are some cases where portability is not possible:

- Some features (e.g. lookaround, backreferences, Unicode properties) aren't supported in every flavor. Pomsky fails to compile when you're using an unsupported feature.

- `\b` (word boundaries) are not Unicode aware in JavaScript. Pomsky therefore only allows word boundaries when Unicode is disabled.

- `\w` in .NET handles Unicode incorrectly, with no way to polyfill it properly. This means that in .NET, `[word]` only matches the `L`, `Mn`, `Nd`, and `Pc` general categories, instead of `Alphabetic`, `M`, `Nd`, `Pc` and `Join_Control`.

- In .NET, `.`, `Codepoint` and character classes (e.g. `[Latin]`) only match a single UTF-16 code unit rather than a codepoint.

- `[space]` matches slightly different code points in JavaScript than in Java. This will be fixed.

- Backreferences behave differently in JavaScript and Python when the referenced group has no captured text. There is nothing we can do about it, but we could add a warning for this in the future.
