---
title: 'Comparison with other projects'
description: 'See how pomsky compares to similar projects'
excerpt: ''
date: 2022-07-10T16:21:58+00:00
lastmod: 2023-03-21T20:29:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'reference'
weight: 305
toc: true
---

[This wiki](https://github.com/oilshell/oil/wiki/Alternative-Regex-Syntax) has a list of projects
with similar goals to Pomsky. Here's a list of the most popular projects:

{{< alert icon="⚠️" text="Disclaimer that as the maintainer of Pomsky, I am obviously biased. If you find any incorrect or misleading information, please <a href='https://github.com/pomsky-lang/website/issues'>open an issue</a>." />}}

| Project                                  | Types                            | GitHub                                                |
| ---------------------------------------- | -------------------------------- | ----------------------------------------------------- |
| [Melody]                                 | _Transpiled_                     | {{<gh-stars yoav-lavi melody >}}                      |
| [Pomsky]                                 | _Transpiled_                     | {{<gh-stars pomsky-lang pomsky >}}                    |
| [Egg Expressions][egg-expressions]       | _Transpiled_<br>_App_: Oil shell |
| [Rx Expressions][emacs-rx]               | _Transpiled_<br>_App_: Emacs     |
| [Raku Grammars][raku-grammars]           | _App_: Raku                      |
| [Rosie]                                  | _App_: Rosie                     |
| [SRL]                                    | _DSL_: PHP                       | {{<gh-stars SimpleRegex SRL-PHP >}}                   |
| [Super Expressive][super-expressive]     | _DSL_: JS                        | {{<gh-stars francisrstokes super-expressive >}}       |
| [Verbal Expressions][verbal-expressions] | _DSL_: JS                        | {{<gh-stars VerbalExpressions JSVerbalExpressions >}} |
| [Swift RegexBuilder][swift-regexbuilder] | _DSL_: Swift                     |

[egg-expressions]: https://www.oilshell.org/release/latest/doc/eggex.html
[emacs-rx]: https://www.gnu.org/software/emacs/manual/html_node/elisp/Rx-Notation.html
[melody]: https://github.com/yoav-lavi/melody
[pomsky]: https://pomsky-lang.org/
[raku-grammars]: https://www.perl.com/article/perl-6-grammers-part-1/
[rosie]: https://rosie-lang.org/
[srl]: https://github.com/SimpleRegex/SRL-PHP
[super-expressive]: https://github.com/francisrstokes/super-expressive
[swift-regexbuilder]: https://developer.apple.com/documentation/RegexBuilder
[verbal-expressions]: https://verbalexpressions.github.io/JSVerbalExpressions/

Since this content is likely to get out of date, I encourage you to
[update it][edit-on-github].

## Types

### Transpiled

These languages are transpiled to "normal" regular expressions and can therefore be used anywhere.
They usually have command-line interface to compile expressions.

### Application specific

Some regex languages are specific to a certain application or programming language. For example,
[Raku grammars][raku-grammars] can only be used in Raku; egg expressions are transpiled, but they
are only available in the Oil shell.

### DSLs

DSLs (domain-specific languages) are languages that are embedded in another language using the host
language's syntax. For example, [Verbal Expressions][verbal-expressions] uses JavaScript methods:

```js
const tester = VerEx()
  .startOfLine()
  .then('http')
  .maybe('s')
  .then('://')
  .maybe('www.')
  .anythingBut(' ')
  .endOfLine()
```

This page currently only discusses transpiled languages, but I welcome contributions.

## Compatibility

Let's see what Regex flavors are supported by transpiled languages.

| Flavor     |     Melody      | Pomsky | Egg Expr. | Rx Expr. |
| ---------- | :-------------: | :----: | :-------: | :------: |
| ERE        |                 |        |    ✅     |    ✅    |
| ECMAScript |       ✅        |   ✅   |
| PCRE       | ✅<sup>\*</sup> |   ✅   |
| .NET       | ✅<sup>\*</sup> |   ✅   |
| Java       | ✅<sup>\*</sup> |   ✅   |
| Ruby       | ✅<sup>\*</sup> |   ✅   |
| Python     |                 |   ✅   |
| Rust       |                 |   ✅   |

<sup>\*</sup>Melody can only emit ECMAScript regexes, but they also happen to be compatible
with several other flavors.

### Explanation of the flavors

- **ERE** (extended regular expressions) are used by tools such as GNU `grep` and `awk`.
  Because ERE supports only the most basic features, it is _mostly_ forward compatible with other
  regex flavors.

- **ECMAScript** is the syntax used in JavaScript and related languages (TypeScript, Elm, Dart, etc.) that are compiled to JS.

- **PCRE** (an acronym for "Perl compatible regular expression") is the syntax used by the PCRE2 regex engine, which is the default in at least Crystal, Delphi, Elixir, Erlang, Hack, Julia, PHP, R and Vala. It's also a popular choice in other languages like C and C++ and is used in many applications such as the Apache server, nginx, MariaDB, MongoDB, and optionally in GNU `grep`.

- **.NET** refers to the `Regex` class in .NET languages such as C# and F#.

- **Java** refers to the `Pattern` class in Java's standard library. Equivalent to Kotlin's and
  Scala's regular expressions.

- **Ruby** refers to built-in regular expressions in Ruby.

- **Python** refers to Pythons `re` module. Note that Python 3 is required for good Unicode support.

- **Rust** refers to Rust's popular `regex` crate (used by `ripgrep`)

Many more flavors exist, which are not (or only partially) supported by Pomsky and other languages.

## Features

Let's see what Regex features are supported by languages that are transpiled to regular expressions.

### Basic regex features

| Feature                            |       Melody        | Pomsky | Egg Expr. | Rx Expr. |
| ---------------------------------- | :-----------------: | :----: | :-------: | :------: |
| [Greedy repetition][greedy]        |         ✅          |   ✅   |    ✅     |    ✅    |
| [Lazy repetition][lazy]            |         ✅          |   ✅   |    ✅     |    ✅    |
| [Dot]                              |         ✅          |   ✅   |    ✅     |    ✅    |
| [Character escape][non-printable]  |         ✅          |   ✅   |    ✅     |    ✅    |
| [Character class][shorthand]       |         ✅          |   ✅   |    ✅     |    ✅    |
| [Anchor]                           |         ✅          |   ✅   |    ✅     |    ✅    |
| [Word boundary][boundary]          |         ✅          |   ✅   |    ✅     |    ✅    |
| [Negated word boundary][boundary]  |         ✅          |   ✅   |    ✅     |    ✅    |
| [Character range][charclass]       | partly<sup>\*</sup> |   ✅   |    ✅     |    ✅    |
| [Character set][charclass]         |                     |   ✅   |    ✅     |    ✅    |
| [Negated character set][charclass] | partly<sup>\*</sup> |   ✅   |    ✅     |    ✅    |
| [Capturing group][capture]         |         ✅          |   ✅   |    ✅     |    ✅    |
| [Alternation]                      |         ✅          |   ✅   |    ✅     |    ✅    |
| [POSIX class][posix-class]         |                     |   ✅   |    ✅     |    ✅    |
| [Non-capturing group][noncapture]  |         ✅          |   ✅   |    ✅     |          |

[greedy]: https://www.regular-expressions.info/repeat.html
[lazy]: https://www.regular-expressions.info/repeat.html#lazy
[non-printable]: https://www.regular-expressions.info/nonprint.html
[dot]: https://www.regular-expressions.info/dot.html
[shorthand]: https://www.regular-expressions.info/shorthand.html
[anchor]: https://www.regular-expressions.info/anchors.html
[boundary]: https://www.regular-expressions.info/wordboundaries.html
[charclass]: https://www.regular-expressions.info/charclass.html
[capture]: https://www.regular-expressions.info/brackets.html
[noncapture]: https://www.regular-expressions.info/brackets.html#noncap
[alternation]: https://www.regular-expressions.info/alternation.html
[posix-class]: https://www.regular-expressions.info/posixbrackets.html#class

<sup>\*</sup>Character ranges and negated sets in Melody only support ASCII letters, digits and
a few special characters.

### Advanced features

| Feature                                     |       Melody        |       Pomsky        |      Egg Expr.      |      Rx Expr.       |
| ------------------------------------------- | :-----------------: | :-----------------: | :-----------------: | :-----------------: |
| [Variable]/macro                            |         ✅          |         ✅          |         ✅          |         ✅          |
| [Line comment][line-comment]                |         ✅          |         ✅          |         ✅          |         ✅          |
| [Block comment][block-comment]              |         ✅          |                     |                     |                     |
| [Code point][codepoint]                     |                     |         ✅          |         ✅          |
| [Lookaround]                                |         ✅          |         ✅          |                     |
| [Named capturing group][named-capture]      |         ✅          |         ✅          |         ✅          |
| [Backreference]                             |                     |         ✅          |                     |         ✅          |
| [Named backreference][named-ref]            |                     |         ✅          |                     |
| [Relative backreference][relative-ref]      |                     |         ✅          |
| [Unicode category][category]                |         ✅          |         ✅          |
| [Unicode script][script]/[block]            |                     |         ✅          |                     |       partly        |
| [Other Unicode property][unicode]           |                     |         ✅          |
| [Any code point][built-in-vars]             | partly<sup>\*</sup> |         ✅          | partly<sup>\*</sup> | partly<sup>\*</sup> |
| [Any grapheme][built-in-vars]               |                     |         ✅          |
| [Atomic group][atomic]                      |                     |         ✅          |                     |
| [Character set intersection][charintersect] |                     |                     |                     |         ✅          |
| [Character set subtraction][charsubtract]   |                     |                     |                     |
| [Possessive quantifier][possessive]         |                     |                     |                     |
| [Conditional]                               |                     |                     |                     |
| [Recursion]                                 |                     |                     |                     |
| [Modifier]                                  |                     |                     |                     |
| [Inline regex][inline-regex]                |         ✅          |         ✅          |                     |
| Optimization                                |                     | some<sup>\*\*</sup> |                     |

[variable]: https://pomsky-lang.org/docs/language-tour/variables/
[line-comment]: https://pomsky-lang.org/docs/language-tour/basics/
[block-comment]: https://yoav-lavi.github.io/melody/book/syntax.html#extras
[codepoint]: https://www.regular-expressions.info/unicode.html#codepoint
[lookaround]: https://www.regular-expressions.info/lookaround.html
[named-capture]: https://www.regular-expressions.info/named.html
[named-ref]: https://www.regular-expressions.info/named.html
[relative-ref]: https://www.regular-expressions.info/backrefrel.html
[backreference]: https://www.regular-expressions.info/backref.html
[category]: https://www.regular-expressions.info/unicode.html#category
[script]: https://www.regular-expressions.info/unicode.html#script
[block]: https://www.regular-expressions.info/unicode.html#block
[unicode]: https://www.regular-expressions.info/unicode.html
[built-in-vars]: https://pomsky-lang.org/docs/reference/built-in-variables/
[atomic]: https://www.regular-expressions.info/atomic.html
[charsubtract]: https://www.regular-expressions.info/charclasssubtract.html
[charintersect]: https://www.regular-expressions.info/charclassintersect.html
[possessive]: https://www.regular-expressions.info/possessive.html
[conditional]: https://www.regular-expressions.info/conditional.html
[recursion]: https://www.regular-expressions.info/recurse.html
[modifier]: https://www.regular-expressions.info/refmodifiers.html
[inline-regex]: https://pomsky-lang.org/docs/language-tour/regex/

Note that Melody and Pomsky support inline regexes. Because of this, all Regex features are _technically_ supported in Melody and Pomsky, but using inline regexes may be less ergonomic and more dangerous to use than properly supported features.

<sup>\*</sup>All languages can match a code point with the dot, if multiline mode is enabled in the
regex engine.

<sup>\*\*</sup>Pomsky can currently optimize repetitions, remove redundant or empty groups and deduplicate code points in character sets. More optimizations are planned.

## Tooling

| Tool               | Melody |                 Pomsky                  | Egg Expr. | Rx Expr. |
| ------------------ | :----: | :-------------------------------------: | :-------: | :------: |
| CLI                |   ✅   |                   ✅                    |           |
| REPL               |   ✅   |                                         |    ✅     |
| Online playground  |   ✅   |                   ✅                    |
| VSCode extension   |   ✅   |                                         |
| IntelliJ extension |   ✅   |                                         |
| JavaScript bunder  | Babel  | Vite,<br>Rollup,<br>ESBuild,<br>Webpack |
| Rust macro         |        |                   ✅                    |
| Linter             |        |                                         |
| Formatter          |        |                                         |

## Language integrations

## Packages

| Tool                            | Melody | Pomsky |
| ------------------------------- | :----: | :----: |
| Homebrew                        |   ✅   |   ✅   |
| AUR                             |   ✅   |   ✅   |
| Nix                             |   ✅   |   ✅   |
| GitHub release binary (Apple)   |   ✅   |   ✅   |
| GitHub release binary (Windows) |        |   ✅   |
| GitHub release binary (Linux)   |        |   ✅   |
| Node module                     |   ✅   |   ✅   |
| Python module                   |   ✅   |        |

## IDE features

| Feature                       |     Melody     |     Pomsky     |
| ----------------------------- | :------------: | :------------: |
| Syntax highlighting           |       ✅       |       ✅       |
| Error highlighting            |                |       ✅       |
| Code folding                  | ✅<sup>1</sup> | ✅<sup>1</sup> |
| Auto indentation              |       ✅       |       ✅       |
| Snippets                      |       ✅       |       ✅       |
| Matching brackets and quotes  | ✅<sup>2</sup> |       ✅       |
| Keyword autocomplete          | ✅<sup>2</sup> |       ✅       |
| Variable autocomplete         |                | ✅<sup>3</sup> |
| Backreference autocomplete    |                |                |
| Character class autocomplete  |                |       ✅       |
| Unicode property autocomplete |                |       ✅       |
| Hover tooltips                |                |                |
| Apply suggestions             |                |                |
| Share link (playground)       |       ✅       |       ✅       |

<sup>1</sup> indentation based\
<sup>2</sup> works in playground VSCode, but not in the playground\
<sup>3</sup> does not take scopes into account

---

Found a mistake? Please [fix it on GitHub][edit-on-github].

[edit-on-github]: https://github.com/pomsky-lang/website/blob/main/content/docs/reference/comparison.md
[oil-bug]: https://github.com/oilshell/oil/issues/1224
