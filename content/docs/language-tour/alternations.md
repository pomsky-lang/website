---
title: 'Alternations'
description: 'Match one of multiple alternatives'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7002
toc: true
---

What if we want to match multiple strings? Say, we want to match the texts `one`, `two`, `three`,
`four`, and `five`:

```pomsky
'one' | 'two' | 'three' | 'four' | 'five'
```

It's that easy, just separate all alternatives with a vertical bar. This is called an
_alternation_. The `|` can be read as "or", since the above matches {{<po>}}'one'{{</po>}} _or_
{{<po>}}'two'{{</po>}} _or_ {{<po>}}'three'{{</po>}} _or_ {{<po>}}'four'{{</po>}} _or_
{{<po>}}'five'{{</po>}}.

## Grouping

If we want to concatenate an alternation, we need to wrap it in parentheses:

```pomsky
('blue' | 'yellow' | 'green') 'ish'
```

This matches `blueish`, `yellowish`, and `greenish`. Every expression can be surrounded by
parentheses, this is called a _group_. Here the parentheses are needed to clarify that the `ish`
is concatenated with the entire alternation, not just the `green` part.

## Formatting

When your expression gets so long that it doesn't fit in a single line, it looks better to put every
alternative in a separate line:

```pomsky
'one'
| 'two'
| 'three'
| 'four'
| 'five'
```

But this looks odd, because the first line is not aligned with the others. So Pomsky allows you to
add a _leading vertical bar:_

```pomsky
| 'one'
| 'two'
| 'three'
| 'four'
| 'five'
```
