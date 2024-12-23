---
title: 'Word Boundaries'
description: 'Matching the start/end of a word'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7009
toc: true
---

Word boundaries match a position where a word starts or ends. Like anchors, they do not consume
any characters -- they have a length of 0. Expressions like this are called _assertions_.

There are three kinds of word boundaries:

- {{<po>}}<{{</po>}} to match at the start of a word
- {{<po>}}>{{</po>}} to match at the end of a word
- {{<po>}}%{{</po>}} to match either at the start or at the end of a word.

For example, if you want to find occurrences of the word `test`, but do not want to match
substrings in words like `testament` or `detests`, you need to add word boundaries:

```pomsky
<'test'>
```

To match multiple words, wrap an alternation in a group:

```pomsky
<('if' | 'else' | 'for' | 'while')>
```

## What is a word boundary?

A word _start_ boundary is a position followed, but not preceded by a word character. Likewise,
a word _end_ boundary is position preceded, but not followed by a word character.

"Word characters" include letters, digits, and underscores. Formally, word characters are the set
of the following Unicode properties:

- Alphabetic
- Mark
- Decimal_Number
- Connector_Punctuation

You can match a word character with the {{<po>}}[word]{{</po>}} character set.

Note that word boundaries aren't 100% accurate: For example, the word `can't` has 4 word boundaries:
At the start, the end, and around the apostrophe. Some scripts (e.g. Chinese) don't separate words
by spaces, so no word boundaries can be detected.

## Negation

The {{<po>}}%{{</po>}} word boundary can be negated as {{<po>}}!%{{</po>}}. This matches inside or
outside of a word, but not at a word boundary.

## Note about JavaScript

In JavaScript, word boundaries are _never_ Unicode-aware, even when the `u` flag is set. That's why
Unicode must be disabled to use them:

```pomsky
disable unicode;

<'test'>
```

If you need Unicode-aware word boundaries, you can use the following variables instead of the
{{<po>}}<{{</po>}} and {{<po>}}>{{</po>}} word boundaries:

```pomsky
let wstart = (!<< [w]) (>> [w]);  # start of a word
let wend   = (<< [w]) (!>> [w]);  # end of a word

wstart 'test' wend
```
