import type { LanguageInput } from 'shiki'

export default {
  name: 'pomsky',
  patterns: [
    { include: '#comments' },
    { include: '#keywords' },
    { include: '#dstrings' },
    { include: '#sstrings' },
    { include: '#references' },
    { include: '#codepoints' },
    { include: '#numbers' },
    { include: '#constants' },
    { include: '#testBlocks' },
  ],
  repository: {
    $self: {},
    $base: {},
    keywords: {
      patterns: [
        {
          name: 'keyword.other.pomsky',
          match: '\\b(let|enable|disable)\\b',
        },
        {
          name: 'keyword.control.pomsky',
          match: '\\b(if|else|lazy|greedy|range|base|atomic|recursion|regex)\\b|!?(<<|>>)|[+*?]',
        },
        {
          name: 'keyword.operator.pomsky',
          match: '[|]',
        },
      ],
    },
    comments: {
      name: 'comment.line.number-sign.pomsky',
      begin: '#',
      end: '\n',
    },
    dstrings: {
      name: 'string.quoted.double.pomsky',
      begin: '"',
      end: '"',
      patterns: [
        {
          name: 'constant.character.escape.pomsky',
          match: '\\\\["\\\\]', // String.raw`\\["\\]`
        },
        {
          name: 'invalid.illegal.escape.pomsky',
          match: '\\\\.',
        },
      ],
    },
    sstrings: {
      name: 'string.quoted.single.pomsky',
      begin: "'",
      end: "'",
    },
    references: {
      name: 'variable.name.pomsky',
      match: ':(:?\\w*([+-]?\\d+|[a-zA-Z_][a-zA-Z0-9_]*)\\b)?',
    },
    codepoints: {
      name: 'constant.numeric.pomsky',
      match: '\\bU\\s*\\+\\s*[0-9a-zA-Z_]+\\b',
    },
    numbers: {
      name: 'constant.numeric.pomsky',
      match: '\\b[0-9]+\\b',
    },
    constants: {
      patterns: [
        {
          name: 'constant.language.pomsky',
          match: '[.^$%<>]|!%',
        },
        {
          name: 'constant.other.pomsky',
          match: '\\b(Start|End|C|Codepoint|G|Grapheme)\\b',
        },
      ],
    },
    testBlocks: {
      begin: '\\b(test)\\s*{',
      end: '}',
      beginCaptures: {
        1: { name: 'keyword.other.pomsky' },
      },
      patterns: [
        {
          name: 'keyword.other.pomsky',
          match: 'match|reject|in|as',
        },
        {
          begin: '{',
          end: '}',
          patterns: [{ include: '#comments' }, { include: '#dstrings' }, { include: '#sstrings' }],
        },
        { include: '#comments' },
        { include: '#dstrings' },
        { include: '#sstrings' },
      ],
    },
  },
  scopeName: 'source.pomsky',
} satisfies LanguageInput
