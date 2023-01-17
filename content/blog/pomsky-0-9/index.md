---
title: 'Pomsky 0.9 and our roadmap'
description: 'I just released pomsky 0.8 with a new, much faster parser.'
excerpt: ''
date: 2023-01-15T00:00:00
lastmod: 2023-12-15T00:00:00
contributors: ['Ludwig Stecher']
draft: false
images: ['cover.jpg']
weight: 996
toc: true
---

![A husky wearing orange sunglasses](cover.jpg)

## What is Pomsky?

Pomsky is a portable, modern syntax for regular expressions. It has powerful features, such as
variables, and a much more readable syntax. Check out the
[language tour](https://pomsky-lang.org/docs/language-tour/basics/) to quickly get familiar with
pomsky, or the [examples](https://pomsky-lang.org/docs/examples/) to see some real pomsky
expressions.

Pomsky is _not_ a regex engine. Instead, a pomsky expression is transpiled to a normal RegExp,
compatible with many RegExp engines, including JavaScript, Java, PCRE, Ruby, Python, Rust and .NET.

## What's new

With this release, we're celebrating 1000 stars on GitHub! This is an important milestone, so I would like to take this opportunity to thank everyone who has supported me along the way: My siblings who always cheer me up, my colleague who gave me legal advice, everyone from the Rust community who provided useful feedback to me, the people who sent me pull requests, reported bugs, proposed new features, or reported vulnerabilities, and [DALL·E](https://openai.com/dall-e-2/) for designing our logo. Thank you!

Pomsky has a [Discord server](https://discord.gg/uwap2uxMFp) now. Stop by if you have a question, want to help, or just want to chat with the maintainers (currently only me) or other users!

---

This is a small release focusing on maintenance and fixing bugs. The only user-facing change is that warnings and errors now include a code, such as `P0100`. Ideally, the CLI should provide all the necessary information to fix the problem, but if you ever have to search for an error, this code might make it easier to find relevant results.

The other new feature is that Pomsky can now return all output as JSON with the `--json` flag, which will be important for tools and IDE integrations. Someone is currently working on an IntelliJ plugin, which they plan to release in a few weeks. It already offers many nice features, and I'm excited to announce it once the initial version is ready! If you're using VS Code or another editor, please be patient. In the meantime, you can always use the [online playground](https://playground.pomsky-lang.org/), which offers syntax highlighting, auto-completion and inline diagnostics.

If you want to contribute to Pomsky, we now have a [contributor's guide](https://github.com/pomsky-lang/pomsky/blob/main/CONTRIBUTING.md) to help you get off the ground. It includes an architectural overview and explains how Pomsky is tested. If something is missing, please reach out.

## More testing improvements

Last release, [I improved the test suite and fuzzer](https://pomsky-lang.org/blog/pomsky-0.8-released/#testing-improvements-and-bugfixes) by compiling generated regexes to check if they are syntactically valid. This proved to be very effective and uncovered a bunch of bugs.

But I only compiled regexes in the `Rust` and `PCRE` flavors, because Pomsky can easily include these regex engines as Rust crates. Testing other variants is more difficult, but I was determined to get it working. To be really confident that a regex is valid, you have to test it; reading the documentation on regex engines only gets you so far, and in many cases the documentation is not as detailed as I had hoped.

How did I approach this problem? First, I wrote small JavaScript, Java and Python programs to compile a regex and return whether it is valid. Now all I had to do was run these programs from Rust. But here's the problem: Starting a JavaScript program with Node.js takes about 100ms, but when fuzzing, I want to compile thousands of expressions per second. Starting a process every time I want to verify a regex is not feasible.

My solution was to spawn long-running processes that communicate via stdin and stdout: Whenever the Node.js program receives an expression via stdin, it tries to compile it and writes either "success!" or the error message to stdout. For Java and Python, we do the same. This works surprisingly well, and is fast enough for our fuzzer. For Ruby, we don't have to spawn a process: I realized that Ruby uses the Oniguruma library, which is also available as Rust crate. This only leaves `.NET`, which still isn't sufficiently tested. I first have to figure out how to compile C# on Linux, and make it work in our GitHub action on Windows, Ubuntu and macOS.

When I started fuzzing with regex testing for Java, JavaScript, Python, Ruby, Rust and PCRE, it took only a few seconds for the fuzzer to spit out the first error. In total, it found 12 bugs, 10 of which are fixed in this release. Fixing the other bugs will require more work.

You can find the complete changelog [here](https://github.com/pomsky-lang/pomsky/blob/v0.9/CHANGELOG.md#090---2023-01-14).

## Roadmap

It's a misconception that the more work you pour into a project, the less there is to do. A project is not a to-do list where you can do one task after another until you reach the end. In reality, the amount of work never decreases: The more code you write, the more code you have to maintain. Furthermore, as Pomsky becomes more popular, there are more people requesting features for diverse use cases.

Right now, my capacity for feature development is very limited, both by my amount of spare time and by my mental health. Unless more people step up to help, I have to make tough decisions about which tasks take priority.

Here's what I'm going to work on in the next months:

- **Testing**: I'm committed to invest more work into automated testing to eliminate bugs.

- **Optimizations**: There are some low-hanging fruit to make Pomsky's output smaller and more
  efficient.

- **Language improvements**: I have a few ideas how to make Pomsky more expressive. I'm also
  considering some breaking syntax changes to make Pomsky more ergonomic and consistent, but these
  ideas are not fleshed out yet.

- **VS Code extension**: Considering the popularity of VS Code, this is a must. I hope I'll be able
  to re-use some code from the Pomsky playground for this.

The following features are **not** on my to-do list right now:

- Regex to Pomsky converter
- Auto-formatter
- Linter
- Babel or Vite plugins
- Python bindings
- Adding more flavors
- Publishing the CLI on other platforms

All of these features would be great, but I probably won't have the time to implement them myself anytime soon. If you want to help, all contributions are welcome and appreciated! Just let me know what you want to work on 😉

If you like Pomsky, consider [sponsoring me](https://github.com/sponsors/Aloso).

Cheers,\
Ludwig
