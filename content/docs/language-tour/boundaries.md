---
title: 'Boundaries'
description: 'Matching the start/end of a word or string'
lead: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 206
toc: true
---

Boundaries match a position in a string without consuming any code points. There are 4 boundaries:

- {{<po>}}%{{</po>}} matches a word boundary. It matches successfully if it is preceded,
  but not succeeded by a word character, or vice versa. For example,
  {{<po>}}Codepoint % Codepoint{{</po>}} matches `A;` and `;A`, but not `AA` or `;;`.

- {{<po>}}!%{{</po>}} matches a position that is _not_ a word boundary. For example,
  {{<po>}}Codepoint !% Codepoint{{</po>}} matches `aa` and `::`, but not `a:` or `:a`.

- {{<po>}}Start{{</po>}} matches the start of the string.

- {{<po>}}End{{</po>}} matches the end of the string.

A word character is anything that matches {{<po>}}[word]{{</po>}}. If the regex engine is
Unicode-aware, this is {{<po>}}[Alphabetic Mark Decimal_Number Connector_Punctuation]{{</po>}}.
For some regex engines, Unicode-aware matching has to be enabled first
([see here](../../get-started/enable-unicode)).

In JavaScript, {{<po>}}%{{</po>}} and {{<po>}}!%{{</po>}} is _never_ Unicode-aware, even when
the `u` flag is set. [See here](../../get-started/enable-unicode#javascript) for more information.
