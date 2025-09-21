---
title: 'Numbers'
description: 'Rational numbers in decimal notation with optional separating commas'
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
