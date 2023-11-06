---
title: 'Example: Java Identifiers'
description: 'Pomsky expression matching a Java identifier'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'examples'
weight: 9003
toc: true
---

Regex matching a Java identifier:

```regexp
[\p{Connector_Punctuation}\p{Currency_Symbol}\p{Mark}\p{Alphabetic}][\p{Connector_Punctuation}\p{Currency_Symbol}\p{Mark}\p{Alphabetic}\p{Numeric}]*
```

With abbreviations:

```regexp
[\p{Pc}\p{Sc}\p{M}\p{Alpha}][\p{Pc}\p{Sc}\p{M}\p{Alpha}\p{Numeric}]*
```

And as a Pomsky:

```pomsky
[Pc Sc M Alpha]
[Pc Sc M Alpha Numeric]*
```
