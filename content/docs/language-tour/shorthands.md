---
title: 'Shorthands'
description: 'Character class shorthands'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7006
toc: true
---

There are abbreviations, called _shorthands_, for often needed character sets:

- `[digit]` or `[d]` matches a **decimal number**. It is similar to {{<po>}}['0'-'9']{{</po>}},
  except that it is Unicode aware.

- `[word]` or `[w]` matches a **word character**, i.e. a letter, digit or underscore. It's similar
  to {{<po>}}['0'-'9' 'a'-'z' 'A'-'Z' '_']{{</po>}}, except that it is Unicode aware. It matches all
  codepoints in the _Alphabetic, Mark, Decimal_Number, Connector_Punctuation,_ and _Join_Control_
  Unicode categories.

- `[space]` or `[s]` matches **whitespace**. It is equivalent to the _White_Space_ category.

- `[horiz_space]` or `[h]` matches **horizontal whitespace**, e.g. tabs und spaces.

- `[vert_space]` or `[v]` matches **vertical whitespace**, e.g. line breaks.

These can be combined as well:

```pomsky
[d s '.']   # match digits, spaces, and dots
```

Note that `word`, `digit` and `space` only match ASCII characters, if the regex engine isn't
configured to be Unicode-aware. How to enable Unicode support is
[described here](/docs/get-started/enable-unicode).

## What if I don't need Unicode?

You don't have to use Unicode-aware character sets such as {{<po>}}[digit]{{</po>}} if you
know that the input is only ASCII. Unicode-aware matching can be considerably slower. For example,
the {{<po>}}[word]{{</po>}} character class includes more than 100,000 code points, so
matching a {{<po>}}[ascii_word]{{</po>}} (which includes only 63 code points) is faster.

Pomsky supports a number of ASCII-only shorthands:

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

- {{<po>}}[n]{{</po>}} matches the `\n` line feed.
- {{<po>}}[r]{{</po>}} matches the `\r` carriage return.
- {{<po>}}[f]{{</po>}} matches the `\f` form feed.
- {{<po>}}[a]{{</po>}} matches the "alert" or "bell" control character.
- {{<po>}}[e]{{</po>}} matches the "escape" control character.

Other characters have to be written in their hexadecimal form:

```pomsky
[U+10-U+30 U+FEFF]
```

Note that you don't need to write leading zeroes, i.e. {{<po>}}U+0{{</po>}} is just as ok as
{{<po>}}U+0000{{</po>}}. However, it is conventional to write ASCII characters with two digits and
non-ASCII characters with 4, 5 or 6 digits depending on their length.
