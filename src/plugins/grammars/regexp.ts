import type { LanguageInput } from 'shiki'

export default {
  name: 'regexp',
  patterns: [
    // TODO: references (\g<...>, \k<...>, \3), char groups ([^...]), char classes, lookaround and other special groups, mode modifiers
    { include: '#comments' },
    { include: '#keywords' },
    { include: '#unicodeProps' },
    { include: '#codepoints' },
    { include: '#specialGroups' },
    { include: '#groups' },
    { include: '#repetition' },
    { include: '#repetitionBraces' },
    { include: '#specialEscape' },
    { include: '#charset' },
    { include: '#fancyEscapes' },
    { include: '#rest' },
  ],
  repository: {
    $base: {},
    $self: {},
    comments: {
      name: 'comment.block.regexp',
      begin: '\\(\\?#',
      end: '\\)',
    },
    keywords: {
      name: 'keyword.other.regexp',
      match: /[\^$]|\.|\\[bBwWdDsSnrte]|\\[X\d]/,
    },
    unicodeProps: {
      name: 'keyword.other.regexp',
      match: /\\[pP](?:(\w)|\{(\s*\w+\s*)\})/,
      captures: {
        1: { name: 'variable.name.regexp' },
        2: { name: 'variable.name.regexp' },
      },
    },
    codepoints: {
      name: 'constant.numeric.regexp',
      match: /\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[ux]\{[0-9a-fA-F]*\}/,
    },
    specialGroups: {
      name: 'source.regexp',
      match: /\((\?<?[=!]|\?P?<(\w+)>|\?>)/,
      captures: {
        1: { name: 'keyword.control.regexp' },
        2: { name: 'variable.name.regexp' },
      },
    },
    groups: {
      name: 'source.regexp',
      match: /\((\?:)?|\)|\|/,
    },
    repetition: {
      name: 'keyword.control.regexp',
      match: '[?*+]',
    },
    repetitionBraces: {
      name: 'source.pomsky',
      begin: '\\{',
      end: '\\}',
      patterns: [
        {
          name: 'constant.numeric.pomsky',
          match: '\\d+',
        },
      ],
    },
    specialEscape: {
      name: 'source.regexp',
      match: /\\[.?+*\^|\-(){}\[\]\\]/,
    },
    charset: {
      name: 'source.regexp',
      begin: /\[(\^?)/,
      beginCaptures: { 1: { name: 'keyword.control.regexp' } },
      end: /\]/,
      patterns: [
        { include: '#comments' },
        { include: '#codepoints' },
        {
          name: 'keyword.other.regexp',
          match: /\\[bBwWdDsSnrte]|\\[pP]\w/,
        },
        { include: '#unicodeProps' },
        { include: '#specialEscape' },
        { include: '#rest' },
      ],
    },
    fancyEscapes: {
      name: 'keyword.other.regexp',
      begin: /\\[gk]</,
      end: />/,
      patterns: [
        {
          name: 'variable.name.pomsky',
          match: '[^>]+',
        },
      ],
    },
    rest: {
      name: 'string.quoted.single.regexp',
      match: '.',
    },
  },
  scopeName: 'source.regexp',
} satisfies LanguageInput
