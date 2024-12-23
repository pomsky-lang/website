---
title: 'Capturing Groups'
description: 'Capture group contents for search & replace'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7011
toc: true
---

As we have seen before, parentheses can be used to group expressions together. _Capturing groups_
are a special kind of group that capture their matched text. This allows extracting information
from matches later.

Here is an example where a Pomsky expression is used to match a
[semantic version number](https://semver.org/):

```pomsky
# a semver version number, e.g. '1.3.17'
:([digit]+) '.' :([digit]+) '.' :([digit]+)
```

The `:` in front of the groups turns them into _capturing groups_. This means that when matching
the string `1.3.17`, the regex engine will create 3 captures containing the substrings `1`, `3`,
and `17`.

Here is how we could use them in JavaScript:

```js
import versionRegex from './versionRegex.pom'

function createVersionTag(version) {
  return version.replace(versionRegex(), 'v$1_$2_$3')
}
```

The `import` statement imports and compiles the Pomsky expression, which is expected to be in
another file, `versionRegex.pom`.

{{<alert icon="⚠️" text="This requires a bundler with the <a href=\"https://www.npmjs.com/package/@pomsky-lang/unplugin\">@pomsky-lang/unplugin</a> module." />}}

The `replace` function accepts two arguments: The compiled Pomsky expression, and a
**substitution string**. This string contains some **placeholders**, `$1`, `$2`, and `$3`, which
are substituted with the 1st, 2nd, and 3rd capturing group. So when the function is called with
{{<po>}}'1.3.17'{{</po>}}, it will return `v1_3_17`.

## Named capturing groups

You can give capturing groups a name:

```pomsky
:major([digit]+) '.' :minor([digit]+) '.' :patch([digit]+)
```

This is good practice, as you no longer need to count capturing groups and can simply refer to them
by their name:

```js
import versionRegex from './versionRegex.pom'

function createVersionTag(version) {
  const { major, minor, patch } = versionRegex().exec(version).groups
  return `v${major}_${minor}_${patch}`
}
```

## Testing capturing groups

When writing unit tests, it might be important to test the contents of specific capturing groups:

```pomsky
test {
  match '1.3.17' as { major: '1', minor: '3', patch: '17' };
  # using indices:
  match '1.3.17' as { 1: '1', 2: '3', 3: '17' };
}

:major([digit]+) '.' :minor([digit]+) '.' :patch([digit]+)
```
