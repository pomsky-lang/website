---
title: 'Pomsky 0.10 released with new tools'
description: 'See what’s new in Pomsky 0.10, and how to it from JavaScript!'
excerpt: >
  Just last week, Pomsky celebrated its first birthday! Today, I'm announcing version 0.10, along with a VSCode extension and a JavaScript plugin. This allows you to write regular expressions with Pomsky, and include them as `RegExp` with a bundler like Vite or Webpack.

  ***

  [Continue reading](/blog/pomsky-0-10/)
date: 2023-03-22T00:00:00
---

![Cover art: A grown husky standing in the grass on a river bank, as if he is thinking about taking a swim. It is a beautiful, sunny day, and the husky looks happy as he is sticking out his tongue. His fur is black on the back and changes to light gray towards the legs. His face is mostly white, with a black forehead. His neck has white and dark parts.](_cover.jpg)

Just last week, Pomsky celebrated its first birthday! Today, I'm announcing version 0.10, along with a VSCode extension and a JavaScript plugin. This allows you to write regular expressions with Pomsky, and include them as `RegExp` with a bundler like [Vite](https://vitejs.dev/) or [Webpack](https://webpack.js.org/).

## What is Pomsky?

Pomsky is a modern syntax for regular expressions, transpiled to regexes compatible with JavaScript, Java, PCRE, Rust, Ruby, Python, or .NET. It aims to be more readable, portable, and powerful than traditional regexes. The biggest difference is that Pomsky is whitespace-insensitive, and string literals are quoted. For example, the regex `\[.+\]`#re could be written as `'[' .+ ']'`#po. Here's a larger example that shows Pomsky's strengths:

```pomsky
# variables allow code re-use
let octet = range '0'-'255';

# ranges can match multi-digit numbers
let subnetMask = '/' range '0'-'32';

# concise syntax for named capturing groups (ipv4, mask)
:ipv4(octet ('.' octet){3}) :mask(subnetMask)?
```

This is transpiled to the following regex:

<!-- TODO: Figure out why this code snippet breaks the "reading time" metric -->

```regexp
(?<ipv4>(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-5]?|[6-9])?|[3-9][0-9]?)(?:\.(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-5]?|[6-9])?|[3-9][0-9]?)){3})(?<mask>/(?:0|[1-2][0-9]?|3[0-2]?|[4-9]))?
```

## What's new

Version 0.10 includes a number of language changes and new tools.

### VSCode extension

