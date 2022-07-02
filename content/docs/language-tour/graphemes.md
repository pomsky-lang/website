---
title: 'Graphemes'
description: "Matching what represents a single 'character'"
lead: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 211
toc: true
---

Some regex engines support matching a single Unicode grapheme cluster. A grapheme cluster is what
comes closest to what we perceive as a character. It can consist of more than one code point.
For example, emojis with modifiers (such as different skin tones, genders, etc.) usually consist of
multiple code points.

In pomsky, matching a grapheme cluster is done with {{<po>}}Grapheme{{</po>}}. For example,
to match a text with at most 400 characters, you can write

```pomsky
Grapheme{0,400}
```

{{<po>}}Grapheme{{</po>}} is a [built-in variable](../../reference/built-in-variables).
