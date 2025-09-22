---
title: 'Boundaries'
description: 'Reference – Assert that a position is a word boundary or anchor'
---

Boundaries (word boundaries and anchors) are assertions that match if the current position has a
certain property.

## Syntax

```pomsky
let Boundary =
    | '^'
    | '$'
    | '%'
    | '<'
    | '>';
```

## Example

```pomsky
^ $           # match empty string
% 'foo' %     # match 'foo' surrounded by word boundaries
!% 'foo' !%   # match 'foo' not surrounded by word boundaries
< 'foo' >     # match 'foo' as a whole word
```

## Support

Anchors (`^` and `$`) are supported in all flavors. Word boundaries (`%`, `<`, and `>`) are not
supported in JavaScript unless Unicode is disabled.

Support for boundaries is gated by the `boundaries` feature. Specify features with the
`--allowed-features` option.

## Behavior

All boundaries are assertions – they match between two characters. They do not contain any text,
and repeating them has no effect.

### Anchors

`^` and `$` are anchors. They match at the start and end of the string, respectively. Regex engines
usually have a way to change their behavior to match at the start and end of the _line_ instead.

They have the built-in `Start` and `End` variables as aliases.

### Word boundaries

`%` is a word boundary, which matches either at the start or at the end of a word. `<` only matches
at the start of a word, `>` only at the end. Surround a word with `% %` or with `< >` to make sure
it doesn't match a substring of a word, e.g. `test` in the word `detest`.

A word boundary is a position next to a "word character" (matching `[word]`#po), but
only on one side. A word character is a character in one of the following Unicode general
categories:

- Alphabetic
- Mark
- Decimal_Number
- Connector_Punctuation
- Join_Control

In the ASCII subset of Unicode, this would be the letters `a-z` and `A-Z`, the digits `0-9`, and the
underscore `_`.

The `%` word boundary is the only boundary that can be negated. `!%` matches a position that is not
a word boundary, which means that it must be surrounded by either 0 or 2 word characters.

### Relation to lookaround

Every boundary can be expressed in terms of lookaround assertions:

| Boundary | Equivalent lookarounds                    |
| -------- | ----------------------------------------- |
| `^`#po   | `!<< C`#po                                |
| `$`#po   | `!>> C`#po                                |
| `%`#po   | `(<<[w]) (!>>[w]) \| (!<<[w]) (>>[w])`#po |
| `!%`#po  | `(<<[w]) (>>[w]) \| (!<<[w]) (!>>[w])`#po |
| `<`#po   | `(!<<[w]) (>>[w])`#po                     |
| `>`#po   | `(<<[w]) (!>>[w])`#po                     |

## Compilation

Anchors are compiled verbatim to `^` and `$`. Word boundaries are compiled to `\b`, or `\B` when
negated.

`<` and `>` are compiled to

- `[[:<:]]` and `[[:>:]]` when targeting PCRE
- `\<` and `\>` when targeting Rust
- `(?<!\w)(?=\w)` and `(?<=\w)(?!\w)` when targeting any other flavor

## Issues

In JavaScript, word boundaries are never Unicode aware, so they are only allowed when Unicode is
explicitly disabled.

In other flavors, word boundaries are always Unicode aware, even when Unicode has been disabled.

## History

- Added `<` and `>` in Pomsky 0.11
- Forbidden `%` in JavaScript unless Unicode is disabled in Pomsky 0.10
- Removed deprecated `<%` and `%>` syntax in Pomsky 0.7
- Added `^` and `$` in Pomsky 0.6
- Added `Start` and `End` variables in Pomsky 0.4.2
- Initial implementation in Pomsky 0.1
  - Using old syntax `<%` and `%>` instead of `^` and `$`
