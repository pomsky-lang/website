---
title: 'Number ranges'
description: 'Reference – Matching a multi-digit number'
---

Number ranges are used to match multi-digit numbers. If you only need to match a single digit, you
can use a [character set](/docs/reference/constructs/charset) instead.

## Syntax

```pomsky
let NumberRange = 'range' String '-' String Base?;

let Base = 'base' Number;
```

Note that the strings must contain digits or ASCII letters in the supported range. For example, in
`base 16`, the characters `0123456789abcdefABCDEF` are allowed. The base must be between 2 and 36.

The first string must be at most as long as the second string. The number in the first string must
be smaller than the second one. If either string has a leading zero (that is, it begins with `0` and
has a length > 1), both strings must have the same length.

## Example

```pomsky
range '128'-'255'
```

## Support

Number ranges are supported in all flavors.

Support for number ranges is gated by the `ranges` feature. Specify features with the
`--allowed-features` option.

There is a limit on the maximum number of digits. In the CLI, this limit is 12. In the WASM library,
the limit is 6. This is meant to avoid excessive compile times, since the expansion has exponential
runtime behavior.

## Behavior

A number range greedily matches a number in a radix based number system (by default, a decimal
number). The radix can be specified after the `base` keyword as an integer between 2 and 36.

Two strings serve as the lower and upper bound of the matched number (both inclusive). For example,
`range '8'-'12'`#po matches `8`, `9`, `10`, `11`, and `12`.

If neither bound has leading zeroes, the expression _never_ matches a string with leading zeroes.
Otherwise, both numbers must have the same number of digits, including leading zeroes. For example,
`range '007'-'300'`#po is ok, but `range '07'-'300'`#po is not. The number
`0` itself is _not_ considered to have a leading zero.

If leading zeroes are present, a match must have the same length as the specified bounds. For
example, `range '007'-'300'`#po matches `034`, but not `34`.

## Compilation

Compilation of number ranges uses a complicated, novel algorithm to turn the range into a tree of
alternations. For example:

| Pomsky expression      | Compiled                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `range '0'-'10'`#po    | `0&#x7c;10?&#x7c;[2-9]`#re                                   |
| `range '0'-'63'`#po    | `0&#x7c;[1-5][0-9]?&#x7c;6[0-3]?&#x7c;[7-9]`#re              |
| `range '63'-'137'`#po  | `1(?:[0-2][0-9]&#x7c;3[0-7])&#x7c;6[3-9]&#x7c;[7-9][0-9]`#re |
| `range '100'-'200'`#po | `1[0-9]{2}&#x7c;20{2}`#re                                    |

The generated regex is a DFA, so for every digit there is at most one transition. This means that
matching is very efficient, since regex engines never need to backtrack.

### Algorithm

:::tip
If this description is missing any information, read the program code to find the details.
:::

We always look only at the first digit of each bound; these digits are called `ax` (from lower
bound) and `bx` (from upper bound). For simplicity, we assume that the radix is 10 (decimal), but
the algorithm works for any radix. For example:

```js
// range '4'-'705'
a = [4]
b = [7, 0, 5]
ax = 4
bx = 7
```

By looking at the first digit, we can deduce:

- The number can't start with 0 (leading zeros aren't allowed)
- The number can start with 1, 2 or 3, but then it must be followed with 1
  or 2 more digit in that case
- The number can be 4, 5 or 6, in which case it can be followed by 0, 1 or 2
  more digits
- If the number starts with 7, it can be followed by
  - nothing
  - a zero, and possibly a third digit that is at most 5
  - a digit greater than zero, if there is no third digit.
- If the number starts with 8 or 9, it can be followed by at most 1 more
  digit.

This is implemented recursively. We always remove the first digit from the
slices. We then create a number of alternatives, each starting with a
different digit or range of digits:

1. `0 ..= ax-1`
2. `ax`
3. `ax+1 ..= bx-1`
4. `bx`
5. `bx+1 ..= 9`

If `ax` and `bx` are identical, 3. and 4. are omitted; if they're consecutive numbers, 3. is
omitted. If `ax` is 0 or `bx` is 9, 1. or 5. is omitted, respectively. If `ax` is bigger than `bx`,
the alternatives are a bit different, and this is important later:

