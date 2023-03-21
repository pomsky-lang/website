---
title: 'Character Classes'
description: 'Matching a codepoint with certain properties'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 204
toc: true
---

What if we want to match an arbitrary word? Enumerating every single word is obviously not feasible,
so what to do instead? We can simply enumerate the characters and repeat them:

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

This expression matches words that can contain uppercase and lowercase letters:

```pomsky
['a'-'z' 'A'-'Z']+
```

The square brackets indicate that this is a _character class_. A character class always matches
exactly 1 character (more precisely, a Unicode codepoint). This character class contains two
ranges, one for lowercase letters and one for uppercase letters. Together, this matches any
character that is either a lowercase or uppercase letter.

It's also possible to add single characters, for example:

```pomsky
['$' '_' 'a'-'z' 'A'-'Z']
```

When we have several characters in a character class that aren't part of a range, we can simply
put them into the same quotes:

```pomsky
['$_' 'a'-'z' 'A'-'Z']
```

This is equivalent to {{<po>}}('$' | '_' | ['a'-'z' 'A'-'Z']){{</po>}}, but it's shorter
and may be more efficient.

### Character ranges and Unicode

{{< alert icon="👉" text="You can <a href=\"#unicode-properties\">skip this section</a> if you are already familiar with Unicode." />}}

What is a range, exactly? Let's see with an example:

```pomsky
['0'-'z']
```

This doesn't seem to make sense, but does work. If you
[try it out](https://playground.pomsky-lang.org/?text=%5B%270%27-%27z%27%5D), you'll notice that it
matches numbers, lowercase and uppercase letters. However, it also matches a few other characters,
e.g. the question mark `?`.

The reason is that Pomsky uses Unicode, a standard that assigns every character a numeric value.
When we write {{<po>}}'0'-'z'{{</po>}}, Pomsky assumes that we want to match any character
whose numeric value is somewhere between the value of {{<po>}}'0'{{</po>}} and the value
of {{<po>}}'z'{{</po>}}. This works well for letters (e.g. {{<po>}}'a'-'Z'{{</po>}})
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
of them use languages with different alphabets. To support them, Unicode includes 144,697 codepoints
covering 159 different scripts. Since we have a standard that makes it really easy to support
different languages, there's no excuse for not using it.

The character class {{<po>}}['a'-'z' 'A'-'Z']{{</po>}} only recognizes Latin characters.
What should we do instead? We should use a
[general category](https://en.wikipedia.org/wiki/Unicode_character_property#General_Category).
In this case, `Letter` seems like a good candidate. Pomsky makes it easy to use Unicode categories:

```pomsky
[Letter]
```

That's it. This matches any letter from all 159 scripts! It's also possible to match any codepoint
in a certain script:

```pomsky
[Cyrillic Hebrew]
```

This matches a Cyrillic or Hebrew codepoint.

Most regex engines can also match Unicode properties other than categories and scripts. Useful
properties include

- `Alpha` (letters and marks that can appear in a word)
- `Upper`, `Lower` (uppercase or lowercase letters)
- `Emoji`
- `Math` (mathematical symbols)

You can see the full list of Unicode properties [here](../../reference/unicode-properties).

## What's a codepoint?

A Unicode codepoint _usually_, but not always, represents a character. Exceptions are
composite characters like `ć` (which may consist of a `´` and a `c` when it isn't normalized).
Composite characters are common in many scripts, including Japanese, Indian and Arabic scripts.
Also, an emoji can consist of multiple codepoints, e.g. when it has a gender or skin tone modifier.

Most regex engines look at one codepoint at a time. This means that {{<po>}}[Letter]{{</po>}}
matches exactly one codepoint. The exception is .NET, which does not properly support Unicode, and
character classes in .NET can only match codepoints from the
[Basic Multilingual Plane](<https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane>).

## Negation

Character classes are negated by putting a {{<po>}}!{{</po>}} in front of it. For example,
{{<po>}}!['a'-'f']{{</po>}} matches anything except a letter in the range from `a` to `f`.

It's also possible to negate Unicode properties individually. For example,
{{<po>}}[Latin !Alpha]{{</po>}} matches a codepoint that is either in the Latin script,
or is not alphabetic.

## Dot

You can use the dot (`.`) to match any codepoint, except line breaks. For example:

```pomsky
...  # 3 codepoints (except line breaks)
```

Most regex engines have a "singleline" option that changes the behavior of `.`. When enabled,
`.` matches everything, even line breaks. Usually, the dot does not match `\n` (line feed)
and possibly more line break characters depending on the regex flavor.

If you want to match any character, without having to enable the "singleline" option, Pomsky also
offers the variable `C` (or `Codepoint`):

```pomsky
C C C  # 3 codepoints
```

Note that the number of codepoints is not always the number of visible characters. Also note that
.NET does not properly support Unicode, and matches _UTF-16 code units_ instead of codepoints. This
means that when encountering a codepoint outside of the BMP, .NET matches each UTF-16 surrogate
individually, so one `.` or `C` may match only half a codepoint in .NET.

## Repeating the dot

Be careful when repeating `C` or `.`. My personal recommendation is to _never repeat them_. Let's see why:

```pomsky
'{' .* '}'
```

This matches any content surrounded by curly braces. Why is this bad? Because {{<po>}}.*{{</po>}} will greedily consume anything, even curly braces, so looking for matches in the string `{ab} de {fg}` will return the whole string, but we probably expected to get the two matches `{ab}` and `{fg}`.

We can fix this by making the repetition lazy:

```pomsky
'{' .* lazy '}'
```

However, if the expression is followed by anything else, the dot may still consume curly braces. For example:

```pomsky
'{' .* lazy '};'
```

This expression will match the text `{foo}}}};`, which may not be desired. So it is usually better to restrict which characters can be repeated:

```pomsky
'{' !['{}']* '};'
```

Now the curly braces can contain anything except `{` and `}`, so we know that it will stop repeating when a brace is encountered, and fail if there's no `};`.
