---
title: 'Security'
description: 'Advice how to use pomsky securely'
lead: ''
date: 2022-06-19T13:55:00+00:00
lastmod: 2022-06-19T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'reference'
weight: 304
toc: true
---

If you intend to compile or execute pomsky expressions on a web server or other critical
infrastructure, follow this advice, so you don't end up vulnerable to attacks.

## A billion laughs

The most important advice is to **never compile an untrusted pomsky expression**, since doing that
may make you vulnerable for denial of service attacks. Here's a simple example:

```pomsky
let lol = 'lol';
let lol1 = lol lol lol lol lol lol lol lol lol lol;
let lol2 = lol1 lol1 lol1 lol1 lol1 lol1 lol1 lol1 lol1 lol1;
let lol3 = lol2 lol2 lol2 lol2 lol2 lol2 lol2 lol2 lol2 lol2;
let lol4 = lol3 lol3 lol3 lol3 lol3 lol3 lol3 lol3 lol3 lol3;
let lol5 = lol4 lol4 lol4 lol4 lol4 lol4 lol4 lol4 lol4 lol4;
let lol6 = lol5 lol5 lol5 lol5 lol5 lol5 lol5 lol5 lol5 lol5;
let lol7 = lol6 lol6 lol6 lol6 lol6 lol6 lol6 lol6 lol6 lol6;
let lol8 = lol7 lol7 lol7 lol7 lol7 lol7 lol7 lol7 lol7 lol7;
let lol9 = lol8 lol8 lol8 lol8 lol8 lol8 lol8 lol8 lol8 lol8;

lol9
```

What does this expression do? It evaluates the variable `lol9`, which expands to the `lol8` variable
10 times, each of which expands to `lol7` 10 times, and so on. This exploit, called the
[Billion Laughs attack](https://en.wikipedia.org/wiki/Billion_laughs_attack), produces the word
`lol` a 1,000,000,000 times, which takes full 5 minutes to compile on my laptop.

If you only compile pomsky expressions you wrote yourself (or someone you trust), this is not a
problem, since it is quite unlikely to write something like the above by accident. Furthermore, it
is impossible to run into an infinite loop since pomsky forbids recursive variable declarations.

## Backtracking

Just like you shouldn't compile untrusted pomsky expressions, you also shouldn't execute an untrusted
regex. The reason for this is that most regex engines are _backtracking_, which has (worst-case)
exponential runtime performance. A regex created with not enough care or by a bad actor can easily
take down a NodeJS server if the server naively matches a large body of text against the regex.

What does this mean for pomsky? Unless you use RE2 or Rust's `regex` crate (which never backtrack),
pomsky expressions are just as susceptible to
[catastrophic backtracking](https://www.regular-expressions.info/catastrophic.html) as hand-written
regexes. Therefore, _don't execute untrusted regexes on critical infrastructure_.

## A million ranges

Another thing to watch out for are `range` expressions: Since the complexity of compiling `range`
expressions is exponential, compiling large ranges can take unusually long:

```pomsky
# all unsigned 64-bit integers
range '0'-'18446744073709551616'
```

The above pomsky takes 70 milliseconds on my laptop to compile. But add 4 digits and it's over a
second. This is already remedied by default, since ranges can by default be at most 6 digits long,
or 12 digits in the CLI. Be careful if you override this default.

This limit is not sufficient, though: It is easy to generate an expression containing a million
ranges each with 6 digits. This takes 45 seconds to compile on my laptop.

## Hardening pomsky

If you intend to compile pomsky expressions on a web server, but not execute the resulting regex,
there are a few things you can do to stay safe:

- Disable the `range` feature and variables
- Limit the length of the pomsky.
- Limit the number of HTTP requests a user can make per minute
- Run the pomsky compiler in a separate thread and stop the thread if pomsky doesn't complete
  in a certain time frame

I make no guarantees whether these suggestions are sufficient to protect your service.
