---
title: 'Quick reference'
description: 'Quickly get familiar with the syntax'
excerpt: ''
date: 2023-10-17T13:55:00+00:00
lastmod: 2022-10-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'get-started'
weight: 6002
toc: true
---

## Basics

| Pomsky                            | Explanation                        | Regex                                 |
| --------------------------------- | ---------------------------------- | ------------------------------------- |
| {{<po>}}"string"{{</po>}}         | String                             | {{<regexp>}}string{{</regexp>}}       |
| {{<po>}}'string'{{</po>}}         | Raw string (no backslash escaping) | {{<regexp>}}string{{</regexp>}}       |
| {{<po>}}'a' &#x7c; 'b'{{</po>}}   | a OR b                             | {{<regexp>}}a&#x7c;b{{</regexp>}}     |
| {{<po>}}('a' &#x7c; 'b'){{</po>}} | Group (non-capturing)              | {{<regexp>}}(?:a&#x7c;b){{</regexp>}} |
| {{<po>}}# comment{{</po>}}        | Line comment                       | {{<regexp>}}(?#comment){{</regexp>}}  |
| {{<po>}}.{{</po>}}                | any code point except `\n` [^1]    | {{<regexp>}}.{{</regexp>}}            |

## Repetitions

<!-- prettier-ignore -->
| Pomsky                        | Explanation                  | Regex                                  |
| ----------------------------- | ---------------------------- | -------------------------------------- |
| {{<po>}}'test'*{{</po>}}      | 0 or more                    | {{<regexp>}}(?:test)*{{</regexp>}}     |
| {{<po>}}'test'+{{</po>}}      | 1 or more                    | {{<regexp>}}(?:test)+{{</regexp>}}     |
| {{<po>}}'test'?{{</po>}}      | 0 or 1                       | {{<regexp>}}(?:test)?{{</regexp>}}     |
| {{<po>}}'test'{4,}{{</po>}}   | 4 or more times              | {{<regexp>}}(?:test){4,}{{</regexp>}}  |
| {{<po>}}'test'{4,7}{{</po>}}  | 4 to 7 times                 | {{<regexp>}}(?:test){4,7}{{</regexp>}} |
| {{<po>}}'test'+ lazy{{</po>}} | Lazy (non-greedy) repetition | {{<regexp>}}(?:test)+?{{</regexp>}}    |

## Variables

```pomsky
let x = 'foo' | 'bar';

x '-' x
```

Variables are replaced with their content in the produced regex:

```regexp
(?:foo|bar)-(?:foo|bar)
```

## Character sets

| Pomsky                         | Explanation                         | Regex                                 |
| ------------------------------ | ----------------------------------- | ------------------------------------- |
| {{<po>}}[···]{{</po>}}         | character set                       | {{<regexp>}}[···]{{</regexp>}}        |
| {{<po>}}![···]{{</po>}}        | negated character set               | {{<regexp>}}[^···]{{</regexp>}}       |
| {{<po>}}[n t]{{</po>}}         | special characters (line feed, tab) | {{<regexp>}}[\n\t]{{</regexp>}}       |
| {{<po>}}['a' 'd']{{</po>}}     | an 'a' or 'd'                       | {{<regexp>}}[ad]{{</regexp>}}         |
| {{<po>}}['ad']{{</po>}}        | an 'a' or 'd'                       | {{<regexp>}}[ad]{{</regexp>}}         |
| {{<po>}}['a'-'d']{{</po>}}     | code points 'a' through 'd'         | {{<regexp>}}[a-d]{{</regexp>}}        |
| {{<po>}}[U+45 U+FFEF]{{</po>}} | code points U+0045 and U+FFEF       | {{<regexp>}}[\x45\uFFEF]{{</regexp>}} |

## Built-in character classes

| Pomsky                                        | Explanation                                   | Regex                               |
| --------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| {{<po>}}[word]{{</po>}}, {{<po>}}[w]{{</po>}} | any 'word' code point (letter, digit, or `_`) | {{<regexp>}}\w{{</regexp>}}         |
| {{<po>}}[Latin]{{</po>}}                      | any code point in the 'Latin' script          | {{<regexp>}}\p{Latin}{{</regexp>}}  |
| {{<po>}}[Letter]{{</po>}}                     | any code point in the 'Letter' category       | {{<regexp>}}\p{Letter}{{</regexp>}} |
| {{<po>}}[ascii_digit]{{</po>}}                | any ASCII digit                               | {{<regexp>}}[0-9]{{</regexp>}}      |
| {{<po>}}[!word]{{</po>}}                      | any code point except 'word' code points      | {{<regexp>}}\W{{</regexp>}}         |

See [all shorthand character classes](../../language-tour/shorthands) and [all supported Unicode properties](../../appendix/unicode-properties).

## Anchors, boundaries, assertions

These don't match one or more characters, but a _position_ in the string.

| Pomsky                     | Explanation                  | Regex                              |
| -------------------------- | ---------------------------- | ---------------------------------- |
| {{<po>}}^{{</po>}}         | start of string [^2]         | {{<regexp>}}^{{</regexp>}}         |
| {{<po>}}${{</po>}}         | end of string [^2]           | {{<regexp>}}${{</regexp>}}         |
| {{<po>}}%{{</po>}}         | word boundary                | {{<regexp>}}\b{{</regexp>}}        |
| {{<po>}}!%{{</po>}}        | not a word boundary          | {{<regexp>}}\B{{</regexp>}}        |
| {{<po>}}&lt;{{</po>}}      | start of a word              |
| {{<po>}}&gt;{{</po>}}      | end of a word                |
| {{<po>}}(>> 'x'){{</po>}}  | lookahead assertion          | {{<regexp>}}(?=x){{</regexp>}}     |
| {{<po>}}(<< 'x'){{</po>}}  | lookbehind assertion         | {{<regexp>}}(?&lt;=x){{</regexp>}} |
| {{<po>}}(!>> 'x'){{</po>}} | negated lookahead assertion  | {{<regexp>}}(?!x){{</regexp>}}     |
| {{<po>}}(!<< 'x'){{</po>}} | negated lookbehind assertion | {{<regexp>}}(?&lt;!x){{</regexp>}} |

## Capturing groups and references

| Pomsky                       | Explanation                      | Regex                                   |
| ---------------------------- | -------------------------------- | --------------------------------------- |
| {{<po>}}:('foo'){{</po>}}    | capturing group                  | {{<regexp>}}(foo){{</regexp>}}          |
| {{<po>}}:bar('foo'){{</po>}} | capturing group named 'bar'      | {{<regexp>}}(?&lt;bar>foo){{</regexp>}} |
| {{<po>}}::1{{</po>}}         | reference to 1st capturing group | {{<regexp>}}\1{{</regexp>}}             |
| {{<po>}}::bar{{</po>}}       | reference to group named 'bar'   | {{<regexp>}}\k&lt;bar>{{</regexp>}}     |
| {{<po>}}::-2{{</po>}}        | relative backreference           | {{<regexp>}}\k&lt;-2>{{</regexp>}}      |
| {{<po>}}::+1{{</po>}}        | relative forward reference       |

## Wildcard patterns

| Pomsky                                         | Explanation                     | Regex                           |
| ---------------------------------------------- | ------------------------------- | ------------------------------- |
| {{<po>}}.{{</po>}}                             | any code point except `\n` [^1] | {{<regexp>}}.{{</regexp>}}      |
| {{<po>}}Codepoint{{</po>}}, {{<po>}}C{{</po>}} | any code point                  | {{<regexp>}}[\s\S]{{</regexp>}} |
| {{<po>}}Grapheme{{</po>}}, {{<po>}}G{{</po>}}  | any grapheme                    | {{<regexp>}}\X{{</regexp>}}     |

## Testing

```pomsky
test {
  match 'foo';

  match 'the', 'fox', 'the', 'dog'
     in 'the quick brown fox jumps over the lazy dog.';

  reject 'lazy';

  reject in 'lorem ipsum dolor';
}

% [w]{3} %
```

Comparing capturing groups:

```pomsky
test {
  match '13.1.4' as { major: '13', minor: '1', patch: '4' };

  match '13.1.4' as { 1: '13', 2: '1', 3: '4' };
}

:major([d]+) '.' :minor([d]+) '.' :patch([d]+)
```

## Modifiers

| Pomsky                            | Explanation                                     | Regex                         |
| --------------------------------- | ----------------------------------------------- | ----------------------------- |
| {{<po>}}enable lazy;{{</po>}}     | enable lazy repetition by default               | {{<regexp>}}(?U){{</regexp>}} |
| {{<po>}}disable lazy;{{</po>}}    | disable lazy repetition by default              |
| {{<po>}}enable unicode;{{</po>}}  | enable Unicode awareness _(enabled by default)_ |
| {{<po>}}disable unicode;{{</po>}} | disable Unicode awareness                       |

## Other

| Pomsky                                    | Explanation                       | Regex                             |
| ----------------------------------------- | --------------------------------- | --------------------------------- |
| {{<po>}}range '0'-'255'{{</po>}}          | all decimal numbers from 0 to 255 |
| {{<po>}}range '0'-'1FF' base 16 {{</po>}} | all hex numbers from 0 to 1FF     |
| {{<po>}}atomic('foo'){{</po>}}            | atomic group                      | {{<regexp>}}(?>foo){{</regexp>}}  |
| {{<po>}}recursion{{</po>}}                | recursively match the whole regex | {{<regexp>}}\g<0>{{</regexp>}}    |
| {{<po>}}regex '[]acf-X]'{{</po>}}         | inline regex                      | {{<regexp>}}[]acf-X]{{</regexp>}} |

**Footnotes**

[^1]: with the single-line flag, `.` also matches line breaks.
[^2]: in multiline mode, these match the start or end of the line.
