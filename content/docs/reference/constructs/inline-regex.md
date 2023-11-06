---
title: 'Inline Regex'
description: 'Reference – Embed regexes in Pomsky'
excerpt: ''
date: 2023-10-23T09:31:00+00:00
lastmod: 2023-10-23T09:31:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'constructs'
weight: 4
toc: true
---

Inline regexes allow you to embed regular expressions in Pomsky.

## Syntax

```pomsky
let InlineRegex = 'regex' String;
```

## Example

```pomsky
regex '(?2)'                # subroutine
regex '[\w--[\p{Latin}]]'   # character set subtraction
```

## Support

Inline regexes are supported in all flavors.

Support for inline regexes is gated by the `regexes` feature. Specify features with the
`--allowed-features` option.

## Behavior

Inline regexes can do anything the targeted regex engine supports. However, inline regexes may not
be as portable, because different regex engines use slightly different syntax for some features.

## Compilation

The string content is emitted by the compiler verbatim. If the expression is repeated, it is
wrapped in a non-capturing group. Pomsky also adds a non-capturing group if the inline regex is
surrounded by parentheses. For example:

| Pomsky                                  | Compiled regex |
| --------------------------------------- | -------------- |
| {{<po>}}regex 'a&#x7c;b' {{</po>}}      | `a\|b`         |
| {{<po>}}regex 'a&#x7c;b'+ {{</po>}}     | `(?:a\|b)+`    |
| {{<po>}}regex 'a&#x7c;b' 'c' {{</po>}}  | `a\|bc`        |
| {{<po>}}(regex 'a&#x7c;b') 'c'{{</po>}} | `(?:a\|b)c`    |

This is the only situation where parentheses affect the compiled regex, even though they do not
affect precedence in the Pomsky expression.

## Issues

Pomsky doesn't know when the inline regex needs to be wrapped in a non-capturing group. No group is
added when multiple expressions are concatenated, which may be incorrect if the inline regex is an
alternation.

## History

Initial implementation in Pomsky 0.8
