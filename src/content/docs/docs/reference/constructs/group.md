---
title: 'Groups'
description: 'Reference – Capturing and grouping multiple expressions'
---

Multiple expressions can be grouped together by wrapping them in parentheses. Capturing groups can
be used to extract information from a match.

## Syntax

```pomsky
let Group = GroupKind? '(' Expression ')';

let GroupKind =
    | ':' Name?
    | 'atomic';
```

See _[Expression](/docs/reference/grammar/#expression)_.

A group name must be ASCII-only and may not contain underscores. Furthermore, a group name must be
no longer than 32 characters. For example:

```pomsky
:underscores_are_invalid()  :äöéŧûøIsInvalid()
:thisGroupNameIsTooLongUnfortunately()

:thisIsAllowed()
```

These restrictions exist because of Java. To make Pomsky behave consistently across regex flavors,
we have to use the most restrictive rules for all flavors.

## Example

```pomsky
('a' | 'bc')* 'd'
:('foo') :bar('bar')
atomic('atomic')
```

## Support

Normal and capturing groups are supported in all flavors. Atomic groups are only supported in the
Java, PCRE, Ruby, and .NET flavors.

Support for capturing groups is gated by the `numbered-groups` and `named-groups` features. Support
for atomic groups is gated by the `atomic-groups` feature. Specify features with the
`--allowed-features` option.

## Behavior

### Normal groups

Normal groups (those that are neither capturing nor atomic) have no effect; their only purpose is to
group multiple expressions together. These are all equivalent:

```pomsky
'test'
('test')
((('test')))
```

Groups are sometimes required to disambiguate which parts of the expression "belong together":

```pomsky
('a' .){3}  # equivalent to a.a.a.
'a' .{3}    # equivalent to a...

'a' ('b' | 'c')  # equivalent to ab|ac
'a' 'b' | 'c'    # equivalent to ab|c
```

### Capturing groups

Capturing groups are used to "capture" parts of a match, which can then be used, e.g. for text
substitution or further processing. For example, JavaScript allows you to reference captures in the
substitution string when using [`String.replace`][js-replace]:

[js-replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

```js
'1.13.5'.replace(/(\d+)\.(\d+)\.(\d+)/, 'v$1_$2') === 'v1_13'
```

In Pomsky, capturing groups are prefixed with a `:`, and optionally a name. Capturing groups are
always preserved, unlike normal groups, which can be optimized away.

In repetitions, captures are overwritten in each iteration. For example, when matching
`:('foo' | 'bar')+`#po against the string `foobar`, the capturing group will contain
the string `bar` in the end.

### Atomic groups

Atomic groups (prefixed with `atomic`) are an optimization for backtracking regex engines. An atomic
group ensures that, once it has matched successfully, the regex engine never tries to backtrack into
the group again.

Atomic groups are not capturing.

## Compilation

Normal groups are conceptually equivalent to non-capturing groups in regular expressions. However,
normal groups may be removed, and non-capturing groups may be created out of thin air by Pomsky.

Capturing groups without a name are compiled to parentheses: `:('foo')`#po
becomes `(foo)`.

How named capturing groups are compiled depends on the regex engine. When targeting Python, PCRE,
or Rust, `:name('foo')`#po is compiled to `(?P<name>foo)`. Otherwise, it is compiled
to `(?<name>foo)`; note the missing `P`.

Atomic groups are compiled to `(?>...)`.

## Issues

Because lookbehinds should be evaluated in reverse direction, but aren't in many regex engines,
repeated groups in a lookbehind assertion may capture different values depending on the regex
engine. For example, the regex `(?<=(a|b){2})\1` matches `aba` in JS, but `abb` in PCRE2.

## History

- Atomic groups added in Pomsky 0.7
- Initial implementation in Pomsky 0.1
