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

This document uses pomsky syntax. Here's an incomplete summary of the syntax, which should be enough
to read the grammar:

- Variables are declared as {{<po>}}let var_name = expression;{{</po>}}. This assigns
  `expression` to the variable `var_name`.

- Verbatim text is wrapped in double quotes ({{<po>}}""{{</po>}}) or single quotes
  ({{<po>}}''{{</po>}}).

- A {{<po>}}*{{</po>}} after a rule indicates that it repeats 0 or more times.

- A {{<po>}}+{{</po>}} after a rule indicates that it repeats 1 or more times.

- A {{<po>}}?{{</po>}} after a rule indicates that the rule is optional.

- Consecutive rules can be grouped together by wrapping them in parentheses
  ({{<po>}}(){{</po>}}).

- Alternative rules are each preceded by a vertical bar ({{<po>}}|{{</po>}}).

- Character classes are wrapped in square brackets ({{<po>}}[]{{</po>}}).
  A character class matches exactly one code point. It can contain

  - sequences of characters (e.g. {{<po>}}'abdf'{{</po>}}, which matches either
    `a`, `b`, `d` or `f`)
  - Unicode ranges (e.g. {{<po>}}'0'-'9'{{</po>}}, which is equivalent to
    {{<po>}}'0123456789'{{</po>}})
  - Shorthands (e.g. {{<po>}}w{{</po>}}, which matches a letter, digit or
    the ASCII underscore `_`)

  An exclamation mark ({{<po>}}!{{</po>}}) in front of the character class negates it.
  For example, {{<po>}}![w]{{</po>}} matches anything _except_ a letter, digit or
  ASCII underscore.

### Whitespace

Comments start with `#` and end at the end of the same line.

Comments and whitespace are ignored; they can be added anywhere, except in strings, in tokens
(such as {{<po>}}>>{{</po>}}), in words, numbers and code points (such as
{{<po>}}U+306F{{</po>}}). For example, {{<po>}}>>{{</po>}} can't be written as
{{<po>}}> >{{</po>}}, but {{<po>}}!>>'test'+{{</po>}} can be written as
{{<po>}}! >> 'test' +{{</po>}}.

Whitespace is required between consecutive words and code points, e.g.
{{<po>}}[a n Latin U+50]{{</po>}}.

## Formal grammar

### Expression

```pomsky
let Expression = Statement* OrExpression;

let Statement =
    | LetDeclaration
    | Modifier;

let LetDeclaration = 'let' VariableName '=' OrExpression ';';

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
let LookaroundPrefix = '!'? LookaroundLiteral;

let LookaroundLiteral =
    | '<<'
    | '>>';
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
    | '{' Number ',' Number? '}';

let Number =
    | '0'
    | ['1'-'9'] ['0'-'9']*;

let Quantifier =
    | 'greedy'
    | 'lazy';
```

### AtomExpression

```pomsky
let AtomExpression =
    | Group
    | String
    | CharacterClass
    | Boundary
    | Reference
    | CodePoint
    | NumberRange
    | VariableName;
```

### Group

```pomsky
let Group = Capture? '(' Expression ')';

let Capture = ':' Name?;

let Name = [w]+;
```

### String

```pomsky
let String =
  | '"' CharBetweenDoubleQuotes* '"'
  | "'" CharBetweenSingleQuotes* "'";


let CharBetweenDoubleQuotes =
    | !['"']
    | '\"';

let CharBetweenSingleQuotes = !["'"];
```

### CharacterClass

```pomsky
let CharacterClass = '!'? '[' CharacterGroup ']';

let CharacterGroup =
    | '.'
    | 'cp'
    | 'codepoint'
    | CharacterGroupMulti+;

let CharacterGroupMulti =
    | Range
    | Characters
    | CodePoint
    | NonPrintable
    | Shorthand
    | UnicodeProperty
    | PosixClass;

let Range = Character '-' Character;

let Characters =
    | '"' CharBetweenDoubleQuotes* '"'
    | "'" CharBetweenSingleQuotes* "'";

let Character =
    | '"' CharBetweenDoubleQuotes '"'
    | "'" CharBetweenSingleQuotes "'"
    | CodePoint
    | NonPrintable;

let NonPrintable =
    | 'n'
    | 'r'
    | 't'
    | 'a'
    | 'e'
    | 'f';

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

### CodePoint

```pomsky
let CodePoint = 'U' '+'? HexDigit{1,6};

let HexDigit = ['0'-'9' 'a'-'f' 'A'-'F'];
```

Note that the second syntax exists mainly to be compatible with Rust tokenization.

### UnicodeProperty

Details about supported Unicode properties can be [found here](../unicode-properties).

```pomsky
let UnicodeProperty = '!'? [w]+;
```

### Boundary

```pomsky
let Boundary =
    | '^'
    | '$'
    | '!'? '%'
    | '<%'
    | '%>';
```

### Reference

```pomsky
let Reference = '::' [w]+;
```

### NumberRange

```pomsky
let NumberRange = 'range' String '-' String Base?;

let Base = 'base' Number;
```

### VariableName

```pomsky
let VariableName = [w]+;
```

## Note about this grammar

Even though this grammar is written using pomsky syntax, it isn't actually accepted by the pomsky
compiler, because it uses cyclic variables.
