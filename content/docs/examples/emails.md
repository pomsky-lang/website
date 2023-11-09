---
title: 'Example: Email Addresses'
description: 'Match an RFC 5322 compliant email address'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'examples'
weight: 9004
toc: true
---

[This StackOverflow answer](https://stackoverflow.com/a/201378) contains a massive regular
expression for matching any RFC 5322 compliant email address:

```regexp
(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])
```

If your regex engine supports insiginificant whitespace mode {{<regexp>}}(?x){{</regexp>}}, it can
be written like this:

```regexp
(?x)

(?:
  [a-z0-9!#$%&'*+/=?^_`{|}~-]+
  (?: \. [a-z0-9!#$%&'*+/=?^_`{|}~-]+ )*
| "
  (?:
    [\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]
  | \\ [\x01-\x09\x0b\x0c\x0e-\x7f]
  )*
  "
)
@
(?:
  (?: [a-z0-9] (?: [a-z0-9-]* [a-z0-9] )? \. )+
  [a-z0-9]
  (?: [a-z0-9-]* [a-z0-9] )?
| \[
  (?:
    (?: (2 (5 [0-5] | [0-4] [0-9]) | 1 [0-9] [0-9] | [1-9]? [0-9]) )
    \.
  ){3}
  (?:
    (2 (5 [0-5] | [0-4] [0-9]) | 1 [0-9] [0-9] | [1-9]? [0-9])
  | [a-z0-9-]*
    [a-z0-9]
    :
    (?:
      [\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]
    | \\ [\x01-\x09\x0b\x0c\x0e-\x7f]
    )+
  )
  \]
)
```

Here's a straightforward translation into Pomsky:

```pomsky
(
  | ['a'-'z' '0'-'9' "!#$%&'*+/=?^_`{|}~-"]+
    ('.' ['a'-'z' '0'-'9' "!#$%&'*+/=?^_`{|}~-"]+ )*
  | '"'
    (
      [U+01-U+08 U+0b U+0c U+0e-U+1f U+21 U+23-U+5b U+5d-U+7f]
    | '\' [U+01-U+09 U+0b U+0c U+0e-U+7f]
    )*
    '"'
)
'@'
(
  | ( ['a'-'z' '0'-'9'] ( ['a'-'z' '0'-'9' '-']* ['a'-'z' '0'-'9'] )? '.' )+
    ['a'-'z' '0'-'9']
    ( ['a'-'z' '0'-'9' '-']* ['a'-'z' '0'-'9'] )?
  | '['
    (:(range '0'-'255') '.'){3}
    (
      | :(range '0'-'255')
      | ['a'-'z' '0'-'9' '-']*
        ['a'-'z' '0'-'9']
        ':'
        (
          | [U+01-U+08 U+0b U+0c U+0e-U+1f U+21-U+5a U+53-U+7f]
          | '\' [U+01-U+09 U+0b U+0c U+0e-U+7f]
        )+
    )
    ']'
)
```

Notice how the complex logic for matching a number between '0' and '255' is replaced by a simple
`range` expression in Pomsky.

We can also write the above as follows using variables:

```pomsky
let before_at = ['a'-'z' '0'-'9' "!#$%&'*+/=?^_`{|}~-"];
let escaped = '\' [U+01-U+09 U+0b U+0c U+0e-U+7f];
let quoted_before_at = [U+01-U+08 U+0b U+0c U+0e-U+1f U+21 U+23-U+5b U+5d-U+7f];
let port_digit = [U+01-U+08 U+0b U+0c U+0e-U+1f U+21-U+5a U+53-U+7f];

let lower_digit = ['a'-'z' '0'-'9'];
let lower_digit_dash = ['a'-'z' '0'-'9' '-'];

let domain_label = lower_digit (lower_digit_dash* lower_digit)?;

(
  | before_at+ ('.' before_at+)*
  | '"' (quoted_before_at | escaped)* '"'
)
'@'
(
  | (domain_label '.')+ domain_label
  | '['
    (:(range '0'-'255') '.'){3}
    (
      | :(range '0'-'255')
      | lower_digit_dash* lower_digit ':' (port_digit | escaped)+
    )
    ']'
)
```
