---
title: 'Shorthands'
description: 'Character class shorthands'
lead: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 205
toc: true
---

There are a few _shorthand character classes_: `word`, `digit`, `space`, `horiz_space` and
`vert_space`. They can be abbreviated with their first letter: `w`, `d`, `s`, `h` and `v`. Like
Unicode properties, they must appear in square brackets.

- `word` matches a _word character_, i.e. a letter, digit or underscore. It's equivalent to
  {{<po>}}[Alphabetic Mark Decimal_Number Connector_Punctuation Join_Control]{{</po>}}.
- `digit` matches a digit. It's equivalent to `Decimal_Number`.
- `space` matches whitespace. It's equivalent to `White_Space`.
- `horiz_space` matches horizontal whitespace (tabs and spaces). It's equivalent to
  {{<po>}}[U+09 Space_Separator]{{</po>}}.
- `vert_space` matches vertical whitespace. It's equivalent to
  {{<po>}}[U+0A-U+0D U+85 U+2028 U+2029]{{</po>}}.

Note that `word`, `digit` and `space` only match ASCII characters, if the regex engine isn't
configured to be Unicode-aware. How to enable Unicode support is
[described here](../../get-started/enable-unicode).

If you want to match _any_ code point, you can use `Codepoint`, or `C` for short. This does not
require brackets, because it is a [built-in variable](../../reference/built-in-variables).
For example, this matches a double-quoted string:

```pomsky
'"' Codepoint* lazy '"'
```

## What if I don't need Unicode?

You don't have to use Unicode-aware character classes such as {{<po>}}[word]{{</po>}} if you
know that the input is only ASCII. Unicode-aware matching can be considerably slower. For example,
the {{<po>}}[word]{{</po>}} character class includes more than 100,000 code points, so
matching a {{<po>}}[ascii_word]{{</po>}}, which includes only 63 code points, is faster.

pomsky supports a number of ASCII-only shorthands:

| Character class                 | Equivalent                                         |
| ------------------------------- | -------------------------------------------------- |
| {{<po>}}[ascii]{{</po>}}        | {{<po>}}[U+00-U+7F]{{</po>}}                       |
| {{<po>}}[ascii_alpha]{{</po>}}  | {{<po>}}['a'-'z' 'A'-'Z']{{</po>}}                 |
| {{<po>}}[ascii_alnum]{{</po>}}  | {{<po>}}['0'-'9' 'a'-'z' 'A'-'Z']{{</po>}}         |
| {{<po>}}[ascii_blank]{{</po>}}  | {{<po>}}[' ' U+09],{{</po>}}                       |
| {{<po>}}[ascii_cntrl]{{</po>}}  | {{<po>}}[U+00-U+1F U+7F]{{</po>}}                  |
| {{<po>}}[ascii_digit]{{</po>}}  | {{<po>}}['0'-'9']{{</po>}}                         |
| {{<po>}}[ascii_graph]{{</po>}}  | {{<po>}}['!'-'~']{{</po>}}                         |
| {{<po>}}[ascii_lower]{{</po>}}  | {{<po>}}['a'-'z']{{</po>}}                         |
| {{<po>}}[ascii_print]{{</po>}}  | {{<po>}}[' '-'~']{{</po>}}                         |
| {{<po>}}[ascii_punct]{{</po>}}  | {{<po>}}['!'-'/' ':'-'@' '['-'`' '{'-'~']{{</po>}} |
| {{<po>}}[ascii_space]{{</po>}}  | {{<po>}}[' ' U+09-U+0D]{{</po>}}                   |
| {{<po>}}[ascii_upper]{{</po>}}  | {{<po>}}['A'-'Z']{{</po>}}                         |
| {{<po>}}[ascii_word]{{</po>}}   | {{<po>}}['0'-'9' 'a'-'z' 'A'-'Z' '_']{{</po>}}     |
| {{<po>}}[ascii_xdigit]{{</po>}} | {{<po>}}['0'-'9' 'a'-'f' 'A'-'F']{{</po>}}         |

Using them can improve performance, but be careful when you use them. If you aren't sure if the
input will ever contain non-ASCII characters, it's better to err on the side of correctness, and
use Unicode-aware character classes.

## Non-printable characters

Characters that can't be printed should be replaced with their hexadecimal Unicode code point. For
example, you may write {{<po>}}U+FEFF{{</po>}} to match the
[Zero Width No-Break Space](https://www.compart.com/en/unicode/U+FEFF).

There are also 6 non-printable characters with a name:

- {{<po>}}[n]{{</po>}} is equivalent to {{<po>}}[U+0A]{{</po>}}, the `\n` line feed.
- {{<po>}}[r]{{</po>}} is equivalent to {{<po>}}[U+0D]{{</po>}}, the `\r` carriage
  return.
- {{<po>}}[f]{{</po>}} is equivalent to {{<po>}}[U+0C]{{</po>}}, the `\f` form feed.
- {{<po>}}[a]{{</po>}} is equivalent to {{<po>}}[U+07]{{</po>}}, the "alert" or "bell"
  control character.
- {{<po>}}[e]{{</po>}} is equivalent to {{<po>}}[U+0B]{{</po>}}, the "escape" control
  character.

Other characters have to be written in their hexadecimal form. Note that you don't need to write
leading zeroes, i.e. {{<po>}}U+0{{</po>}} is just as ok as {{<po>}}U+0000{{</po>}}.
However, it is conventional to write ASCII characters with two digits and non-ASCII characters
with 4, 5 or 6 digits depending on their length.
