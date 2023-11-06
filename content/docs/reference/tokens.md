---
title: 'Tokens'
description: "The smallest parts of Pomsky's syntax"
excerpt: ''
date: 2023-10-23T09:31:00+00:00
lastmod: 2023-10-23T09:31:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'reference'
weight: 2
toc: true
---

Tokens (also called _terminals_) cannot be further divided. There are the following token types
used in the grammar:

## Name

Names (or _identifiers_) consist of a letter or underscore (`_`), followed by any number of letters,
digits and underscores. For example:

```pomsky
# valid identifiers
hello  i18n  _foo_  Gänsefüßchen

# invalid identifiers
kebab-case  42  👍‍
```

A letter is any code point with the `Alphabetic` property, which can be matched in most regex flavors with `\p{Alpha}`. A digit is any code point from the `Number` general categories, which can be matched in most regex flavors with `\pN`.

Note that group names have more restrictions than variable names: They must be ASCII-only and may not contain underscores.

Identifiers may not be one of the following reserved words:

- `U`
- `let`
- `lazy`
- `greedy`
- `range`
- `base`
- `atomic`
- `enable`
- `disable`
- `if`
- `else`
- `recursion`
- `regex`
- `test`

There are some _contextual keywords_ that have a special meaning only in a certain context:

- `match`
- `reject`
- `as`
- `in`
- `unicode`

Contextual keywords can be used as variable and group names without issues.

## Number

A whole number without a sign and without leading zeros. For example:

```pomsky
# valid numbers
0  1  42  10000

# invalid numbers
042  -30  +30  30.1  10_000  10,000
```

## String

A string is a sequence of code points surrounded by single or double quotes. In double quoted
strings, double quotes and backslashes are escaped by preceding them with a backslash. No other
escapes are supported. Single quoted strings don't support any escaping:

```pomsky
# valid strings
'test'  "test"  "C:\\User\\Dwayne \"The Rock\" Johnson"  'C:\User\Dwayne "The Rock" Johnson'

'this is a
multiline string'

"this is a
multiline string"

# invalid strings
"\n"  "\uFFFF"  '\''
```

Within string literals, `\r\n` (CRLF) sequences are replaced with a single `\n` (LF).
This is because text editors do not display the type of line ending, so users might save a Pomsky
file with the wrong file ending by accident. In most regex engines, `\n` matches a line break
regardless of the platform convention used.

## StringOneChar

Same as `String`, with the limitation that the string must contain exactly one code point. Example:

```pomsky
'a'  'ŧ'  "\\"
```

## CodePoint

A codepoint consists of `U`, `+`, and 1 to 6 hexadecimal digits (0-9, a-f, A-F). It must
represent a valid Unicode scalar value. This means that it must be a valid codepoint, but not a
UTF-16 surrogate. For example:

```pomsky
# valid codepoints
U+0  U+10  U+FFF  U+10FFFF  U + FF

# invalid codepoints
U+300000  U+00000001  U+D800  U+FGHI
```

The code point token is 'special' in that the `+` may be surrounded by spaces.

## Punctuation

Punctuation tokens consist of visible ASCII characters. Most punctuation tokens are exactly one
character, except for `<<`, `>>`, and `::`. The full list of supported punctuation tokens is

```pomsky
>> << :: ^ $ < > % * + ? | : ( ) { } , ! [ - ] . ; =
```

Pomsky's lexer can also lex a variety of illegal constructs, e.g. backslash escapes like `\g<0>`
and groups such as `(:?)`, in order to show more useful error messages.
