---
title: 'History'
description: ''
excerpt: ''
date: 2022-07-04T16:06:32+00:00
lastmod: 2022-07-04T16:06:32+00:00
contributors: ['Ludwig Stecher']
draft: true
images: []
weight: 3
toc: true
---

# History

But why did I create this language in the first place? Truth is, I never planned to do this until I learned about _melody_. When I looked at the project, I was really impressed: Melody is a language with very similar goals as rulex. However, there were two things I didn't like: First, it didn't support several important regexp features at the time, which is not the case anymore. Second, and more importantly, the syntax felt unnecessarily verbose to me, and I was confused why it used curly braces and semicolons like a procedural language. I thought, a language that transpiles to regular expressions should have a similar syntax, so it looks familiar and can be learned more easily.

So I drafted a new syntax and implemented a prototype over a weekend. A few weeks later, I had an MVP and a website with documentation to get started.

## The Journey

When I announced rulex in the Rust reddit (since rulex is written in Rust), I was blown away by the positive feedback. I also got a lot of suggestions about new features and tooling, so I kept going. Rulex moved to a GitHub organization, got a more professional-looking website, and an online playground to tinker with rulex without having to install anything. It got some new awesome features: Rulex can match on ranges of numbers now, and you can declare variables to make your code more modular and DRY. I improved the code quality by adding a test suite, more documentation and benchmarking/fuzzing infrastructure, and I rooted out some bugs and improved error messages.

### Variables

The first version of rulex didn't

### Ranges

Ranges are a feature that was first requested in a reddit thread, which I liked so much that I implemented it right away. The problem it solves is that it is notoriously difficult to match a number in a certain range if it can be multiple digits long:

```regexp
[][]
```

The above matches a number between 0 and 255. What if you could instead write `range '0'-'255'`? With rulex, you can. Moreover, rulex generates a regexp that can be efficiently matched, without backtracking, in all regexp engines. Because of the inherent complexity of the algorithm, I tested it with hundred thousands of randomly generated ranges to be sure that it works correctly.

There is one problem, however: The algorithm generating the regexp has exponential complexity. It is extremely fast for small numbers, but it quickly gets slower when you try compiling ranges with longer and longer numbers. Optimizing the code and minimizing the size of the generated regexp helped, but it didn't solve the problem entirely. Because of this, `range` expressions are limited to numbers with at most 6 digits (12 digits in the CLI) by default.

## Where rulex is going

There's a lot of planned work in my backlog. Rulex already supports the most common regexp features and then some, but some less mainstream features, such as conditionals, atomic groups and recursion, are still missing. I'm also considering to support more regex flavors, but this is currently not a priority. Documentation still needs improvement in some places. I also have to rework the home page to make it clearer what rulex is all about.
