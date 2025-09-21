---
title: 'Semantic version'
description: 'Validate a version matches the semver 2.0 spec'
---

Here's a regular expression for parsing a version according to the [semver 2.0.0 specification](https://semver.org/):

```regexp
(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)(?:-(?P<prerelease>[0-9a-zA-Z\-]+(?:\.[0-9a-zA-Z\-]+)*))?(?:\+(?P<buildmeta>[0-9a-zA-Z\-]+(?:\.[0-9a-zA-Z\-]+)*))?
```

And in free-spacing mode:

```regexp
(?P<major> \d+) \. (?P<minor> \d+) \. (?P<patch> \d+)
(?:
  - (?P<prerelease> [0-9a-zA-Z\-]+ (?: \. [0-9a-zA-Z\-]+ )* )
)?
(?:
  \+ (?P<buildmeta> [0-9a-zA-Z\-]+ (?: \. [0-9a-zA-Z\-]+ )* )
)?
```

Here's an equivalent Pomsky expression:

```pomsky
let number = [digit]+;
let identifier = [ascii_alnum '-']+;
let identifiers = identifier ('.' identifier)*;

:major(number) '.' :minor(number) '.' :patch(number)
('-' :prerelease(identifiers))?
('+' :buildmeta(identifiers))?
```
