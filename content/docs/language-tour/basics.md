---
title: 'Basics'
description: 'Comments, strings, alternation'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 201
toc: true
---

First, let's get familiar with the basic building blocks of the language.

Pomsky expressions describe the syntactical structure of a text. There are several kinds of
expressions, which will be explained now.

In pomsky, whitespace is insignificant, except between quotes. This means that we can add spaces
and line breaks to make the code look clearer. We can also add comments to explain what the
expressions are doing. They start with a `#` and span until the end of the line:

```pomsky
# this is a comment
# comments are ignored by pomsky!
```

## Strings

In pomsky, characters that should be matched as-is, are always wrapped in quotes. We can use
double quotes ({{<po>}}""{{</po>}}) or single quotes ({{<po>}}''{{</po>}}). Text
wrapped in quotes we call a _string_. It matches the exact content of the string:

```pomsky
"test"
```

In double quoted strings ({{<po>}}"..."{{</po>}}), double quotes can be escaped by
prepending a backslash. Backslashes also must be escaped:

```pomsky
"\"C:\\windows\""
# is equivalent to
'"C:\windows"'
```

## Concatenate expressions

Pomsky consists of _expressions_. For example, a string is an expression. If we write several
expressions in a row, they are matched one after the other:

```pomsky
'hello' 'world' '!'     # matches the string "helloworld!"
```

## Alternatives

What if we want to match multiple strings? In a regex, we can enumerate multiple alternatives,
divided by a {{<po>}}|{{</po>}}:

```regexp
one|two|three|four|five
```

The same works in pomsky:

```pomsky
'one' | 'two' | 'three' | 'four' | 'five'
```

This type of expression is called an _alternation_. Pomsky also allows a leading {{<po>}}|{{</po>}},
which looks a bit nicer if we put each alternative on its own line:

```pomsky
| 'one'
| 'two'
| 'three'
| 'four'
| 'five'
```
