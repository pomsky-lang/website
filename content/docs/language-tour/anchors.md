---
title: 'Anchors'
description: 'Matching the start/end of the string'
excerpt: ''
date: 2023-11-03T18:00:00+00:00
lastmod: 2023-11-03T18:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7008
toc: true
---

Anchors match the start or end of the text. {{<po>}}^{{</po>}} matches the start, and
{{<po>}}${{</po>}} matches the end. Anchors are important because regex engines typically match
substrings of the text, but sometimes you want the _entire_ text to match.

For example: Let's say a user entered a phone number, and you want to check if it is valid. You use
the following expression:

```pomsky
'+'? [ascii_digit '-()/ ']+
```

But this also finds a match in texts that aren't valid phone numbers:

```
agt4578409tuirüzojhüziou54x
   ^^^^^^^              ^^
   match 1              match 2
```

To make sure the entire text has to match, we can add {{<po>}}^{{</po>}} and {{<po>}}${{</po>}}
anchors:

```pomsky
^ '+'? [ascii_digit '-()/ ']+ $
```

The {{<po>}}^{{</po>}} ensures the match is at the start of the text, and the {{<po>}}${{</po>}}
ensures that the end of the match is also the end of the search text.

Anchors can appear anywhere, to implement more complicated logic. For example:

```pomsky
('a' | ^) 'b'
```

This matches either `ab` or just `b`. But if there is no `a`, the match must be at the start of the
text.
