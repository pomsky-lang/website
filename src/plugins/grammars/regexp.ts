import type { LanguageInput } from 'shiki'

export default {
  name: 'regexp',
  patterns: [
    // TODO: references (\g<...>, \k<...>, \3), char groups ([^...]), char classes, lookaround and other special groups, mode modifiers
    { include: '#comments' },
    { include: '#keywords' },
    { include: '#codepoints' },
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
      patterns: [
        {
          name: 'keyword.other.regexp',
          match: '[\\^$]|\\.|\\\\[bBwWdDsS]|\\\\[pP]\\w|\\\\[X\\d]',
        },
        {
          name: 'keyword.other.regexp',
          begin: '\\\\[pP]\\{',
          end: '\\}',
        },
      ],
    },
    codepoints: {
      name: 'constant.numeric.regexp',
      match: '\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[ux]\\{[0-9a-fA-F]*\\}',
    },
    groups: {
      name: 'source.regexp',
      match: /\(\?:|\(\?<?[=!]|\(\?P?<\w+>|\(\?>|\(|\)|\|/,
    },
    repetition: {
      name: 'keyword.control.regexp',
      match: '[?*+]',
    },
    repetitionBraces: {
      name: 'keyword.control.regexp',
      begin: '\\{',
      end: '\\}',
      patterns: [
        {
          name: 'constant.numeric.pomsky',
          match: '\\d+',
        },
        {
          name: 'source.pomsky',
          match: '[, ]',
        },
      ],
    },
    specialEscape: {
      name: 'source.regexp',
      match: /\\[.?+*\^|\-(){}\[\]\\]/,
    },
    charset: {
      name: 'source.regexp',
      begin: /\[\^?/,
      end: /\]/,
      patterns: [
        { include: '#comments' },
        { include: '#codepoints' },
        {
          name: 'keyword.other.regexp',
          match: '\\\\[bBwWdDsS]|\\\\[pP]\\w',
        },
        {
          name: 'keyword.other.regexp',
          begin: '\\\\[pP]\\{',
          end: '\\}',
        },
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
          name: 'constant.numeric.pomsky',
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
