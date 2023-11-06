---
title: 'Example: Passwords'
description: 'Test if password satisfies strength requirements'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'examples'
weight: 9002
toc: true
---

Here's a regular expression that tests if a string contains at least one uppercase letter,
lowercase letter, digit and punctuation/symbol code point, and is at least 8 code points long:

```regexp
^(?=[\S\s]*?\d)(?=[\S\s]*?\p{Ll})(?=[\S\s]*?\p{Lu})(?=[\S\s]*?[\pP\pS])[\S\s]{8}
```

Equivalent Pomsky expression:

```pomsky
^
(>> C* [digit])
(>> C* [Ll])
(>> C* [Lu])
(>> C* [P S])
C{8}
```
