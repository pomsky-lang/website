---
title: 'Repetitions'
description: 'How to repeat an expression, greedily or lazily'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7003
toc: true
---

When we want to match an expression multiple times, it would be cumbersome to repeat our expression.
Instead, we can specify how often the expression should occur:

```pomsky
('r' | 'w' | 'x' | '-'){9}
```

This matches an `r`, `w`, `x` or `-` character 9 times. For example, it would match the string
`rwxr-xr--`, or `xxrr-xr-w`.

What if we want to match strings of different lengths? Repetitions are quite flexible, so we can
specify a lower and upper bound for the number of repetitions:

```pomsky
('r' | 'w' | 'x' | '-'){3,9}
```

This matches between 3 and 9 characters. It's also possible to omit the upper bound:

```pomsky
'la'{1,}
```

This matches the text `la` at least 1 time. So it matches `la`, but also `lala`, `lalala`,
`lalalala`, and so on.

## Abbreviations

Wanting to match someting _at least once_ is so common that there's a special syntax for it: The
{{<po>}}+{{</po>}}.

```pomsky
'la'+
```

<!-- prettier-ignore -->
And there are two more special cases: {{<po>}}{0,}{{</po>}} (repeated _zero or more times_) can be
written as {{<po>}}*{{</po>}}, and {{<po>}}{0,1}{{</po>}} can be written as {{<po>}}?{{</po>}}.

This leaves us with the following options:

<!-- prettier-ignore -->
| Expression                 | Meaning                           |
| -------------------------- | --------------------------------- |
| {{<po>}}'la'{5,9}{{</po>}} | Between _5_ and _9_ `la`s         |
| {{<po>}}'la'{5,}{{</po>}}  | At least _5_ `la`s                |
| {{<po>}}'la'*{{</po>}}     | Any number of `la`s (including 0) |
| {{<po>}}'la'+{{</po>}}     | At least 1 `la`                   |
| {{<po>}}'la'?{{</po>}}     | Maybe a `la`, maybe not           |

## Matching behavior

{{< alert icon="👉" text="This section explains the behavior of typical regex engines. It is a bit more technical than the rest of this tour, but it is important to understand." />}}

Pomsky expressions are often used to search for _substrings_ in a text matching a particular
pattern. For this, a _regex engine_ is used; the Pomsky expression is first transformed into a
regex (short for "regular expression") by the Pomsky compiler, and then given to a regex engine.
The regex engine then performs the search by walking over the text, until it finds a substring
matching the regex.

But when the expression is repeated, how often should the regex engine attempt to repeat it? For
example, {{<po>}}'la'{2,4}{{</po>}} could repeat 2, 3 or 4 times. When searching the text
`My favourite song goes like lalala la`, should it stop as soon as it found `lala`, or should
it check if there is a third and fourth `la`?

By default, regex engines are _greedy:_ They try to repeat an expression as often as possible. Only
if that fails will they check if the expression matches with fewer repetitions. So in the above
example, the regex engine will give you the match `lalala`. Since it is followed by a space, it
can't match a fourth time.

It gets more interesting when a repetition is followed by another expression:

```pomsky
'la'{2,4} 'li'
```

Let's see what happens when searching the string `lalalalalali` for this pattern: The regex engine
first detects the string `la` at the very start.

```pomsky
lalalalalali
^
```

It greedily attempts to repeat it 4 times, and succeeds. Now it is at the 9th character:

```pomsky
lalalalalali
        ^
```

Now it attempts to match the {{<po>}}'li'{{</po>}} part, but fails: There is no `li` at the current
position. So the regex engine gives up the last repetition and tries again:

```pomsky
lalalalalali
      ^
```

This is called _backtracking;_ think of it like wandering through a maze and trying out every path.
Whenever we reach a dead end, we return to the previous junction and try the next path.

Unfortunately, the {{<po>}}'li'{{</po>}} part doesn't match after the third repetition either, or
the second one. Now the regex engine has no more paths to explore, and gives up.

But it isn't finished yet, maybe there is a match somewhere else in the string! So it returns to
the start:

```pomsky
lalalalalali
^
```

Since the regex engine already tried at this position and failed, it skips to the next
occurrence of the substring `la`, which at the 3rd character:

```pomsky
lalalalalali
  ^
```

Again, it tries to greedily repeat it four times, and succeeds!

```pomsky
lalalalalali
          ^
```

The next step is matching the {{<po>}}'li'{{</po>}} part, which succeeds, and the regex engine is
done. The matched substring is:

```pomsky
lalalalalali
  ^^^^^^^^^^
```

Not all regex engines use backtracking; a notable exception is Rust's `regex` library, which can
convert an expression to a _lazy deterministic finite automaton_ (lazy DFA), a special kind of
state machine that never needs to backtrack.

However, "backtracking" is still a good mental model to understand what a regex engine does. Even
though Rust's `regex` library never backtracks, it always returns the same matches as a backtracking
regex engine would. It might just do it faster.
