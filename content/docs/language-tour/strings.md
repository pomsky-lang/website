---
title: 'Strings'
description: 'Introduction to matching text'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7001
toc: true
---

First, let's get familiar with the basic building blocks of the language.

Pomsky expressions describe the syntactical structure of a text. There are several kinds of
expressions. The most important kind is the _string:_

```pomsky
'test'
```

This is an expression matching the text `test`. Note that strings are always wrapped in quotes. This
is how we can distinguish strings from other kinds of expressions!

Multiple strings can be concatenated by writing them in succession:

```pomsky
'foo' 'bar'
```

This matches the text `foobar`. Spaces between the strings are ignored, as are line breaks: Pomsky
is _whitespace-insensitive_. Whitespace is what we call all invisible characters, such as spaces and
line breaks. However, whitespace is only ignored outside of strings:

```pomsky
'spaces and this line
break are not ignored!'
```

## Comments

So far, the expressions have been very simple, but this will change in the following chapters. When
writing more complex expressions, it can be important to explain what something is doing, so a
reader can understand it. This is what comments are for:

```pomsky
# this is a comment
# comments are ignored by Pomsky!
```

Comments start with a `#` and go until the end of the line. Comments are ignored by Pomsky, they're
meant only for you, the reader. You can add as much useful information in comments as you want!

## String quotes

We can use double quotes ({{<po>}}""{{</po>}}) or single quotes ({{<po>}}''{{</po>}}) for strings.
Most of the time it doesn't matter which quotes you use, with a few exceptions:

Strings delimited with {{<po>}}''{{</po>}} can't contain single quotes. To match the text
`Spiders'`, use double quotes:

```pomsky
"Spiders'"
```

Likewise, use {{<po>}}''{{</po>}} whenever a string contains double quotes. But what if a string
contains both? One possible solution is to concatenate multiple strings:

```pomsky
'The restaurant is called "Spiders'  "'"  '".'
```

Here are three strings, together matching the text `The restaurant is called "Spiders'".`. If you
don't like this approach, there is another solution: Double quoted strings allow _escaping_
with a backslash (`\`):

```pomsky
"The restaurant is called \"Spiders'\"."
```

A backslash escapes the next character, robbing it of its special meaning. This means `\"` is
treated as a `"` character, and not as the closing quote of the string. However, in double quoted
strings, backslashes must be escaped as well, so when matching a Windows file path like
`C:\User\John Doe\Documents\Thesis.pdf`, better use single quotes.
