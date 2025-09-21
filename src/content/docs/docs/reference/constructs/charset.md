---
title: 'Character Set'
description: 'Reference – Matching one of several code points'
---

A character set allows matching one of several code points.

## Syntax

```pomsky
let CharacterSet = '[' CharacterSetInner+ ']';

let CharacterSetInner =
    | Range
    | String
    | CodePoint
    | NonPrintable
    | Shorthand
    | UnicodeProperty
    | AsciiShorthand;

let Range = SingleChar '-' SingleChar;

let SingleChar =
    | StringOneChar
    | CodePoint
    | NonPrintable;  # deprecated!

let NonPrintable =
    | 'n' | 'r' | 't'
    | 'a' | 'e' | 'f';

let Shorthand = '!'? ShorthandIdent;

let ShorthandIdent =
    | 'w' | 'word'
    | 'd' | 'digit'
    | 's' | 'space'
    | 'h' | 'horiz_space'
    | 'v' | 'vert_space'

let AsciiShorthand =
    | 'ascii'
    | 'ascii_alpha'
    | 'ascii_alnum'
    | 'ascii_blank'
    | 'ascii_cntrl'
    | 'ascii_digit'
    | 'ascii_graph'
    | 'ascii_lower'
    | 'ascii_print'
    | 'ascii_punct'
    | 'ascii_space'
    | 'ascii_upper'
    | 'ascii_word'
    | 'ascii_xdigit';

let UnicodeProperty = '!'? Name;
```

## Example

```pomsky
['ad' 'f'-'x' Greek digit n U+FEFF]
```

## Support

Character sets are supported in all flavors. However, not all Unicode properties are supported
in all flavors.

Furthermore, in .NET, character sets incorrectly match UTF-16 code units rather than code points.
This means that a character set can not be used for characters outside the Basic Multilingual Plane
(BMP) in .NET.

In JavaScript, `word` cannot be negated if the character set contains other items as well. For
example, `[!word s]`#po does not work. The reason is that `\w` is polyfilled in
JavaScript to be Unicode aware.

## Behavior

