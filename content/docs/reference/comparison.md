---
title: 'Comparison with other projects'
description: 'See how pomsky compares to similar projects'
lead: ''
date: 2022-07-10T16:21:58+00:00
lastmod: 2022-07-10T16:21:58+00:00
draft: false
images: []
menu:
  docs:
    parent: 'reference'
weight: 305
toc: true
---

[This wiki](https://github.com/oilshell/oil/wiki/Alternative-Regex-Syntax) has a list of projects
with similar goals to Pomksy. Here's a list of the most popular projects:

{{< alert icon="⚠️" text="Disclaimer that as the maintainer of Pomsky, I am obviously biased. If you find any incorrect or misleading information, please <a href='https://github.com/rulex-rs/website/issues'>open an issue</a>." />}}

| Project                                  | Types                            | GitHub                                                |
| ---------------------------------------- | -------------------------------- | ----------------------------------------------------- |
| [Melody]                                 | _Transpiled_                     | {{<gh-stars yoav-lavi melody >}}                      |
| [Pomsky]                                 | _Transpiled_                     | {{<gh-stars rulex-rs pomsky >}}                       |
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

## Compatibility

Let's see what Regex flavors are supported by transpiled languages. We don't look at DSLs, because
they only target one flavor.

| Flavor     |     Melody      | Pomsky | Egg Expr. | Rx Expr. |
| ---------- | :-------------: | :----: | :-------: | :------: |
| ERE        |                 |        |    ✅     |    ✅    |
| ECMAScript |       ✅        |   ✅   |           |
| PCRE       | ✅<sup>\*</sup> |   ✅   |    ✅     |
| .NET       | ✅<sup>\*</sup> |   ✅   |           |
| Java       | ✅<sup>\*</sup> |   ✅   |           |
| Ruby       | ✅<sup>\*</sup> |   ✅   |           |
| Python     |                 |   ✅   |    ✅     |
| Rust       |                 |   ✅   |
| RE2        |                 |        |

<sup>\*</sup>Melody can only emit ECMAScript regexes, but they also happen to be compatible
with several other flavors.

### Explanation of the flavors

- **ERE** (extended regular expressions) are used by tools such as GNU `grep` and `awk`.
  Because ERE supports only the most basic features, it is _mostly_ forward compatible with other
  regex flavors.

- **ECMAScript** is the syntax used by JavaScript engines. Also `Boost.Regex` can be configured to
  use the ECMAScript syntax.

- **PCRE** (an acronym for "Perl compatible regular expression") is the syntax used by the PCRE(2)
  regex engine, which is arguably the most popular regex engine in the world. It is used by default
  in PHP and R, and can be embedded in many other languages. It can also be used by GNU `grep`.

- **.NET** refers to the `Regex` class in .NET languages such as C# and F#.

- **Java** refers to the `Pattern` class in Java's standard library. Equivalent to Kotlin's and
  Scala's regular expressions.

- **Ruby** refers to built-in regular expressions in Ruby.

- **Python** refers to Pythons `re` module. Note that Python 3 is required for good Unicode support.

- **Rust** refers to Rust's popular `regex` crate, which is used by `ripgrep`, for example.

- **RE2** refers to Google's RE2 regex engine. Go's `"regexp"` module uses an almost identical
  syntax.

## Features

Let's see what Regex features are supported by languages that are transpiled to regular expressions.

### Basic regex features

| Feature               |        Melody         |       Pomsky        | Egg Expr. | Rx Expr. |
| --------------------- | :-------------------: | :-----------------: | :-------: | :------: |
| Greedy quantifier     |          ✅           |         ✅          |    ✅     |    ✅    |
| Lazy quantifier       |          ✅           |         ✅          |    ✅     |    ✅    |
| Dot                   |          ✅           | partly<sup>\*</sup> |    ✅     |    ✅    |
| Special char          |          ✅           |         ✅          |    ✅     |    ✅    |
| Negated special char  |          ✅           |         ✅          |    ✅     |    ✅    |
| Character class       |          ✅           |         ✅          |    ✅     |    ✅    |
| Anchor                |          ✅           |         ✅          |    ✅     |    ✅    |
| Word boundary         |          ✅           |         ✅          |    ✅     |    ✅    |
| Negated word boundary |          ✅           |         ✅          |    ✅     |    ✅    |
| Character range       | partly<sup>\*\*</sup> |         ✅          |    ✅     |    ✅    |
| Character set         |                       |         ✅          |    ✅     |    ✅    |
| Negated character set |                       |         ✅          |    ✅     |    ✅    |
| Capturing group       |          ✅           |         ✅          |    ✅     |    ✅    |
| Non-capturing group   |          ✅           |         ✅          |    ✅     |    ✅    |
| Alternation           |          ✅           |         ✅          |    ✅     |    ✅    |
| POSIX class           |                       |         ✅          |           |    ✅    |

<sup>\*</sup>Pomsky deliberately does not support the dot. You can use instead:

- `C` to match all code points
- `![n]` to match all code points except line breaks

<sup>\*\*</sup>Character ranges in Melody are only supported for ASCII letters and digits.

### Advanced features

| Feature                    |        Melody         | Pomsky |       Egg Expr.       |       Rx Expr.        |
| -------------------------- | :-------------------: | :----: | :-------------------: | :-------------------: |
| Variables/macros           |          ✅           |   ✅   |          ✅           |          ✅           |
| Line comments              |          ✅           |   ✅   |          ✅           |          ✅           |
| Block comments             |          ✅           |        |                       |                       |
| Code point                 |                       |   ✅   |          ✅           |
| Lookaround                 |          ✅           |   ✅   |    ✅<sup>\*</sup>    |
| Named capturing group      |          ✅           |   ✅   |          ✅           |
| Backreference              |                       |   ✅   |    ✅<sup>\*</sup>    |          ✅           |
| Named backreference        |                       |   ✅   |    ✅<sup>\*</sup>    |
| Relative backreference     |                       |   ✅   |
| Unicode category           |          ✅           |   ✅   |
| Unicode script/block       |                       |   ✅   |                       |        partly         |
| Other Unicode property     |                       |   ✅   |
| Any code point             | partly<sup>\*\*</sup> |   ✅   | partly<sup>\*\*</sup> | partly<sup>\*\*</sup> |
| Any grapheme               |                       |   ✅   |
| Atomic group               |                       |        |    ✅<sup>\*</sup>    |
| Character set intersection |                       |        |                       |          ✅           |
| Character set subtraction  |                       |        |                       |
| Possessive quantifier      |                       |        |                       |
| Conditional                |                       |        |                       |
| Recursion                  |                       |        |                       |
| Modes                      |                       |        |                       |

<sup>\*</sup>These features should be supported in Oil but can't be used because of a
[bug][oil-bug].

<sup>\*\*</sup>All languages can match a code point with the dot, if multiline mode is enabled in the
regex engine.

## Tooling

| Tool               | Melody | Pomsky | Egg Expr. | Rx Expr. |
| ------------------ | :----: | :----: | :-------: | :------: |
| CLI                |   ✅   |   ✅   |           |
| REPL               |   ✅   |        |    ✅     |
| Online playground  |   ✅   |   ✅   |
| VS Code extension  |   ✅   |        |
| IntelliJ extension |   ✅   |        |
| Babel plugin       |   ✅   |        |
| Rust macro         |        |   ✅   |
| Linter             |        |        |
| Formatter          |        |        |

## Packages

| Tool                              | Melody | Pomsky |
| --------------------------------- | :----: | :----: |
| Brew package                      |   ✅   |        |
| AUR package                       |   ✅   |   ✅   |
| Nix flake                         |   ✅   |        |
| GitHub release binary for Apple   |   ✅   |   ✅   |
| GitHub release binary for Windows |        |   ✅   |
| GitHub release binary for Linux   |        |   ✅   |
| Node module                       |   ✅   |        |
| Python module                     |   ✅   |        |

## IDE features

| Feature                       | Melody (VS&nbsp;Code) | Melody (playground) | Pomsky (playground) |
| ----------------------------- | :-------------------: | :-----------------: | :-----------------: |
| Syntax highlighting           |          ✅           |         ✅          |         ✅          |
| Error highlighting            |                       |                     |         ✅          |
| Code folding                  |          ✅           |         ✅          |                     |
| Auto indentation              |          ✅           |         ✅          |         ✅          |
| Matching brackets and quotes  |          ✅           |                     |         ✅          |
| Keyword autocomplete          |          ✅           |                     |         ✅          |
| Variable autocomplete         |                       |                     |         ✅          |
| Character class autocomplete  |                       |                     |         ✅          |
| Unicode property autocomplete |                       |                     |         ✅          |
| Hover tooltips                |                       |                     |                     |
| Apply suggestions             |                       |                     |                     |
| Share link                    |                       |         ✅          |                     |

---

Found a mistake? Please [fix it on GitHub][edit-on-github].

[edit-on-github]: https://github.com/rulex-rs/website/blob/main/content/docs/reference/comparison.md
[oil-bug]: https://github.com/oilshell/oil/issues/1224