1. `0 ..= bx-1`
2. `bx`
3. `bx+1 ..= ax-1`
4. `ax`
5. `ax+1 ..= 9`

There is one more special case: The first digit in a number can't be 0, unless the range's lower
bound is 0. So we check if we are currently looking at the first digit, and if that is the case,
the first character class omits 0. If the lower bound is 0, then an alternative containing _only_
0 is added _once_.

Now, for each of the above alternatives, we return two things: A character class matching the first
digit, and _something_ matching the remaining digits. That _something_ is calculated by recursively
applying the algorithm on the remaining digits. To make sure that this doesn't recurse infinitely,
we must detect terminal calls (calls that stop recursing):

- If both slices are empty, we are done.

- If both slices contain exactly 1 digit, we simply add a character class matching a digit in that
  range.

- If the first slice is empty but not the second one, we apply a trick: We add a 0 to the lower
  bound and try again. Also, the returned sub-expression is made optional.

  For example, `range([4], [4, 0, 0])` at some point adds an alternative starting with `4` and
  calls `range([], [0, 0])` recursively. We want this to match the empty string, any single digit,
  or two zeros, because a "4" matching the range 4-400 can be followed by nothing, any single
  digit or two zeros.

  If we just added a 0 to the lower bound, that would mean that the 4 MUST be followed by at least
  one more digit. We don't want that, so we make the expression following the 4 optional.

- If the second slice is empty but not the first, this is an error that should NEVER happen. The
  parser validates the input so that the upper bound can't be smaller/shorter than the lower bound.

Now, about the alternatives: This part is quite interesting. To recap, the alternatives are either
this:

1. `0 ..= ax-1`
2. `ax`
3. `ax+1 ..= bx-1`
4. `bx`
5. `bx+1 ..= 9`

or this, if `bx > ax`:

1. `0 ..= bx-1`
2. `bx`
3. `bx+1 ..= ax-1`
4. `ax`
5. `ax+1 ..= 9`

Step 1 and 5 are the same either way, if we substitute `ax` and `bx` with `min(ax, bx)` in step 1
and with `max(ax, bx)` in step 5:

```
1. [1-(min - 1)] [0-9]{la + 1, lb}  (first digit)
1. [0-(min - 1)] [0-9]{la + 1, lb}  (not first digit)
5. [(max + 1)-9] [0-9]{al, bl - 1}
```

(`la` and `lb` are the lengths of the remaining digits in the lower and upper bound, respectively).

What is the deal with the added or subtracted 1's? If we have a lower bound such as 533, the number
must be at least 3 digits long. However, if the first digit is less than 5, it must be at least 4
digits long to be greater than 533. With the upper bound, it's the opposite: For example, with an
upper bound of 6111, the number can be at most 3 digits if it starts with 7, 8 or 9.

The last step is to optimize the alternatives to be as compact as possible.
This is achieved by simplifying and merging alternatives if applicable. For
example,

```
[0-4] [5-9] | 5 [5-9]
```

This can be merged into `[0-5] [5-9]`. The rules are like addition and multiplication, where
alternation (with `|`) is equivalent to `+` and concatenation is equivalent to `*`. This means we
can use the distributive law: `a * x + b * x = (a + b) * x`. Note that we only do this if the first
character class of each alternation are consecutive; for example, we merge `[0-4]` and `5`, but not
`[0-4]` and `[6-9]`. This would be possible in theory, but would be computationally more expensive,
since the second part of each alternation must be checked for equality.

The next optimization is to replace concatenation of equal elements with repetition. In other words,
we replace `a + a` with `a * 2`, and `a + (a * 2)` with `a * 3`. This is important, because when we
check whether two expressions are equal, it only works if they have the exact same structure:
`[0-9][0-9]` is not considered equal to `[0-9]{2}`. So this optimization also serves as a
_normalization_, to ensure that equal alternatives can be merged.

## Issues

A range expression can match only a part of a number. For example, the expression
`range '4'-'20'`#po matches each digit in `68`. Anchors, word boundaries or lookarounds
may be needed to prevent this.

## Security concerns

Because compilation time is exponential with respect to the maximum number of digits, large ranges
can be used to mount a DoS attack. This is partially remedied by the digit number limit (see
[above](#support)).

## History

- Restriction added to no longer allow ranges with leading zeroes and variable length in Pomsky 0.11
- Initial implementation in Pomsky 0.3
