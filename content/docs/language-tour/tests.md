---
title: 'Unit tests'
description: 'Check if your expression works correctly'
excerpt: ''
date: 2024-12-20T11:55:00+00:00
lastmod: 2024-12-20T11:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'language-tour'
weight: 7004
toc: true
---

In the last chapter, we looked at this expression, matching a [UNIX file permissions](https://docs.nersc.gov/filesystems/unix-file-permissions/) string:

```pomsky
('r' | 'w' | 'x' | '-'){9}
```

Once a Pomsky expression reaches a certain complexity, it is good to add some tests to make sure it works as desired. This is quite easy by adding a `test {}` block:

```pomsky
test {
  match 'rwxrwxrwx';
  match 'rwxr-xr--';
  match '---------';
}

('r' | 'w' | 'x' | '-'){9}
```

What if we want to test that something _doesn't_ match? We use the `reject` keyword for this:

```pomsky
test {
  match 'rwxrwxrwx';
  match 'rwxr-xr--';
  match '---------';
  reject 'wrxxrwrxw';
}

('r' | 'w' | 'x' | '-'){9}
```

If you open this in the [playground](https://playground.pomsky-lang.org/?flavor=js&c=K0ktLlGo5lJQyE0sSc5QUCoqr4AgJWtUQV0g0kUW1IUBsGBRalZqcomCUnlRBVB3UUU5ULSWi0tDvUhdoUZBvRxMVoBJXXXNastaAA), you'll notice a red underline, indicating that the `reject` statement is wrong: Our expression doesn't ensure that the letters appear in the correct order! Let's fix it:

```pomsky
test {
  match 'rwxrwxrwx';
  match 'rwxr-xr--';
  match '---------';
  reject 'wrxxrwrxw';
}

(['r-']['w-']['x-']){3}
```

Now the tests pass, so we can be more confident that the expression is correct.

Pomsky tests also allow you to look for substring matches with `in`:

```pomsky
test {
  match in 'Did you know that rwxrwxrwx is a UNIX file permission';
  reject in 'The string wrxxrwrxw is not valid';
}
```

You can specify what part of the string should be matched as well:

```pomsky
test {
  match 'rwxrwxrwx'
     in 'Did you know that rwxrwxrwx is a UNIX file permission';
}
```
