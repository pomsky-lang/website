---
title: 'Enable Unicode Support'
description: 'Configure the RegExp engine to support Unicode.'
excerpt: 'Configure the RegExp engine to support Unicode.'
date: 2022-05-17T13:55:00+00:00
lastmod: 2022-05-17T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'get-started'
weight: 6004
toc: true
---

Pomsky has good Unicode support, but you might still have to enable Unicode support in your regex engine. This document explains how to do that for various regex engines.

If some information here is missing, outdated or needs clarification, I would greatly appreciate your help! You can [edit this file](https://github.com/pomsky-lang/website/tree/main/content/docs/get-started/enable-unicode.md) on GitHub.

## Rust

The Rust `regex` crate is Unicode-aware by default. There's nothing you need to do.

## JavaScript

In JavaScript, set the `u` flag, for example {{<regexp>}}/[\w\s]/u{{</regexp>}}. This makes it possible to use Unicode properties ({{<regexp>}}\p{...}{{</regexp>}}) and code points outside of the BMP ({{<regexp>}}\u{...}{{</regexp>}}).

Since `\w` and `\d` are _not_ Unicode aware even when the `u` flag is enabled, Pomsky polyfills them. However, word boundaries aren't Unicode aware, so you need to disable Unicode to use them or use lookarounds.

```pomsky
disable unicode;
<'test'>
```

If you need Unicode-aware word boundaries, you can use the following instead of the {{<po>}}<{{</po>}} and {{<po>}}>{{</po>}} word boundaries:

```pomsky
let wstart = (!<< [w]) (>> [w]);  # start of a word
let wend   = (<< [w]) (!>> [w]);  # end of a word
```

## PHP

PHP is Unicode-aware if the `u` flag is set, and this also applies to {{<regexp>}}\w{{</regexp>}},
{{<regexp>}}\d{{</regexp>}}, {{<regexp>}}\s{{</regexp>}} and {{<regexp>}}\b{{</regexp>}}. For
example, {{<regexp>}}'/\w+/u'{{</regexp>}} matches a word in any script.

## Java, Kotlin, Scala

Add {{<regexp>}}(?U){{</po>}} in front of the regex to make it Unicode-aware. For
example, `"(?U)\\w+"` matches a word in any script.

## Ruby

In Ruby, add {{<regexp>}}(?u){{</regexp>}} in front of the regex to make it Unicode-aware. For
example, {{<regexp>}}/(?u)\w+/{{</regexp>}} matches a word in any script.

## Python

In the Python `re` module, {{<regexp>}}\w{{</regexp>}}, {{<regexp>}}\d{{</regexp>}},
{{<regexp>}}\s{{</regexp>}} and {{<regexp>}}\b{{</regexp>}} are Unicode-aware since Python 3.

If you're still using Python 2, you can use the [regex](https://pypi.org/project/regex/2021.11.10/)
module from November 2021; releases newer than that don't support Python 2.

## Elixir

Regexes in Elixir are Unicode-aware if the `u` flag is added. For example, {{<regexp>}}~r/\w+/u{{</regexp>}} matches a word in any script.

## Erlang

You need to set the `unicode` and `ucp` options to make regexes Unicode aware. For example, `re:compile("\\w+", [unicode, ucp])` matches a word in any script.

## PCRE

PCRE supports Unicode, but to make {{<regexp>}}\w{{</regexp>}}, {{<regexp>}}\d{{</regexp>}},
{{<regexp>}}\s{{</regexp>}} and {{<regexp>}}\b{{</regexp>}} Unicode-aware, you need to enable both
`PCRE_UTF8` and `PCRE_UCP`.
