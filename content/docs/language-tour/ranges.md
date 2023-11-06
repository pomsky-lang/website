---
title: 'Ranges'
description: 'Matching a number in a certain range'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7014
toc: true
---

When you need to match a range of numbers, the `range` syntax is your best friend. Character ranges
(e.g. {{<po>}}['0'-'7']{{</po>}}) are only able to match a single digit; the `range` syntax has no
such limitation:

```pomsky
let octet = range '0'-'255';

# ipv4 address
octet ('.' octet){3}
```

This generates a regular expression that is both correct and as efficient as possible, since it
never requires backtracking. If you're curious, here's the regex the
{{<po>}}range '0'-'255'{{</po>}} compiles to:

```regexp
0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-5]?|[6-9])?|[3-9][0-9]?
```

## Different bases

Pomsky can generate ranges in various bases. For example, to match hexadecimal numbers in a certain
range, you might write:

```pomsky
range '10F'-'FFFF' base 16
```

## Leading zeroes

<!-- prettier-ignore -->
If you wish to support leading zeros, this is easy to achieve by putting {{<po>}}'0'*{{</po>}}
in front:

```pomsky
'0'* range '0'-'1024'
```

If the number should have a certain length, with leading zeroes added when necessary, Pomsky has a
special syntax for this:

```pomsky
range '0000'-'1024'
```

This matches numbers in the specified range with exactly 4 digits, such as `0110` or `0026`.
