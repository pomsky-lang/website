---
title: 'Dots'
description: 'Matching an arbitrary codepoint'
excerpt: ''
date: 2023-11-03T18:00:00+00:00
lastmod: 2023-11-03T18:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7005
toc: true
---

You can use the dot (`.`) to match any character, except line breaks. For example:

```pomsky
...  # 3 characters
```

Most regex engines have a "singleline" option that changes the behavior of `.`. When enabled,
`.` matches everything, even line breaks. You could use this to check if a text fits in an SMS:

```pomsky
.{1,160}  # enforces the 160 character limit
```

If you want to match any character, without having to enable the "singleline" option, Pomsky also
offers the variable `C`, or `Codepoint`:

```pomsky
Codepoint{1,160}
```

## What's a codepoint?

I lied when I said that the dot matches a character; it actually matches a Unicode codepoint.

A Unicode codepoint _usually_, but not always, represents a character. Exceptions are
composite characters like `ć` (which may consist of a `´` and a `c` when it isn't normalized).
Composite characters are common in many scripts, including Japanese, Indian and Arabic scripts.
Also, an emoji can consist of multiple codepoints, e.g. when it has a gender or skin tone modifier.

<!--
Note that .NET does not properly support Unicode, and matches _UTF-16 code units_ instead of
codepoints. This means that when encountering a codepoint outside of the BMP, .NET matches each
UTF-16 surrogate individually, so one `.` or `C` may match only half a codepoint in .NET.
-->

## Repeating the dot

Be careful when repeating `C` or `.`. My personal recommendation is to _never repeat them_. Let's
see why:

```pomsky
'{' .* '}'
```

<!-- prettier-ignore -->
This matches any content surrounded by curly braces. Why is this bad? Because {{<po>}}.*{{</po>}}
will greedily consume anything, even curly braces, so looking for matches in the string
`{ab} de {fg}` will return the whole string, but we probably expected to get the two matches `{ab}`
and `{fg}`.

We'll see how this can be fixed in a bit.
