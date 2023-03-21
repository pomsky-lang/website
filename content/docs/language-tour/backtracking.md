---
title: 'Backtracking'
description: 'How most regex engines find matches'
excerpt: ''
date: 2023-03-21T18:25:00+00:00
lastmod: 2023-03-21T18:25:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 213
toc: true
---

Pomsky doesn't actually execute your expression. Instead, it transforms the expression into a
_regex_. There are many regex engines for executing them, and Pomsky supports the most popular ones.
Most of them happen to be _backtracking_, which means that they try out different paths in the
expression, and when a path is not successful, they "backtrack" to a position in the string where
another path may match.

Consider this example:

```pomsky
'a' 'b'+ 'a'? 'c' | 'a' 'b'+ 'd'? 'd'
```

There are two alternatives, and a backtracking engine will try one after another. If the search string is `abbd`, it finds the first `'a'` then repeats the `'b'` three times. Then it expects an optional `'a'`, but since there's no `a` at this position, it skips the `'a'`. Then it expects a `'c'`, but there is no `c`, and as the `'c'` is not optional, the match failed, and the regex engine starts over with the other alternative.

Again, the regex engine finds the first `'a'`, and repeats the `'b'` 3 times. Then there's an optional `'d'`, and since it is greedy, it matches the `d` from the search string. Now, it expects another `'d'`, but the whole search string has already been consumed. So the match fails again, and the engine backtracks to the optional `'d'?`. This time, the engine decides to skip it, and the search succeeds.

## Catastrophic backtracking

Backtracking can be characterized as "lots of trial and error". For certain expressions and inputs, backtracking can be extremely slow, often with exponential runtime. One example is this expression:

```pomsky
('x' 'x'*)+ 'y'
```

When matching the string `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, there are many ways how it can be matched. For example, it could repeat the group only once, or it could match 6 `x`'s in the first repetition, then another 6 in the second repetition, and the rest in the third. And so on. The number of possible combinations is exponential with respect to the search string length. And since the string doesn't match the expression (because it doesn't end with `y`), a backtracking engine will try out all possible combinations before giving up.

This may be a problem if you're executing the regular expression in a web server, and you're searching a text entered by a user. If the user has bad intentions, they can enter a text that leads to catastrophic backtracking. Then your server is caught in an infinite loop; even if it is multi-threaded, the user can enter the malicious text multiple times, until all threads are busy and your service is unreachable. This is why regular expressions executed in a server or similarly important infrastructure should be resistant to catastrophic backtracking.

The easiest solution is to _never use nested repetitions_. Repetitions are fine as long as they're only one level deep. Nested repetitions can sometimes also be fine, but this is harder to prove. However, the best solution is to use a regex engine like [Rust](https://docs.rs/regex/latest/regex/) that uses an [NFA](https://en.wikipedia.org/wiki/Nondeterministic_finite_automaton) and never backtracks. Rust's regex can execute the above expression with the input `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` in less than a millisecond, for which JavaScript would take years.
