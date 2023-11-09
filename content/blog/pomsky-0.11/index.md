---
title: 'Pomsky 0.11'
description: 'See what’s new in Pomsky 0.11'
excerpt: ''
date: 2023-11-09T10:00:00Z
lastmod: 2023-11-09T10:00:00Z
contributors: ['Ludwig Stecher']
draft: false
images: ['cover.png']
weight: 994
toc: true
---

![Cover art: A vibrant orange gradient moving up and down in waves on a deep blue background](cover.png)

I am excited to announce version 0.11 of Pomsky, the next level regular expression language! Pomsky makes it easier than ever to write _correct_ and _maintainable_ regular expressions. Pomsky expressions are transpiled to regexes and can be used with many regex engines.

## What's new?

This release comes with some exciting new features:

<div class="big-list">

- [Unit tests](#unit-tests) to make sure your Pomsky expressions are correct

- [Negation of variables](#negating-all-the-things) makes code re-use easier

- New [word boundaries](#new-word-boundaries) `<` and `>`, matching at the start and end of a word, respectively

- [Recursion](#recursion) to match recursive grammars in PCRE and Ruby

- Much improved [documentation](#improved-docs)

</div>

If you're unfamiliar with Pomsky, [here is a summary](/docs/get-started/quick-reference) of how Pomsky compares to regexes.

Let's look at the most exciting new features in this release!

## Unit tests

If you have non-trivial regular expressions in your code base, tests are essential to prevent regressions when modifying them. The tests also serve as documentation by showing what strings the expressions should match. Pomsky now makes it easier than ever to test regular expressions:

```pomsky
test {
  # unit tests go here!
  match '0.11.0';
  match '2023.3.7';
  match '1.0.0-beta+exp.sha.5114f85';
  match '1.0.0-rc.2';

  # these are invalid:
  reject '1.0';
  reject '1.2.3.4';
  reject '1.7_01';
  reject '^1.7.1';
}

let num = [ascii_digit]+;
let ident = [ascii_alnum '-']+;
let idents = ident ('.' ident)*;

# https://semver.org/
:major(num) '.' :minor(num) '.' :patch(num)
  ('-' :prerelease(idents))?
  ('+' :buildmeta(idents))?
```

Unit tests can also compare capturing groups:

```pomsky
test {
  match '1.0.0-beta+exp.sha.5114f85' as {
    major: '1',
    minor: '0',
    patch: '0',
    prerelease: 'beta',
    buildmeta: 'exp.sha.5114f85',
  };
}
```

You can run tests with the `--test` option.

The [VS Code extension](https://marketplace.visualstudio.com/items?itemName=pomsky-lang.pomsky-vscode) and the [online playground](https://playground.pomsky-lang.org/) were updated to execute the tests as you type, so you immediately see when a test fails – ideal for test-driven development. In VS Code this must be enabled with the `pomsky.runTests` setting.

Note that for now, tests are always run with the PCRE2 regex engine (except in the online playground, which uses the browser's regex engine). PCRE2 was chosen because it has the most features and is easy to statically link, but proper support for other regex engines is planned as well.

## Negating all the things

If you ever needed to negate a variable that refers to a character set, this is now possible:

```pomsky
let d = [digit '_'];

d !d   # output: [\d_][^\d_]
```

Until now, Pomsky's syntax allowed the `!` only in front of the tokens `[`, `<<`, `>>`, and `%`. This restriction has now been lifted.

### New word boundaries

Pomsky now supports `<` and `>` to match the start and end of a word, respectively. You could use the word boundary `%` for this, but `<` and `>` are more specialized since they can only match the start _or_ end of a word, but not both. It might not matter most of the time, but using `<` and `>` may be considered more idiomatic:

```pomsky
<'test'>
```

This matches the word "test", but not in "detest" or "testament".

### Recursion

When targeting PCRE or Ruby, you can now use recursion. It is pretty straightforward:

```pomsky
test {
  match '3+4*5';
  match '2+(4/(-2))*15';
}

# a nested mathematical expression
'-'? ([digit]+ | '(' recursion ')') (['+-*/'] recursion)*
```

This recursively matches the whole expression whenever the `recursion` keyword is encountered.

### Improved documentation

For this release, the web docs were overhauled.

Until now, the only documentation was the language tour, so it tried to accommodate everyone. This didn't work, as it was too advanced for beginners, too wordy for people already familiar in regular expressions, and too imprecise as a specification. The solution is to provide different materials for different people:
for

- A [quick reference](/docs/get-started/quick-reference/) for people who already know regular expressions and just want to learn Pomsky's syntax as quickly as possible

- A [language tour](/docs/language-tour/strings/) for to beginners to learn the fundamentals

- A [complete reference](/docs/reference/grammar/) to document everything precisely for contributors or users with a very specific question

I hope you enjoy the new docs. I always appreciate feedback!

---

See the full list of changes in the [changelog](https://github.com/pomsky-lang/pomsky/blob/v0.11/CHANGELOG.md).

## Roadmap update

As the year is coming to an end and most of the things I planned for 2023 are done, I am evaluating which issues I should tackle next. The following plan is quite ambitious, so let's see how much I will manage to implement next year!

### Language changes

There are many features waiting to be implemented: Modifiers (like `ignore_case`), intersection and subtraction of character sets, subroutine calls, conditionals, etc.

Other than that, the biggest focus next year will be on optimizations, so you can write expressions however you want without worrying too much about performance. Pomsky should feel more like a high-level language that lets you focus on the "business logic" instead of regex engine internals.

Another focus area will be diagnostics: Pomsky should detect when an expression has poor worst-case performance and could be vulnerable to ReDoS (regex denial-of-service) attacks. It should also detect more patterns that are illegal in the targeted regex engine, e.g. variable-length lookbehind in PCRE and Python.

### VS Code improvements

The VS Code extension is lacking some features one has come to expect from their IDE: Go to definition, renaming symbols, and finding usages.

To implement these, we need to parse Pomsky into a syntax tree, which is challenging because the existing parser is written in Rust, but the language server is written in TypeScript. Instead of rewriting the parser in TypeScript, one possibility is to use tree-sitter, a parser framework designed for IDEs.

### Tooling

To make migrating to Pomsky easier, I want to make a Regex to Pomsky converter. We also need a formatting tool (like _prettier_ or _rustfmt_) for Pomsky. These tools will be integrated in the CLI, the VS Code extension, and the online playground.

Writing the Regex to Pomsky converter will be particularly challenging, since it requires a configurable parser that can correctly parse all regex flavors supported by Pomsky.

## Support us!

Pomsky is a very small community, and most of the work is still done by me. To make the continued development of Pomsky sustainable, I am looking for contributors. There are lots of opportunities to help; you can drop by our [**Discord channel**](https://discord.gg/uwap2uxMFp) if you need guidance.

Also, consider [**sponsoring me**](https://github.com/sponsors/Aloso) to support my open source work!