Pomsky now has a [VSCode extension](https://marketplace.visualstudio.com/items?itemName=pomsky-lang.pomsky-vscode), with syntax highlighting, auto-completion, and diagnostics (errors and warnings). It also has a preview panel, which you can open with the icon in the top right corner or from the right-click menu:

![VSCode window showing a Pomsky file with the '.pom' extension on the left, and a panel with the compiled regular expression on the right. The panel has a toolbar with a dropdown to select a regex flavor. VSCode's blue toolbar at the bottom tells us that the expression was compiled in 0.07 ms, using Pomsky 0.10.0](./pomsky-vscode.png)

To use the VSCode extension, you currently need to have Pomsky installed locally. You can download it [from the releases page](https://github.com/pomsky-lang/pomsky/releases). If you want to try Pomsky without installing anything, check out the [playground](https://playground.pomsky-lang.org/)!

Note that we don't have an official file extension yet. You can vote for one [here](https://github.com/pomsky-lang/pomsky/issues/77).

### JavaScript plugin

Thanks to [@Kyza](https://github.com/Kyza), we now have a [JavaScript plugin](https://github.com/pomsky-lang/unplugin-pomsky) that allows you to easily import Pomsky expressions in your JavaScript projects using Vite, Webpack, Rollup, ESBuild or ESM. Once you followed the [installation instructions](https://github.com/pomsky-lang/unplugin-pomsky#readme), you can use it like this:

```js
import ipv4 from './ipv4.pom'

function isValidIpV4(string) {
  return ipv4().test(string)
}
```

How does it work? The plugin looks for imports with the file extension `.pom` or `.pomsky` and transforms them to export a function that returns the corresponding `RegExp`. This is done at build time, so it doesn't affect website performance. I would like to thank [@Kyza](https://github.com/Kyza) for creating this wonderful plugin.

### Disabling Unicode

One annoying thing about regular expressions in JavaScript is that `\w`#re and `\b`#re do not respect Unicode, even if the `u` flag (short for `unicode`) is set! Pomsky polyfills Unicode support for `[word]`#po, but not for `%`#po (a word boundary) for several reasons[^1].

To address this issue, Pomsky now lets you opt out of Unicode support. Now word boundaries are forbidden in the JavaScript flavor, but can be used if you disable Unicode support:

```pomsky
disable unicode;
% 'Pomsky' %
```

This makes sense when you know that your input contains only ASCII characters. It also has the advantage that some shorthands, such as `[word]`#po, can be optimized better: `[word]`#po normally matches over 800 Unicode ranges, but when Unicode is disabled, it's just `[a-zA-Z0-9_]`, which is more performant.

### Reserved keywords

`U` was reserved to make the syntax for codepoints (e.g. `U+FF`) unambiguous. Now codepoints can be parsed even if they contain spaces (e.g. `U + FF`), although this isn't usually recommended.

Also, `test` has been reserved as a keyword to support unit testing in the future. Pomsky will be able to run unit tests during compilation to make sure that the regex matches certain strings:

```pomsky
test {
  match '127.0.0.1';
  match '80.255.255.254/24';
  reject '400.1.2.3';
}

# your Pomsky expression here...
```

These tests not only give you immediate feedback if the expression is incorrect, they also document the code so that a reader can see examples of what the expression does or does not match. Unit tests will probably land in Pomsky 0.11, but the syntax is not fully fleshed out yet. [Let me know](https://github.com/pomsky-lang/pomsky/issues/75#issuecomment-1461616716) what you think!

You can find the full list of changes in the [changelog](https://github.com/pomsky-lang/pomsky/blob/main/CHANGELOG.md#0100---2023-03-21).

## A glimpse into the crystal ball

In January, I published my [roadmap](https://pomsky-lang.org/blog/pomsky-0.9-and-our-roadmap/#roadmap) for this year, and some things are already done! The VSCode extension is not feature complete, but it is already very useful. Most of the language improvements I envisioned in January have also been implemented. The testing infrastructure has also made progress: All regex flavors are now tested in CI and compiled in our fuzzer.

As for the future, it can be hard to predict what will happen. For example, I didn't expect someone to create a JavaScript plugin, which was a pleasant surprise! I also underestimated my own velocity, so some of the things I put in the "not planned" section could be completed this year.

If there is something you would like to work on, any help is appreciated! Pomsky has some [good first issues](https://github.com/pomsky-lang/pomsky/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). For example, if you're a native English speaker, we could use your help to overhaul the documentation.

If you like Pomsky, consider [sponsoring me](https://github.com/sponsors/Aloso). You can also give Pomsky a [star](https://github.com/pomsky-lang/pomsky) and join our [Discord server](https://discord.gg/uwap2uxMFp).

Cheers,\
Ludwig

[^1]: `[word]` is polyfilled as `[\p{Alphabetic}\p{M}\p{Nd}\p{Pc}]`#re. Word boundaries (`%`) aren't polyfilled for two reasons: First, the produced regex would be very large: `(?:(?&lt;![\p{Alphabetic}\p{M}\p{Nd}\p{Pc}])(?=[\p{Alphabetic}\p{M}\p{Nd}\p{Pc}])|(?&lt;=[\p{Alphabetic}\p{M}\p{Nd}\p{Pc}])(?![\p{Alphabetic}\p{M}\p{Nd}\p{Pc}]))`#re Secondly, the polyfill requires lookbehind, which isn't universally supported. Notably, lookbehind doesn't work in Safari.