A character set matches a single Unicode code point. It is surrounded by `[]` square brackets and
can contain an arbitrary number of characters, [code points](/docs/reference/tokens/#codepoint),
character ranges, non-printable characters, shorthand character classes, and Unicode properties.

A character set is a _set_ in the mathematical sense, matching the _union_ of everything written
in the square brackets.

### Code Points and Characters

Character sets can contain [code points](/docs/reference/tokens/#codepoint) such as `U+20`#po or
`U+FEFF`#po, and strings, which are treated as the set of their code points. For example,
`['ace']`#po is equivalent to `['a' 'c' 'e']`#po, or
`[U+61 U+63 U+65]`#po.

In .NET, only code points in the BMP are allowed.

### Character ranges

Ranges of code points can be specified like `['a'-'z']`#po or
`[U+40-U+50]`#po. Ranges must be ascending and non-empty: The first code point must be
lower than the second code point, so they constitute a lower and upper bound. Both bounds are
included in the set. Each bound can be either a string containing exactly one code point, a code
point literal, or a non-printable character (see below). Non-printable characters in ranges are
deprecated.

### Non-printable characters

There are 6 non-printable ASCII characters with a special syntax:

- `a` is equivalent to `U+07` (bell)
- `t` is equivalent to `U+09` (horizontal tabulation)
- `n` is equivalent to `U+0A` (new line)
- `e` is equivalent to `U+1B` (vertical tabulation)
- `f` is equivalent to `U+0C` (form feed)
- `r` is equivalent to `U+0D` (carriage return)

### Shorthands

There exist a variety of shorthands that can be used in a character set.

The following _general shorthands_ exist, each of which has a full name and a single-character
alias:

| Full name     | Alias | Equivalent                                                          |
| ------------- | ----- | ------------------------------------------------------------------- |
| `word`        | `w`   | `Alphabetic Mark Decimal_Number Connector_Punctuation Join_Control` |
| `digit`       | `d`   | `Decimal_Number`                                                    |
| `space`       | `s`   | `White_Space`                                                       |
| `horiz_space` | `h`   | `U+09 Space_Separator`                                              |
| `vert_space`  | `v`   | `U+0A-U+0D U+85 U+2028 U+2029`                                      |

The following _ascii shorthands_ exist:

| Name           | Equivalent                                   |
| -------------- | -------------------------------------------- |
| `ascii`        | `U+00-U+7F`#po                               |
| `ascii_alpha`  | `'a'-'z' 'A'-'Z'`#po                         |
| `ascii_alnum`  | `'a'-'z' 'A'-'Z' '0'-'9'`#po                 |
| `ascii_blank`  | `' ' t`#po                                   |
| `ascii_cntrl`  | `U+00-U+1F U+7F`#po                          |
| `ascii_digit`  | `'0'-'9'`#po                                 |
| `ascii_graph`  | `U+21-U+7E`#po                               |
| `ascii_lower`  | `'a'-'z'`#po                                 |
| `ascii_print`  | `U+20-U+7E`#po                               |
| `ascii_punct`  | `U+21-U+2F U+3A-U+40 U+5B-U+60 U+7B-U+7E`#po |
| `ascii_space`  | `' ' t n r e f`#po                           |
| `ascii_upper`  | `'A'-'Z'`#po                                 |
| `ascii_word`   | `'a'-'z' 'A'-'Z' '0'-'9' '_'`#po             |
| `ascii_xdigit` | `'0'-'9' 'a'-'f' 'A'-'F'`#po                 |

Pomsky supports all Unicode general properties, scripts, blocks, and other boolean properties.
However, not all Unicode properties are supported in every flavor. For example, Python does not
support Unicode properties at all, JavaScript does not support blocks, and Java does not support
most boolean properties.

Details about supported Unicode properties can be [found here](/docs/appendix/unicode-properties).

### Negation of shorthands

Shorthands (except for ASCII shorthands) are special in that they can be negated. However, only a
single exclamation mark is allowed in front of shorthands, so no double negation is possible.

There are some exceptions though: `v` and `h` can't be negated. `w` can't be negated when targetting
JavaScript. This restriction could be lifted once the `/v` flag becomes widely supported.

## Compilation

Usually, compiling character sets is straightforward, but there are some edge cases. Character sets
translate to brackets (`[···]`#re), usually called "character classes" in regex lingo. Negated
character sets translate to negative character classes (`[^···]`#re). Negating a single-character
string also produces a character class, whereas a non-negated character class with only a single
element is unwrapped:

```pomsky
['ad']    # [ad]
!['ad']   # [^ad]
!'a'      # [^a]
['a']     # a
```

Pomsky removes duplicate items and eliminates double negation where possible:

```pomsky
['test']  # [tes]
![!word]  # \w
```

Special characters are escaped when needed, but `^` is only escaped if it is the first character:

```pomsky
['[]-^&\']   # [\[\]\-^\&\\]
['^']       # [\^]
```

`&` and `|` are not escaped when targeting JavaScript.

Also, `word`/`w` and `digit`/`d` are polyfilled in JavaScript using equivalent Unicode general
categories. `vert_space`/`v` and `horiz_space`/`h` are polyfilled in all flavors except PCRE and
Java. ASCII shorthands are polyfilled everywhere, even though they are supported in PCRE as "POSIX
classes".

## Issues

Behavior is incorrect in .NET (see [above](#support)).

Union and intersection of sets is not yet implemented.

The expression `['&' '&'-'Z']`#po miscompiles in JS with the `/v` flag because `&` is not escaped.

## History

- Deprecated shorthands in character ranges in Pomsky 0.11
- Extended set of supported Unicode properties in Pomsky 0.10
- Added support for Unicode blocks and boolean properties in Pomsky 0.8
- Deprecated `[.]`, `[codepoint]` and `[cp]` syntax in Pomsky 0.6
- Added shorthand aliases `word`, `digit`, `space`, `horiz_space`, `vert_space` in Pomsky 0.3
- ASCII shorthands renamed to begin with `ascii_` in Pomsky 0.3
- Initial implementation in Pomsky 0.1
