---
title: 'References'
description: 'Reference – Match the same string as a previously matched capturing group again'
excerpt: ''
date: 2023-10-23T09:31:00+00:00
lastmod: 2023-10-23T09:31:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'constructs'
weight: 8201
toc: true
---

References allow you to match the same string as a previously matched capturing group again.

## Syntax

```pomsky
let Reference =
    | '::' Name
    | '::' Sign? Number;

let Sign =
    | '+'
    | '-';
```

Note that references must be ASCII-only, so the allowed characters are `a-z`, `A-Z`, and `0-9`.
Numbers may not appear at the start of the name.

## Example

```pomsky
'r' :hashes('#'*) '"' C* lazy '"' ::hashes
```

This matches Rust's raw strings, which look like `r#"..."#` or `r###"..."###`. They must have the
same number of `#` signs at the start and at the end.

## Support

References are supported in all flavors except Rust (with some limitiations).

Support for references is gated by the `references` feature. Specify features with the
`--allowed-features` option.

## Behavior

Since this is a complex topic, I recommend the documentation from regular-expressions.info
([part 1][pt-1], [part 2][pt-2], [part 3][pt-3], [part 4][pt-4]). Pomsky uses a different syntax:

[pt-1]: https://www.regular-expressions.info/backref.html
[pt-2]: https://www.regular-expressions.info/backref2.html
[pt-3]: https://www.regular-expressions.info/named.html
[pt-4]: https://www.regular-expressions.info/backrefrel.html

- Numbered references look like `::3`
- Named references look like `::foo`
- Relative references look like `::-2` or `::+2`.

Pomsky usually converts all backreferences to an absolute number, so it supports named and relative
backreferences even when targeting flavors that do not. Apart from this, Pomsky inherits the
behavior of references from the targeted regex flavor.

Notably, in JavaScript and Python, no forward references are supported, only backreferences.

In JavaScript, references can not match something captured in a previous iteration in a repetition.
Also, JavaScript is the only flavor where a backreference matches an empty string when the referenced
group didn't participate in the match.

Pomsky only supports reference numbers up to 99. This restriction is imposed by Python.

## Compilation

References are usually compiled by looking up the index of the referenced group, and then emitting
a numbered backreference such as `\3`.

The exception is Ruby, where a named capturing group cannot be referenced by a numbered
backreference. Therefore Pomsky checks if the referenced group has a name. If that's the case, a
named backreference, e.g. `\k<foo>`, is emitted.

## Issues

References directly followed by a digit [are miscompiled][digit-bug], e.g.
{{<po>}}:() ::1 '0'{{</po>}} produces `()\10`, which looks like the 10th capturing group.

In .NET, when named and unnamed capturing groups are mixed, they are numbered in a weird way, so
the group numbers calculated by Pomsky [are wrong][number-bug].

Pomsky doesn't yet verify that backreferences are valid in all cases.

[digit-bug]: https://github.com/pomsky-lang/pomsky/issues/97
[number-bug]: https://github.com/pomsky-lang/pomsky/issues/96

## History

- Added relative references in Pomsky 0.3
- Initial implementation in Pomsky 0.1
