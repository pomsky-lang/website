---
title: 'Groups'
description: 'Learn about capturing and non-capturing and named groups'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 202
toc: true
---

Multiple expressions can be grouped together by wrapping them in {{<po>}}(){{</po>}}.
This is useful when we have multiple alternatives that all start or end with the same thing:

```pomsky
'tang' ('ible' | 'ent' | 'o')
```

This matches the words _tangible_, _tangent_ and _tango_.

## Capturing groups

Groups can also be used to _capture_ their content, for example to replace it with something else.
In a regex, every group is a capturing group by default. This is not the case in Pomsky: Capturing
groups must be prefixed with `:`.

```pomsky
:('foo')
```

Capturing groups are consecutively numbered, to be able to refer to them later:

```pomsky
:('Max' | 'Laura')
(' is ' | ' was ')
:('asleep' | 'awake')
```

The first group, containing the name, has index **1**, the third group with the adverb has the index
**2**. The second group is skipped because it isn't capturing (it isn't prefixed with `:`).

## Named capturing groups

Because groups are non-capturing by default, you can add parentheses freely without accidentally
changing the capturing group indices. However, it's usually better to use _named capturing groups_,
so you don't need to count groups and instead refer to each group by a name:

```pomsky
:name('Max' | 'Laura')
(' is ' | ' was ')
:adverb('asleep' | 'awake')
```

Now, the capturing groups are named `name` and `adverb`.

## Atomic groups

If we put the `atomic` keyword in front of a group, the RegExp engine can't backtrack into the
group. This can improve matching performance and prevent "catastrophic backtracking":

```pomsky
% atomic('if' | 'else' | 'while' | 'for') %
```

You can find out more about backtracking [here](https://www.regular-expressions.info/catastrophic.html).

Note that atomic groups are only supported in the Java, PCRE, Ruby and .NET flavors.
