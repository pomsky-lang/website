---
title: 'Tests'
description: 'Reference – Writing unit tests in Pomsky'
---

Tests are written in a `test {}`#po block to unit test the expression by matching it against a list
of strings.

## Syntax

```pomsky
let Test = 'test' '{' TestCase* '}';

let TestCase =
    | TestCaseMatch
    | TestCaseMatchAll
    | TestCaseReject;

let TestCaseMatch = 'match' TestCaseSingleMatch ';';
let TestCaseMatchAll = 'match' TestCaseMatches? 'in' String ';';
let TestCaseReject = 'reject' 'in'? String ';';

let TestCaseMatches = TestCaseSingleMatch (',' TestCaseSingleMatch)*;

let TestCaseSingleMatch = String TestCaptures?;

let TestCaptures = 'as' '{' TestCapturesInner? '}';

let TestCapturesInner = TestCapture (',' TestCapture)* ','?;

let TestCapture = TestCaptureName ':' String;

let TestCaptureName =
    | Number
    | Ident;
```

Test may only appear in the top-level scope, so the following is forbidden:

```pomsky
(
  test {}  # ERROR
  'foo'
)
```

## Example

```pomsky
test {
  match 'john.doe@mail.box';

  match 'john.doe@mail.box' as { 1: 'john.doe', domain: 'mail.com' };

  match 'john.doe@mail.box', 'jdoe@gmail.com!'
     in 'My addresses are john.doe@mail.box and jdoe@gmail.com!';

  reject 'john.doe@mailbox';

  reject in 'There is no valid email@address in this string';
}

:(![s '@']+) '@' :domain(![s '@']+ '.' ![s '@'])
```

## Support

Tests are supported in all flavors, but can only be executed with PCRE2 at the moment. This is done
by passing `--test=pcre2` to the CLI.

## Behavior

A test case can either assert that something matches (with `match`) or does not match (with
`reject`). Pomsky supports two matching modes, _exact match_ and _substring match_. The substring
matching mode is used when the test case includes the `in` keyword.

| Syntax                        | Behavior                     |
| ----------------------------- | ---------------------------- |
| `match 'foo';`#po             | expects exact match          |
| `reject 'foo';`#po            | expects no exact match       |
| `match 'f', 'o' in 'foo';`#po | expects substring match 'f'  |
| `reject in 'foo';`#po         | expects no substring matches |

When using substring matches, all matches must be specified and in the correct order. The matches
do not overlap. You can specify capturing groups for each substring match individually.

When specifying capturing groups, you do not need to specify all of them; only the specified groups
are compared. They can appear in any order. Unnamed capturing groups are assigned an ascending
number, starting with 1. The capturing group 0 is the entire match.

Tests are only executed when the `--test` option is used in the CLI.

## Compilation

Tests do not produce any output. However, when the `--test` flag is used, the expression is
compiled twice: Once for the target flavor, and again for PCRE2. The compiled PCRE2 pattern is
used for testing and discarded afterwards.

## Issues

The potential mismatch between the target flavor and the flavor used for testing can result in
**false positives** (where PCRE2 accepts a pattern that is illegal in the target flavor) and
**false negatives** (where PCRE2 fails to match a pattern that would match in the target flavor).

One common example is when the expression contains a lookbehind assertion of variable length.
PCRE2 only supports constant-length lookbehind due to technical limitations.

## Security concerns

Since PCRE2 is a backtracking regex engine, an attacker should not be allowed to compile and test
untrusted Pomsky expressions on a server, as this can lead to exponential backtracking and exhaust
the server's resources.

## History

Initial implementation in Pomsky 0.11

- Supports only PCRE2
