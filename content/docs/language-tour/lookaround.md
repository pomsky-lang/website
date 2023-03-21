---
title: 'Lookaround'
description: 'Matching forwards or backwards without consuming characters'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 207
toc: true
---

Lookarounds provide the ability to see if the characters before or after the current position
match a certain expression. There are four variants:

- {{<po>}}>>{{</po>}}, a positive lookahead. For example, {{<po>}}(>> [w]){{</po>}}
  matches if the position is followed by a word character. That character isn't included in the
  match.

- {{<po>}}<<{{</po>}}, a positive lookbehind. For example, {{<po>}}(<< [w]){{</po>}}
  matches if the position is directly after a word character.

- {{<po>}}!>>{{</po>}}, a negative lookahead. For example {{<po>}}(!>> [w]){{</po>}}
  matches if the position is _not_ followed by a word character. Note that this also matches at
  the end of the string, so it's not the same as {{<po>}}(>> ![w]){{</po>}}, which would
  require that the position is followed by at least one character.

- {{<po>}}!<<{{</po>}}, a negative lookbehind. For example {{<po>}}(!<< [w]){{</po>}}
  matches if the position is _not_ directly after a word character. This also matches at the start
  of the string, so it's not the same as {{<po>}}(<< ![w]){{</po>}}.

Note that lookbehind isn't supported everywhere, for example in Safari.

Lookaround makes it possible to match a string in multiple ways. For example,
{{<po>}}(!>> ('_' | 'for' | 'while' | 'if') %) [w]+ %{{</po>}} matches a string consisting
of word characters, but not one of the keywords `_`, `for`, `while` and `if`. Be careful when using
this technique, because the lookahead might not match the same length as the expression after it.
Here, we ensured that both match until the end of the word with {{<po>}}%{{</po>}}.
