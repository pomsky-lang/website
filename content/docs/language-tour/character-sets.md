---
title: 'Character Sets'
description: 'Matching a codepoint with certain properties'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7006
toc: true
---

What if we want to match an arbitrary word? Enumerating every single word is obviously not feasible,
so what to do instead? We can enumerate all letters and repeat them:

```pomsky
(
  | 'a' | 'b' | 'c' | 'd'
  | 'e' | 'f' | 'g' | 'h'
  | 'i' | 'j' | 'k' | 'l'
  | 'm' | 'n' | 'o' | 'p'
  | 'q' | 'r' | 's' | 't'
  | 'u' | 'v' | 'w' | 'x'
  | 'y' | 'z'
)+
```

But this is very verbose and still only matches lowercase letters. We programmers tend to be lazy,
so there must be a more convenient solution!

## Character ranges

This expression matches words that can contain English lowercase and uppercase letters:

```pomsky
['a'-'z' 'A'-'Z']+
```

The square brackets indicate that this is a _character set_. A character set always matches
exactly 1 character (more precisely, a Unicode codepoint). This character set contains two ranges,
one for lowercase letters and one for uppercase letters. Together, this matches any character that
is either an English lowercase or uppercase letter.

It's also possible to add single characters to the set, for example:

```pomsky
['$' '_' 'a'-'z' 'A'-'Z']
```

Multiple characters can be put in the same quotes:

```pomsky
['$_' 'a'-'z' 'A'-'Z']
```

<!-- prettier-ignore -->
This is equivalent to {{<po>}}('$' | '_' | ['a'-'z' 'A'-'Z']){{</po>}}, but it's shorter.

### Character ranges and Unicode

{{<alert icon="👉" text="You can <a href=\"#unicode-properties\">skip this section</a> if you are already familiar with Unicode." />}}

What is a range, exactly? Let's see with an example:

```pomsky
['0'-'z']
```

This doesn't seem to make sense, but it works. If you
[try it out](https://playground.pomsky-lang.org/?text=%5B%270%27-%27z%27%5D), you'll notice that it
matches numbers, lowercase and uppercase letters. However, it also matches a few other characters,
e.g. the question mark `?`.

The reason is that Pomsky uses Unicode, a standard that assigns every character a numeric value.
When we write {{<po>}}'0'-'z'{{</po>}}, Pomsky assumes that we want to match any character
whose numeric value is somewhere between the value of {{<po>}}'0'{{</po>}} and the value
of {{<po>}}'z'{{</po>}}. This works well for letters (e.g. {{<po>}}'a'-'z'{{</po>}})
and numbers ({{<po>}}'0'-'9'{{</po>}}), because these have consecutive values in Unicode.
However, there are some special characters between digits, uppercase letters and lowercase letters:

<div class="small-table">

| Character | Unicode value |
| --------- | ------------- |
| `'0'`     | 48            |
| `'1'`     | 49            |
| `'2'`     | 50            |
|           | ...           |
| `'9'`     | 57            |
| `':'`     | 58            |
| `';'`     | 59            |
| `'<'`     | 60            |
| `'='`     | 61            |
| `'>'`     | 62            |
| `'?'`     | 63            |
| `'@'`     | 64            |
| `'A'`     | 65            |
| `'B'`     | 66            |
|           | ...           |
| `'Z'`     | 90            |
| `'['`     | 91            |
| `'\'`     | 92            |
| `']'`     | 93            |
| `'^'`     | 94            |
| `'_'`     | 95            |
| `` '`' `` | 96            |
| `'a'`     | 97            |
|           | ...           |
| `'z'`     | 122           |

</div>

Why, you might ask? This is for [historical](https://en.wikipedia.org/wiki/ASCII#Overview)
[reasons](https://en.wikipedia.org/wiki/Unicode#History).

### Unicode properties

The reason why Unicode was invented is that most people in the world don't speak English, and many
of them use languages with different alphabets. To support them, Unicode includes 149,813 codepoints
covering 161 different scripts. Since we have a widely supported standard for supporting different
languages, let's use it!

The character class {{<po>}}['a'-'z' 'A'-'Z']{{</po>}} only recognizes Latin characters.
What should we do instead? We should use a
[general category](https://en.wikipedia.org/wiki/Unicode_character_property#General_Category).
In this case, `Letter` seems like a good choice. Pomsky makes it easy to use Unicode categories:

```pomsky
[Letter]
```

That's it. This matches any letter from all 161 scripts! It's also possible to match any codepoint
in a certain script:

```pomsky
[Cyrillic Hebrew]
```

This matches a Cyrillic or Hebrew codepoint.

Some regex engines can also match Unicode properties other than categories and scripts. Useful
properties include

- `Alpha` (letters and marks that can appear in a word)
- `Upper`, `Lower` (uppercase or lowercase letters)
- `Emoji`
- `Math` (mathematical symbols)

You can see the full list of Unicode properties [here](/docs/appendix/unicode-properties).

## Negation

Character classes are negated by putting a {{<po>}}!{{</po>}} in front of it. For example,
{{<po>}}!['a'-'f']{{</po>}} matches anything except a letter between `a` and `f`.

It's also possible to negate Unicode properties individually. For example,
{{<po>}}[Latin !Alpha]{{</po>}} matches a codepoint that is either in the Latin script,
or is not alphabetic.

Remember the example from the previous page? We repeated the dot to match matching curly braces:

```pomsky
'{' .* '}'
```

But it didn't work correctly because the dot is greedily repeated, so it can consume curly braces:

```pomsky
{foo}  {bar}
 ^^^^^^^^^^
```

We can fix this by using a character class that doesn't match curly braces:

```pomsky
'{' !['{}']* '}'
```
