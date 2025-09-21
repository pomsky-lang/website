---
title: 'Variables'
description: 'Reference – Declaring and using variables'
---

Variables can be declared and later used to keep your code DRY. Variables are inlined into the
resulting expressions, similarly to macros in some programming languages.

## Syntax

```pomsky
let LetDeclaration = 'let' Name '=' OrExpression ';';

let Variable = Name;
```

Variabes are used simply by mentioning their name.

## Example

```pomsky
let number = [digit]+;
let identifier = [ascii_alnum '-']+;
let identifiers = identifier ('.' identifier)*;

number '.' number '.' number ('-' identifiers)? ('+' identifiers)?
```

## Support

Variables are supported in all flavors, since they are inlined.

Support for variables is gated by the `variables` feature (enabled by default). Specify features
with the `--allowed-features` option.

## Behavior

A variable may be used multiple times, but not recursively:

```pomsky
let a = '.' b;
let b = ':' a?;  # ERROR
```

This is because variables are inlined, so recursion would produce a regex of infinite size.

Variable declarations must be written before the actual expression. They can be nested within
groups and lookaround assertions. When nested, the variables can only be used within the enclosing
scope:

```pomsky
(
  let foo = 'foo';
  foo  # allowed
)
foo  # ERROR
```

Variables from an outer scope can be "shadowed" (redeclared) in an inner scope. When using it in the
inner scope, it refers to the inner (shadowed) declaration, but when using it in the outer scope,
it refers to the outer variable:

```pomsky
let foo = '1';
(
  let foo = '2';
  foo  # 2
)
foo  # 1
```

Technically, these are considered two different variables that just happen to have the same name,
but the inner variable is only accessible within the group in which it was declared.

Variables can depend on each other, as long as there are no cycles, and the order of declarations
does not matter. Notably, a variable can be used before it was declared:

```pomsky
let a = b b;
let b = 'test';
a
```

There are a few built-in variables. These can also be shadowed.

### Built-in variables

There are 6 built-in variables:

- `Grapheme` matches a single extended grapheme cluster. It compiles to the regex
  `\X`#re.
  Note that this functionality is not available in all regex flavors.
- `G` is an alias for `Grapheme`
- `Codepoint` matches a single Unicode code point. It compiles to the regex
  `[\s\S]`#re.
- `C` is an alias for `Codepoint`
- `Start`: Matches the start of the string. Equivalent to `^`.
- `End`: Matches the end of the string. Equivalent to `$`.

## Compilation

Compilation works by recursively substituting variables with the expression in their declaration.
This is called _expansion_:

```pomsky
let a = '.' b?;
let b = 'test'*;
a+
```

becomes:

```pomsky
let b = 'test'*;
('.' b?)+
```

becomes:

```pomsky
('.' 'test'*)+
```

Note that expressions sometimes need to be wrapped in a group. Also, the expansion sometimes enables
optimizations, such as the removal of the `?` repetition above.

## Issues

Because of the way variables are compiled, the resulting regex can be quite large -- so large,
in fact, that regex engines may run out memory trying to compile them into a state machine. This
is particularly likely in the Rust flavor. To remedy this, be careful how often you use variables
that expand to complicated expressions.

## Security concerns

Expansion of variables is not cached, so compilation time can be exponential, see the
[Billion Laughs Attack](https://en.wikipedia.org/wiki/Billion_laughs_attack) as an example.

An attacker should not be allowed to compile untrusted Pomsky expressions on a server, as this can
take forever and exhaust the server's resources.

## History

- Built-in variables `Start`, `End`, `Codepoint`, `Grapheme` added in Pomsky 0.4.2
- Initial implementation in Pomsky 0.3
