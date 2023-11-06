---
title: 'Modifiers'
description: 'Change how a sub-expression is treated'
excerpt: ''
date: 2023-11-03T18:00:00+00:00
lastmod: 2023-11-03T18:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7009
toc: true
---

Modifiers allow you to change the behavior of a Pomsky expression. Modifiers are _statements;_ they
can appear either at the top of the file, or inside a group:

```pomsky
disable unicode;

[word]+ (enable unicode; '.' [word]+)
```

Modifiers must appear before the expression they modify. They consist of two parts: The
{{<po>}}enable{{</po>}} or {{<po>}}disable{{</po>}} keyword, and a mode, followed by a `;`.

There are currently two modes that can be enabled or disabled:

## Unicode mode

Unicode is enabled by default; disable it with {{<po>}}disable unicode;{{</po>}}.

When Unicode mode is disabled, shorthands like {{<po>}}[word]{{</po>}} no longer recognize Unicode,
only ASCII. Unicode properties like {{<po>}}[Letter]{{</po>}} or {{<po>}}[Emoji]{{</po>}} are
forbidden when Unicode is disabled.

Unicode mode also affects word boundaries: When disabled, only the ASCII characters `a-z`, `A-Z`,
`0-9` and underscore `_` are treated as word characters. This means that the word `Königsstraße`
has word boundaries around the `ö` and `ß`, because they are not in the ASCII character set.

## Lazy mode

The lazy mode is enabled with {{<po>}}enable lazy;{{</po>}}. It has the effect that repetition
(which is usually [greedy](/docs/language-tour/repetitions/#matching-behavior)) becomes lazy:
The regex engine will then try to repeat the expression as few times as possible.

For example, the expression {{<po>}}'la'+{{</po>}} will always match exactly one `la` in lazy mode,
even when the search string is `lalalala`, because the regex engine stops searching as soon as it
found the first `la`.

Lazy mode is a solution to the problem that occurs when
[the dot is repeated](/docs/language-tour/dots/#repeating-the-dot):

```pomsky
enable lazy;

'{' .* '}'
```

Without lazy mode, this greedily consumes as many characters as possible. So if the string
`{foo} bar {baz}` should contain two matches, lazy mode is required. However, it is usually better
to make the repetition more specific:

```pomsky
'{' !['{}']* '}'
```

This is more performant because it avoids backtracking, and it is unambiguous.

Note that laziness and greediness can also be set individually for each repetition:

```pomsky
.* lazy     # make only this repetition lazy
.* greedy   # make only this repetition greedy
```
