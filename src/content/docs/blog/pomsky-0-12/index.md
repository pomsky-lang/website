---
title: 'Pomsky 0.12'
description: 'See what’s new in Pomsky 0.12'
excerpt: >
  I am delighted to announce version 0.12 of Pomsky, the next level regular expression language! Pomsky makes it easier than ever to write _correct_ and _maintainable_ regular expressions. Pomsky expressions are transpiled to regexes and can be used with many regex engines.

  This release comes packed with new features and improvements. Here are the highlights:

  - The RE2 flavor, used for Go's `regexp` package, is now supported

  - Intersection of character sets

  - Improved Unicode support with Script Extensions

  - A convenient pomsky test subcommand for running unit tests

  - Optimizations for repetitions, character sets, and single-character alternatives

  - New IDE capabilities for the VSCode extension

  - New installers, including an npm package

  ***

  [Continue reading](/blog/pomsky-0-12/)
date: 2024-12-18T10:00:00Z
---

I am delighted to announce version 0.12 of Pomsky, the next level regular expression language! Pomsky makes it easier than ever to write _correct_ and _maintainable_ regular expressions. Pomsky expressions are transpiled to regexes and can be used with many regex engines.

## What's new?

This release comes packed with new features and improvements. Here are the highlights:

<div class="big-list">

