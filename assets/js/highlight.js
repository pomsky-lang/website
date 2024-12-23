import hljs from 'highlight.js/lib/core'

import rust from 'highlight.js/lib/languages/rust'
import javascript from 'highlight.js/lib/languages/javascript'
import ini from 'highlight.js/lib/languages/ini'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('rust', rust)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('toml', ini)
hljs.registerLanguage('json', json)

hljs.registerLanguage('pomsky', function (hljs) {
  const STRING = {
    className: 'string',
    variants: [
      {
        begin: /"/,
        contains: [
          { begin: /\\[\\"]/, className: 'keyword' },
          { begin: /\\./, className: 'illegal' },
        ],
        end: /"/,
      },
      { begin: /'/, end: /'/ },
    ],
  }

  const CODEPOINT = {
    scope: 'codepoint',
    className: 'literal',
    begin: /\bU\s*\+\s*[\p{Alpha}\d_]+/,
    returnBegin: true,
    contains: [
      { begin: /\bU\s*\+\s*/ },
      {
        // 0-D7FF
        begin:
          /\b0*(0|[1-9a-cA-C][0-9a-fA-F]{0,3}|[dD](?:[0-7][0-9a-fA-F]{0,2}|[8-9a-fA-F][0-9a-fA-F]?)?|[e-fE-F][0-9a-fA-F]{0,2})\b/,
        endsParent: true,
      },
      {
        // E000-10FFFF
        begin:
          /\b0*(1(?:0[0-9a-fA-F]{3,4}|[1-9a-fA-F][0-9a-fA-F]{3})|[2-9a-dA-D][0-9a-fA-F]{4}|[e-fE-F][0-9a-fA-F]{3,4})\b/,
        endsParent: true,
      },
      {
        className: 'illegal',
        begin: /\b[\p{Alpha}\d_]+\b/,
        endsParent: true,
      },
    ],
  }

  const TEST = {
    scope: 'test',
    begin: [/\btest/, /\s*/, /\{/],
    beginScope: {
      1: 'keyword',
      3: 'punctuation',
    },
    end: /\}/,
    endScope: 'punctuation',
    contains: [
      hljs.HASH_COMMENT_MODE,
      STRING,
      {
        className: 'keyword',
        begin: /\b(match|reject|as|in)\b/,
      },
      {
        className: 'punctuation',
        begin: /\{/,
        end: /\}/,
        contains: [
          hljs.HASH_COMMENT_MODE,
          STRING,
          {
            className: 'title',
            begin: /\b[a-zA-Z]\w*\b/,
          },
          {
            className: 'number',
            begin: /\d+/,
          },
        ],
      },
    ],
  }

  return {
    name: 'pomsky',
    aliases: ['pomsky'],
    unicodeRegex: true,
    contains: [
      hljs.HASH_COMMENT_MODE,
      STRING,
      CODEPOINT,
      TEST,
      {
        className: 'keyword',
        beginKeywords:
          'U let lazy greedy range base atomic enable disable if else recursion regex test call',
      },
      {
        className: 'keyword',
        begin: /::?\s*[+-]?[\p{Alpha}\d_]*/,
        returnBegin: true,
        contains: [
          {
            // number backreference
            begin: /::\s*[+-]?(0|[1-9][0-9]*)\b/,
            endsParent: true,
          },
          {
            // named capturing group or named backreference
            begin: /::?\s*[a-zA-Z][a-zA-Z0-9]{0,31}\b/,
            endsParent: true,
          },
          { begin: /::?\s*/ },
          { begin: /\b[a-zA-Z][a-zA-Z0-9]{0,31}/ },
          {
            className: 'illegal',
            begin: /[\p{Alpha}\d_]/,
          },
        ],
      },
      {
        className: 'literal',
        begin: /[%^$<>]+/,
      },
      {
        className: 'title',
        begin: /\b[\p{Alpha}_][\p{Alpha}\d_]*\b|\./,
      },
      {
        className: 'keyword',
        begin: /[+*?{}!-]+/,
      },
      {
        className: 'punctuation',
        begin: /\[/,
        contains: [
          hljs.HASH_COMMENT_MODE,
          STRING,
          CODEPOINT,
          {
            begin: [/\b(\w+:)?/, /\w+\b|\./],
            beginScope: {
              2: 'title',
            },
          },
          {
            className: 'keyword',
            begin: /[-!]/,
          },
        ],
        end: /\]/,
      },
      {
        className: 'punctuation',
        begin: /[\](),=;|]+/,
      },
      {
        className: 'number',
        begin: /\b\d[\d_.]*\b/,
        returnBegin: true,
        contains: [
          {
            begin: /\b(0|[1-9][0-9]*)(?!\.)\b/,
            endsParent: true,
          },
          {
            className: 'illegal',
            begin: /\b0+(?=[\d_])/,
          },
          { begin: /\d/ },
          {
            className: 'illegal',
            begin: /[._]/,
          },
        ],
      },
    ],
  }
})

hljs.registerLanguage('regexp', function () {
  const P_SINGLE = {
    className: 'keyword',
    begin: /\\[pP]\w/,
  }
  const P_BRACED = {
    className: 'punctuation',
    begin: /\\[pP]\{/,
    end: /\}/,
    contains: [
      {
        className: 'title',
        begin: /[\w\-&.]+/,
      },
    ],
  }
  const LITERAL = {
    className: 'literal',
    begin: /\\x\w\w|\\u\w\w\w\w|\\[xu]\{[\w.]+\}/,
  }
  const CHAR_RANGE = {
    begin: [/[^\\\]]/, /-/, /[^\\\]]/],
    beginScope: {
      1: 'string',
      2: 'keyword',
      3: 'string',
    },
  }
  const SPECIAL_ESCAPE = {
    className: 'punctuation',
    begin: /\\[.?+*^|\-(){}[\]\\]/,
  }
  const GK_ESCAPE = {
    begin: [/\\[gk]</, /.*?/, />/],
    beginScope: {
      1: 'punctuation',
      2: 'keyword',
      3: 'punctuation',
    },
  }
  const WORD_BOUNDARY = {
    className: 'literal',
    begin: /\\[bB]/,
  }
  const BACKREF_NUMBER = {
    className: 'keyword',
    begin: /\\[0-9]+/,
  }
  const CHAR_ESCAPE = {
    className: 'title',
    begin: /\\./,
  }

  return {
    name: 'Regexp',
    aliases: ['regex', 'regexp'],
    contains: [
      {
        // modes, e.g. '(?s)'
        className: 'keyword',
        begin: /\(\?\w+\)/,
      },
      {
        // capturing group start
        begin: [/\(\?P?</, /\w+/, />/],
        beginScope: {
          1: 'punctuation',
          2: 'keyword',
          3: 'punctuation',
        },
      },
      {
        // negative lookaround start
        begin: [/\(/, /\?<?/, /!/],
        beginScope: {
          1: 'punctuation',
          2: 'literal',
          3: 'keyword',
        },
      },
      {
        // positive lookaround start
        begin: [/\(/, /\?<?=/],
        beginScope: {
          1: 'punctuation',
          2: 'literal',
        },
      },
      {
        // special group start
        className: 'punctuation',
        begin: /\(\?([:>]|[a-z-]+:)/,
      },
      {
        className: 'comment',
        begin: /\(\?#.*?\)/,
      },
      {
        className: 'punctuation',
        begin: /[|()]/,
      },
      {
        className: 'literal',
        begin: /[\^$]/,
      },
      {
        className: 'keyword',
        begin: /[+*?]+/,
      },
      {
        className: 'title',
        begin: /\./,
      },
      {
        className: 'keyword',
        begin: /\{/,
        end: /\}/,
        contains: [
          {
            className: 'number',
            begin: /\d+/,
          },
          {
            className: 'punctuation',
            begin: /,/,
          },
        ],
      },
      P_BRACED,
      P_SINGLE,
      LITERAL,
      SPECIAL_ESCAPE,
      GK_ESCAPE,
      WORD_BOUNDARY,
      BACKREF_NUMBER,
      CHAR_ESCAPE,
      {
        begin: [/\[/, /\^?/],
        beginScope: {
          1: 'punctuation',
          2: 'keyword',
        },
        end: /\]/,
        contains: [
          P_BRACED,
          P_SINGLE,
          LITERAL,
          CHAR_RANGE,
          SPECIAL_ESCAPE,
          GK_ESCAPE,
          WORD_BOUNDARY,
          BACKREF_NUMBER,
          CHAR_ESCAPE,
          {
            // make sure the above isn't triggered after a nested '['
            className: 'string',
            begin: /\[\^*/,
          },
          {
            // everything else
            className: 'string',
            begin: /[^\]]\w*/,
          },
        ],
      },
      {
        className: 'string',
        begin: /.\w*/,
      },
    ],
  }
})

hljs.registerLanguage('diff', function () {
  return {
    name: 'diff',
    contains: [
      {
        className: 'diff-add',
        begin: /^\+.*?$/s,
      },
      {
        className: 'diff-del',
        begin: /^-.*?$/s,
      },
      {
        className: 'comment',
        begin: /^#.*?$/s,
      },
    ],
  }
})

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('code[class|=language]').forEach((block) => hljs.highlightBlock(block))
})

window.hljs = hljs
