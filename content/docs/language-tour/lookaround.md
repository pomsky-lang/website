---
title: 'Lookaround'
description: 'Matching forwards or backwards without consuming characters'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7013
toc: true
---

Lookarounds allow you to see if the characters before or after the current position
match a certain expression. Lookarounds are _assertions_, meaning that they have a length of 0,
much like anchors and word boundaries.

## Example

Let's say we want to match all keys in a JSON file. JSON is a simple, structured text format, e.g.

```json
{
  "languages": [
    {
      "name": "Pomsky",
      "proficiency": "expert",
      "open_source": true
    }
  ]
}
```

To match all keys, we need to look for strings followed by a `:`. However, we don't want the colon
to be part of our match; we just want to check that it's there! Here's a possible solution:

```pomsky
'"' !['"']* '"'  (>> [space]* ':')
```

The {{<po>}}>>{{</po>}} introduces a _lookahead assertion_. It checks that the `"` is followed by
a `:`, possibly with spaces in between. The contents of the lookahead are not included in the match.

But what if there's a key containing escaped quotes, e.g. `"foo \"bar\" baz"`? To handle this, we
need to allow escape sequences in the string:

```pomsky
'"' (!['\"'] | '\\' | '\"')* '"'  (>> [space]* ':')
```

There's just one piece missing: The first quote should not be preceded by a backslash, so we need
another assertion:

```pomsky
(!<< '\')  '"' (!['\"'] | '\\' | '\"')* '"'  (>> [space]* ':')
```

This is a _negative lookbehind assertion_. It asserts that the string is _not_ preceded by the
contained expression.

In total, there are 4 kinds of lookaround assertions:

- {{<po>}}>>{{</po>}} (positive lookahead)
- {{<po>}}<<{{</po>}} (positive lookbehind)
- {{<po>}}!>>{{</po>}} (negative lookahead)
- {{<po>}}!<<{{</po>}} (negative lookbehind)

Note that lookbehind isn't supported everywhere. Rust supports neither lookbehind nor lookahead.

## Intersection expressions

Lookaround makes it possible to simultaneously match a string in multiple ways. For example:

```pomsky
< (!>> ('_' | 'for' | 'while' | 'if') >) [word]+ >
```

This matches a string consisting of word characters, but not one of the keywords `_`, `for`,
`while` and `if`.

Be careful when using this technique, because the lookahead might not match the same length as the
expression after it. Here, we ensured that both match until the word end with {{<po>}}>{{</po>}}.