- The [RE2 flavor](#re2-support), used for Go's `regexp` package, is now supported

- [Intersection](#character-set-intersection) of character sets

- Improved Unicode support with [Script Extensions](#unicode-script-extensions)

- A convenient [pomsky test](#test-subcommand) subcommand for running unit tests

- [Optimizations](#character-set-optimizations) for repetitions, character sets, and single-character alternatives

- New [IDE capabilities](#editor-improvements) for the VSCode extension

- New [installers](#new-installers), including an npm package

</div>

This release also has a breaking change, [explained below](#breaking-change-fixing-hygiene).

If you're unfamiliar with Pomsky, [here is a summary](/docs/get-started/quick-reference) of how Pomsky compares to regexes.

Let's look at the most exciting new features in this release!

## RE2 Support

RE2 is a fast regex engine from Google. Unlike backtracking regex engines such as PCRE2, it is based on finite automata, so it has better worst-case performance. Go's `regexp` package is (mostly[^1]) compatible with RE2. Pomsky now also offers a **RE2 flavor**, so you get better diagnostics when targeting RE2. For example, RE2 doesn't support features such as lookbehind, and Pomsky detects this:

<pre class="terminal">
<span class='shell'>&gt; </span><span class='cmd'>pomsky</span> <span class='flag'>-f</span> <span class='arg'>re2</span> <span class='str'>"&lt;&lt; &#39;test&#39;"</span>
<span style='color:var(--red,#a00)'><b>error P0301</b></span>(compat):
  <span style='color:var(--red,#a00)'>×</span> Unsupported feature `lookahead/behind` in the `RE2` regex flavor
   ╭────
 1 │ &lt;&lt; &#39;test&#39;
   · <span style='color:var(--magenta,#a0a)'><b>────┬────
</b></span>   ·     <span style='color:var(--magenta,#a0a)'><b>╰── error occurred here
</b></span>   ╰────
</pre>

With RE2, Pomsky now supports 8 regex flavors, covering most mainstream programming languages:

- **PCRE** (PHP, R, Erlang, ...)
- **JavaScript** (TypeScript, Dart, ...)
- **Java** (JVM languages)
- **Python**
- **.NET** (C#)
- **Ruby**
- **Rust**
- **RE2** (Go)

## Character Set Intersection

Several regex engines[^2] support intersecting and subtracting character sets:

```regexp
[\p{Thai}&&\p{Nd}]
```

The above matches a codepoint that is in the ‘Thai’ script _and_ in the ‘Nd’ (decimal number) category. Pomsky now has an `&` operator to express this:

```pomsky
[Thai] & [Nd]
```

Some regex engines also have _subtraction_. Pomsky doesn't provide this feature, since it can be easily emulated:

```pomsky
[Thai] & ![Nd]   # negating one character set subtracts it
```

Note that not all flavors support intersection. However, if both character sets are negated, they are merged by applying [De Morgan's first law](https://en.wikipedia.org/wiki/De_Morgan's_laws):

```pomsky
![Thai] & ![Nd]  # is turned into...
![Thai Nd]
```

## Unicode Script Extensions

Most software has to handle text in different languages and scripts. That's why we have always counted good Unicode support as one of Pomsky's killer features. For example, Pomsky polyfills `\w` in JavaScript, which is not Unicode aware even with the `unicode` flag.

Pomsky also makes it easy to match a code point in a particular Unicode script: For example, `[Syriac]` matches all Syriac characters—_in theory:_ Unicode scripts cannot overlap, so code points that would belong in multiple scripts are assigned to the `Common` or `Inherited` script instead.

[Script Extensions](https://www.unicode.org/L2/L2011/11406-script-ext.html) solve this problem, which Pomsky now supports:

```pomsky
# matches all codepoints with a Syriac script extension
[scx:Syriac]
```

Because code points can have multiple scripts in their ‘Script Extensions’ property, this is more accurate.

Script Extensions are currently only supported in the PCRE, JavaScript and Rust flavors, but hopefully more regex engines will add support in the future.

In addition to `scx:`, you can also use the `gc:`, `sc:`, and `blk:` prefixes to match a general category, script, or block. These prefixes are optional, but adding them might help with readability:

```pomsky
[Letter]     # old
[gc:Letter]  # new

[InBasic_Latin]   # old
[blk:Basic_Latin] # new
```

Note that the `In` prefix of Unicode blocks is omitted when using the `blk:` prefix. We strongly recommend using `blk:` because we will deprecate the `In` prefix in the future.

## Test subcommand

The last Pomsky release added the `test` construct and a `--test` flag to run unit tests during compilation. This was a big step forward to make Pomsky expressions more correct and maintainable. However, there was no easy way to test all Pomsky expressions in a project during a CI workflow. This has now been addressed with the `pomsky test` command:

<pre class="terminal">
<span class='shell'>&gt; </span><span class='cmd'>pomsky</span> <span class='arg'>test</span> <span class='flag'>--path</span> <span class='arg'>examples/</span> <span class='flag'>-e</span> <span class='arg'>pcre2</span>
<span style='color:var(--cyan,#0aa)'><b>testing </b></span>examples/modes.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/email.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/repetitions.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/version.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/special.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/groups.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/strings.pomsky ... <span style='color:var(--green,#0a0)'><b>ok
<span style='color:var(--cyan,#0aa)'>testing </span></b></span>examples/capt_groups.pomsky ... <span style='color:var(--green,#0a0)'><b>ok</b>

</span>test result: <span style='color:var(--green,#0a0)'><b>ok</b></span>, 8 files tested in 1.41ms
</pre>

`pomsky test` recursively iterates over the given directory, taking `.ignore` and `.gitignore` files into account, and tests all files with the `.pomsky` file ending. If at least one file doesn't compile or contains a failing test, the program exists with an error, so it's easy to include it in your CI pipeline.

Previously, Pomsky only supported `pcre2` for running tests. Starting with Pomsky 0.12, `rust` is supported as well. We want to add more regex engines for unit tests, but this turns out to be quite difficult, so it didn't make it into this release.

## Character set optimizations

Pomsky allows you to refactor parts of an expression into variables to improve readability and follow the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). For example:

```pomsky
let digit = ['0'-'9'];
let hex_digit = digit | ['a'-'f'];
```

But this comes with a trade-off: Sometimes the produced regex is less efficient—and therefore slower in some regex engines. Optimizations help with this, so you can write readable, DRY code without worrying too much about performance.

In this release, Pomsky gained a few important optimizations: First, character ranges in a set are now merged if they are adjacent or overlap. For example, `['a' 'b'-'d' 'c'-'f']`#po becomes just `[a-f]`. Secondly, alternations of single characters are merged. For example, `'a' | ['b'-'d'] | ['c'-'f']`#po also compiles to just `[a-f]`.

This is useful in the example above: After variable expansion, `digit | ['a'-'f']`#po becomes `['0'-'9'] | ['a'-'f']`#po, which is compiled to a single character class, `[0-9a-f]`.

## Editor improvements

A key feature of any computer language is its IDE integration. For this release, I improved the VSCode extension by adding the following actions:

- Go to definition
- Find usages
- Rename variable

There's just one caveat: For these features to work, the file has to be syntactically valid. This is because these actions work on the _abstract syntax tree_ (AST), and we currently can't get the AST if parsing fails.

To solve this, the next step is making the parser _recoverable_, so it can produce an (possibly incomplete) AST even in the face of syntax errors. This will also help to improve autocompletions, which currently don't use the AST.

I also added inlay hints to show the index of unnamed capturing groups, so you don't need to count them when writing a replacement pattern.

## New installers

In this release, we adopted [cargo-dist](https://opensource.axo.dev/cargo-dist/) for distributing the `pomsky` binary, so we could provide more installation options: In addition to the Windows, Linux and macOS binaries, we now have

- Shell and PowerShell scripts to download and install Pomsky

- An npm package, so you can install Pomsky with

  ```sh
  npm install -g @pomsky-lang/cli
  ```

  or run it directly with

  ```sh
  npx @pomsky-lang/cli
  ```

- An msi for installing and uninstalling Pomsky on Windows

As before, you can also get Pomsky from the AUR with `yay -S pomsky-bin`, or from crates.io with `cargo install pomsky-bin`. The Homebrew formula hasn't been updated to version 0.12 yet, but we're working on it.

## Breaking change: Fixing hygiene

Pomsky variables work much like _macros_ in Lisp and Rust: When Pomsky encounters a variable, it is substituted with its content. Variables are [hygienic](https://en.wikipedia.org/wiki/Hygienic_macro), which means they are properly scoped when substituted.

However, we discovered that [modifiers](https://pomsky-lang.org/docs/language-tour/modifiers/) are not hygienic. Take this example:

```pomsky
let variable = .*;

(enable lazy; variable);
```

Is the repetition in line 1 lazy or not? In Pomsky 0.11, it was lazy, which is counterintuitive because the `enable lazy;`#po statement is not in scope where the repetition appears, only where the variable is used.

Unfortunately, fixing this required a breaking change. We think that the impact will be minimal, but to be sure, please check if you are relying on this behavior anywhere.

## Support us!

We have a lot of exciting plans to make Pomsky a success. To realize them, we need your help! But when I say ‘we’, that's mostly just me, [@Aloso](https://github.com/Aloso), working on Pomsky in my spare time. I'm looking for contributors to implement new features, tooling, and integrations. If you'd like to help (or have questions, or just want to chat), drop by our [**Discord channel**](https://discord.gg/uwap2uxMFp). Also, if you're using Pomsky, I'd like to hear about it!

Consider [**sponsoring me**](https://github.com/sponsors/Aloso) to help making my open-source work financially sustainable. Thank you ❤️

[^1]: Go's `regexp` package doesn't support `\C` from RE2 (matching a single byte, which isn't supported in Pomsky either).
[^2]: Character set intersection is supported in the JavaScript, Java, Ruby, and Rust flavors. Note that JavaScript requires the [v flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets) for this.
