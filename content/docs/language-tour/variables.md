---
title: 'Variables'
description: "Refactoring expressions so you Don't Repeat Yourself"
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

Variables are a powerful feature that is exclusive to Pomsky; because no regex engine offers this
functionality, variables in Pomsky are "inlined", i.e. substituted with their value recursively.

Variables are declared with the {{<po>}}let{{</po>}} keyword:

```pomsky
let x = 'hello' | 'world';
```

The above will emit nothing, because the variable is declared, but not used. It could be used like
this:

```pomsky
let x = 'hello' | 'world';
x '!'
```

This compiles to

```regexp
(?:hello|world)!
```

Because variables are inlined, they do not allow recursion, otherwise the generated regular
expression would have infinite size. But even without recursion, variables are a powerful and useful
tool to create more complex expressions. Variables also serve as documentation: Their names tell the
reader what the corresponding expression should match. Of course, this requires that you use
descriptive variable names.

There can be multiple variable declarations. They can appear in any order, but the Pomsky expression
using the variables must come last. For example, this is _not_ allowed:

```pomsky
# doesn't work!
x '!'
let x = 'hello' | 'world';
```

Declarations can depend on each other, as long as there is no cyclic dependency:

```pomsky
let c = 'test';
let a = b b;
let b = c '!';

a
```

Here, `a` depends on `b`, which depends on `c`. But `c` cannot depend on `a`, as this would lead to
a cyclic dependency.

## Nesting

Variable declarations are _statements_, like [modifiers](/docs/language-tour/modifiers/). They can
also be nested within a group; in that case, they are only usable within this group:

```pomsky
let name = 'Max';
(
    let greeting = 'Hello';
    greeting ', ' name
)
greeting  # error!
```

Here, `greeting` can't be used in the last line because it is only accessible within the
group where it was declared.

## Keep your code DRY

"DRY" stands for "Don't Repeat Yourself", and is an important principle in software engineering. It
means that when you have the same code in multiple places, you should move it to its own function
to avoid duplication.

Why is duplication bad? Because whenever you have to change it, you need to apply the same change in
multiple places, and forgetting to update a place can easily cause bugs. With a lot of duplication,
your code also becomes messy and unreadable.

Pomsky makes it easy to keep your expressions DRY: Whenever there is duplication, you can put it
in a variable. For example, remember the example from the
[previous page](/docs/language-tour/capturing-groups):

```pomsky
:([digit]+) '.' :([digit]+) '.' :([digit]+)
```

This isn't particularly bad, but we can still improve it with a variable:

```pomsky
let number = [digit]+;

:(number) '.' :(number) '.' :(number)
```

Note that capturing groups cannot appear in a variable declaration. This is because capturing
groups must be unique.

## Negation

You can negate variables, but only if the expression they are replaced with can be negated. For
example:

```pomsky
let hex = ['0'-'9' 'a'-'f' 'A'-'F'];
let non_hex = !hex;
```
