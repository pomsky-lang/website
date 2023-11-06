---
title: 'Example: Numbers'
description: 'Rational numbers in decimal notation with optional separating commas'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'examples'
weight: 9001
toc: true
---

This regular expression matches rational numbers in decimal notation
with optional separating commas:

```regexp
[-+]??\b(?:0|[1-9](?:,??[0-9])*)(?:\.[0-9]+)?\b
```

Equivalent Pomsky expression:

```pomsky
['-+']?
%
('0' | ['1'-'9'] (','? ['0'-'9'])*)
('.' ['0'-'9']+)?
%
```
