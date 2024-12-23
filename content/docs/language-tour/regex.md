---
title: 'Inline Regexes'
description: 'Insert text in the output regex with no escaping'
excerpt: ''
date: 2022-09-20T13:55:00+00:00
lastmod: 2022-09-20T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7018
toc: true
---

Although Pomsky on its own is very powerful, there might be situations where its syntax is not
expressive enough. In these rare situations, Pomsky has an escape hatch: The `regex` keyword allows
specifying an expression that is embedded in the output verbatim, without escaping:

```pomsky
regex 'hello|world?'
```

This emits the following regular expression:

```regexp
hello|world?
```

{{<alert icon="⚠️" text="This is <strong>dangerous</strong> and should only be used as a last resort. Pomsky does not parse the content of <code>regex</code> expressions, so it cannot ensure that the output is valid." />}}

For example, this is how you could use subroutines (which are not officially supported by Pomsky):

```pomsky
:octet(range '0'-'255') ('.' regex '\g<octet>'){3}
```

Note that Pomsky wraps a `regex` expression in a non-capturing group if it is followed by a
repetition or surrounded by parentheses.

## Finish line

This concludes the language tour! If you have feedback, you can [open an issue](https://github.com/pomsky-lang/website/issues) or [write in our Discord channel](https://discord.gg/uwap2uxMFp).
