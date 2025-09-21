---
title: 'Pomsky 0.7 released'
description: 'I just released Pomsky 0.7 with a new, much faster parser.'
date: 2022-09-10
excerpt: >
  I just released Pomsky 0.7 with a new, much faster parser.<br/><br/>

  Pomsky is a portable, modern syntax for regular expressions. It has powerful features, such as variables, and a much more readable syntax. Check out the language tour to quickly get familiar with Pomsky, or the examples to see some real Pomsky expressions.

  ***

  [Continue reading](/blog/pomsky-0-7/)
---

> I just released Pomsky 0.7 with a new, much faster parser.

![Pomsky](_pomsky.jpg)

## What is Pomsky?

Pomsky is a portable, modern syntax for regular expressions. It has powerful features, such as
variables, and a much more readable syntax. Check out the
[language tour](https://pomsky-lang.org/docs/language-tour/basics/) to quickly get familiar with
Pomsky, or the [examples](https://pomsky-lang.org/docs/examples/) to see some real Pomsky
expressions.

Pomsky is _not_ a regex engine. Instead, a Pomsky expression is transpiled to a normal RegExp,
compatible with many RegExp engines, including JavaScript, Java, PCRE, Ruby, Python, Rust and .NET.

## Summary of the changes

Because I didn't publish a blog post when I released version 0.6, this post is a bit longer. Here's
a summary:

> - The parser was rewritten and is now much faster
>
> - Pomsky is now published as WASM module to npm
>
> - Some syntax additions make writing Pomsky expressions more fun
>
> - Diagnostics were improved again. Most importantly, Pomsky now detects typos and suggests the
>   correct spelling!
>
> - The binary size has been significantly decreased

## The new parser

The biggest change in this release is that the parser was rewritten from scratch. It previously used
[nom](https://docs.rs/nom/latest/nom/) parser combinators, but over time it became evident that
nom isn't well suited for my use case. It made me jump through hoops to get decent error messages,
and performance was less than ideal. I considered optimizing other parts of the compiler, but it
turns out that parsing is the only performance bottleneck in Pomsky; all other compiler passes
take only a small fraction of the time required for parsing.

The new parser doesn't use any libraries. It has all the flexibility I need, and turned out to be
much faster. I haven't even started to optimize it, and it's already outperforming the previous
parser by **up to 500%** according to my
[benchmarks](https://github.com/pomsky-lang/pomsky/tree/main/benchmark).

So how did the code change? It became slightly longer, but in exchange, control flow is much more
explicit, so it's easier to reason about the code.

During the rewrite, I was glad that Pomsky has a variety of integration tests that cover both valid
and invalid inputs. Once the code compiled again, I ran the test suite to identify bugs. When all
the bugs I found were fixed and all 200 tests were green, I had much more confidence that my code
was correct.

## The WASM module

Pomsky is now [published to npm](https://www.npmjs.com/package/pomsky-wasm). Getting it to work
turned out to be much more difficult than anticipated, but I finally found a good solution.

The problem was that the WASM module, compiled with `wasm-pack`, didn't work when imported with NPM
and served with Vite in development mode. It did work with Vite in release mode and with Webpack,
but my particular configuration seemed _jinxed_. As I'm not ready to enter the world of pain that
is Webpack again, I spent lots of hours researching the problem.

<br>

> What is Vite?
>
> In case you're not familiar, Vite is a modern JavaScript bundler. It is much faster than Webpack,
> requires less configuration, and many things (including TypeScript and SCSS support) work out of
> the box.

<br>

I actually found two problems:

1. `wasm-pack` emits JavaScript modules added with `wasm_bindgen` in a folder called `snippets`,
   but this folder isn't included in the `package.json` file, so it is ignored when publishing the
   module to NPM.

2. Vite does some optimizations even in development mode. The optimized files are put in the
   `node_modules/.vite/deps` folder. This broke the dynamic import of the WASM file, because a
   script in this folder looked for the WASM file in the same folder, but the WASM file wasn't
   there.

The solution to the first problem was to manually add the `snippets` folder to `package.json` before
publishing. It's not ideal having to edit an auto-generated file, but at least it works.

The solution to the second problem was harder to find: Vite allows disabling optimizations for a
particular module with the `optimizeDeps.exclude` key.

The NPM module is now used on the [playground](https://playground.pomsky-lang.org/).

## Syntax changes

In the last two releases, there were a few syntax changes:

- You can now use the `^` and `$` anchors instead of `Start` and `End`. These symbols are
  well-known, not only because of regular expressions, but also because vim uses them.
  This should make your Pomsky expressions more concise.

- Pomsky now supports atomic groups!

  ```pomsky
  # this is guaranteed to never backtrack
  % atomic('integer' | 'insert' | 'in') %
  ```

  Atomic groups can be more performant than regular groups. Note that atomic groups are only
  available in the Java, PCRE, Ruby and .NET flavors.

- Alternations now allow leading pipes, so you can format your expressions more beautifully:

  ```pomsky
  | 'Lorem'
  | :group(
      | 'ipsum'
      | 'dolor'
      | 'sit'
    )
  | 'amet'
  ```

- The `[codepoint]` and `[cp]` syntax has been deprecated. Use the built-in `Codepoint`/`C`
  variables instead. This is part of an effort to make the syntax more uniform and intuitive.

- `[.]` has also been deprecated, but currently only issues a warning.

  I'm still undecided if this syntax should be removed entirely, or if the dot should be available,
  even though its behavior can be surprising and `Codepoint` is usually better.

## Improving diagnostics

Good error messages are dear to my heart. The last two releases had several improvements to
diagnostics that I want to highlight here:

- **Pomsky now detects typos**. When you misspell a character class, variable name or capturing
  group, Pomsky will suggest the correct spelling.

- Many regex syntax diagnostics were added. Pomsky now recognizes most regex syntax and suggests
  the equivalent Pomsky syntax.

  For example, trying to compile `(?<grp> "test")` will produce an error with this help message:

  > Named capturing groups use the `:name(...)` syntax. Try `:grp(...)` instead

- Pomsky is now able to report multiple errors at once. More changes to the parser are required
  to make use of this effectively, but in some places it already works.

## Reducing the binary size

I put some work into reducing the binary size. The first step was to strip debug symbols. I
previously didn't strip them because I wanted to have useful backtraces in case of a panic. However,
I'm now confident enough in Pomsky's stability that I think we don't need them. And if you find a
panic, it should be reproducible with the same input.

Stripping the binary decreased the CLI's binary size on Linux from **3.24 MiB** to **1.39 MiB**.

The parser rewrite had little impact on the CLI's binary size: It reduced the binary size from
1.39 MiB to **1.34 MiB**. However, the impact was more significant for the WASM module: It went
from **224 KiB** to **177 KiB**.

The next step was to replace the `clap` crate with the much smaller `lexopt`. This reduced the CLI's
binary size from 1.34 MiB to **894 KiB**. Now that here isn't any low-hanging fruit left, I'm
satisfied with the result.

---

That's it for today!

Cheers,\
Ludwig
