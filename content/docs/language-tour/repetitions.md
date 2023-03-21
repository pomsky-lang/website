---
title: 'Repetitions'
description: 'How to repeat an expression, greedily or lazily'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 203
toc: true
---

When we want to match an expression multiple times, it would be cumbersome to repeat our expression.
Instead, we can specify how often the expression should occur:

```pomsky
('r' | 'w' | 'x' | '-'){9}
```

This matches an `r`, `w`, `x` or `-` character 9 times. For example, it would match the string
`rwxr-xr--`, or `xxrr-xr-w`.

What if we want to match strings of different lengths? Repetitions are quite flexible, so we can
specify a lower and upper bound for the number of repetitions:

```pomsky
('r' | 'w' | 'x' | '-'){3,9}
```

## Greedy and lazy matching

The above matches at least 3 times and at most 9 times. By default, repetition is _greedy_.
This means that Pomsky always tries to match an expression as many times as possible. For example,
the expression above matches the string `rwxr-xr--` entirely. Even though it could stop after the
third repetition (the lower bound), it continues to try and match more, until the upper bound is
reached.

In situations where this is not desired, you can opt into non-greedy matching with the `lazy`
keyword, for example:

```pomsky
('r' | 'w' | 'x' | '-'){3,9} lazy
'--'
```

When given the string `rwxr--r--`, Pomsky will first repeat the group 3 times (the lower bound).
Since there aren't two dashes after 3 characters, it is forced to repeat a fourth time. `rwxr` is
followed by two dashes, so Pomsky returns the match `rwxr--` and stops. The other possible
match, which is the entire string, isn't found, because the repetition is "too lazy".

## Variants of repetition

If we want to match an expression arbitrarily often, without an upper bound, we can just omit it:

```pomsky
'test'{3,}
```

There are three kinds of repetition that are very common: `{0,}` (zero or more), `{1,}` (one or
more) and `{0,1}` (zero or one). These have dedicated symbols, `*`, `+` and `?`:

```pomsky
'test'*     # match zero times or more
'test'+     # match one time or more
'test'?     # match zero or one time
```

You can also add the `lazy` keyword to them to opt into lazy matching.

## Enable lazy matching globally

If you enable the `lazy` mode, lazy repetition becomes the default, so it's necessary to opt into
greedy repetition with the `greedy` keyword:

```pomsky
enable lazy;
'test'+         # this is lazy
'test'+ greedy
```

Lazy matching can be enabled or disabled in arbitrarily nested groups:

```pomsky
(enable lazy;
  'test'+ # this is lazy
  (disable lazy;
    'test'+ # this is greedy
  )
  'test'+ # this is lazy
)
```
