---
title: 'Formal grammar'
description: "pomsky' syntax specification"
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'reference'
weight: 301
toc: true
---

## Summary

This document uses pomsky syntax to describe pomsky's syntax. Here's an incomplete summary,
which should be enough to read the grammar:

- Variables are declared as {{<po>}}let var_name = expression;{{</po>}}. This assigns
  `expression` to the variable `var_name`.

- Verbatim text is wrapped in double quotes ({{<po>}}""{{</po>}}) or single quotes
  ({{<po>}}''{{</po>}}).

- A {{<po>}}*{{</po>}} after a rule indicates that it repeats 0 or more times.

- A {{<po>}}+{{</po>}} after a rule indicates that it repeats 1 or more times.

- A {{<po>}}?{{</po>}} after a rule indicates that the rule is optional.

- Rules can be grouped together by wrapping them in parentheses ({{<po>}}(){{</po>}}).

- Alternative rules are each preceded by a vertical bar ({{<po>}}|{{</po>}}).

## Formal grammar

Comments start with `#` and end at the end of the same line. Comments and whitespace are ignored;
they can be added anywhere.

### Expression

```pomsky
let Expression = Statement* OrExpression;

let Statement =
    | LetDeclaration
    | Modifier;

let LetDeclaration = 'let' Name '=' OrExpression ';';

let Modifier = ModifierKeyword BooleanSetting ';';

let ModifierKeyword =
    | 'enable'
    | 'disable';

let BooleanSetting = 'lazy';
```

### OrExpression

```pomsky
let OrExpression = ('|'? Alternatives)?;

let Alternatives = Alternative ('|' Alternative)*;

let Alternative = FixExpression+;
```

### FixExpression

An expression which can have a prefix or suffix.

```pomsky
let FixExpression =
    | LookaroundPrefix* Expression
    | AtomExpression RepetitionSuffix*;
```

### Lookaround

```pomsky
let LookaroundPrefix =
    | '!'? '<<'
    | '!'? '>>';
```

### Repetitions

```pomsky
let RepetitionSuffix = RepetitionCount Quantifier?;

let RepetitionCount =
    | '*'
    | '+'
    | '?'
    | RepetitionBraces;

let RepetitionBraces =
    | '{' Number '}'
    | '{' Number? ',' Number? '}';

let Quantifier =
    | 'greedy'
    | 'lazy';
```

### AtomExpression

```pomsky
let AtomExpression =
    | Group
    | String
    | CharacterSet
    | Boundary
    | Reference
    | NumberRange
    | CodePoint
    | Name;
```

### Group

```pomsky
let Group = GroupKind? '(' Expression ')';

let GroupKind = ':' Name?;
```

### CharacterSet

```pomsky
let CharacterSet =
    | '!'? '[' '.' ']' # deprecated!
    | '!'? '[' CharacterSetInner+ ']';

let CharacterSetInner =
    | Range
    | String
    | CodePoint
    | NonPrintable
    | Shorthand
    | UnicodeProperty
    | PosixClass;

let Range = SingleChar '-' SingleChar;

let SingleChar =
    | StringOneChar
    | CodePoint
    | NonPrintable;

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
    | 'l' | 'line_break'

let PosixClass =
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
```

### UnicodeProperty

```pomsky
let UnicodeProperty = '!'? Name;
```

Details about supported Unicode properties can be [found here](../unicode-properties).

### Boundary

```pomsky
let Boundary =
    | '^'
    | '$'
    | '!'? '%';
```

### Reference

```pomsky
let Reference =
    | '::' Name
    | '::' Sign? Number;

let Sign =
    | '+'
    | '-';
```

### NumberRange

```pomsky
let NumberRange = 'range' String '-' String Base?;

let Base = 'base' Number;
```

Note that the strings must contain digits or ASCII letters in the supported range. For example,
in `base 16`, the characters `0123456789abcdefABCDEF` are allowed. The base must be between 2 and
36.

## Tokens

Tokens (also called _terminals_) cannot be further divided. There are the following token types
used in the above grammar:

### Name

Names (or _identifiers_) consist of a letter or underscore, followed by any number of letters,
digits and underscores. For example:

```pomsky
# valid identifiers
hello  i18n  _foo_  Gänsefüßchen

# invalid identifiers
kebab-case  42  👍‍
```

### Number

A whole number without a sign and without leading zeros. For example:

```pomsky
# valid numbers
0  1  42  10000

# invalid numbers
042  -30  +30  30.1  10_000  10,000
```

### String

A string is a sequence of code points surrounded by single or double quotes. In double quoted
strings, double quotes and backslashes are escaped by preceding them with a backslash. No other
escapes are supported: For example:

```pomsky
# valid strings
'test'  "test"  "C:\\User\\Dwayne \"The Rock\" Johnson"  'C:\User\Dwayne "The Rock" Johnson'
'this is a
multiline string'

# invalid strings
"\n"  "\uFFFF"  '\''
```

### StringOneChar

Same as `String`, with the limitation that the string must contain exactly one code point or
grapheme.

### CodePoint

A code point consists of `U+` followed by 1 to 6 hexadecimal digits (0-9, a-f, A-F). It must
represent a valid Unicode code point. For example:

```pomsky
# valid code points
U+0  U+10  U+FFF  U+10FFFF

# invalid code points
U+30000  U+100000000  U+FGHI
```

Note that the `+` is not required, mainly to be compatible with Rust tokenization.

## Note about this grammar

Even though this grammar is written using pomsky syntax, it isn't actually accepted by the pomsky
compiler, because it uses cyclic variables.
