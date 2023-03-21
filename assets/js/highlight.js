import hljs from 'highlight.js/lib/core'

import rust from 'highlight.js/lib/languages/rust'
import javascript from 'highlight.js/lib/languages/javascript'
import ini from 'highlight.js/lib/languages/ini'

hljs.registerLanguage('rust', rust)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('toml', ini)

hljs.registerLanguage('pomsky', function (hljs) {
  return {
    name: 'pomsky',
    aliases: ['pomsky'],
    unicodeRegex: true,
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
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
      },
      {
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
      },
      {
        className: 'keyword',
        beginKeywords:
          'U let lazy greedy range base atomic enable disable if else recursion regex test',
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
        begin: /[%^$]/,
      },
      {
        className: 'title',
        begin: /\b[\p{Alpha}_][\p{Alpha}\d_]*\b|\./,
      },
      {
        className: 'keyword',
        begin: /[+*?{}!<>-]+/,
      },
      {
        className: 'punctuation',
        begin: /[[\](),=;|]+/,
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
    className: 'literalx',
    begin: /\\[pP]\{/,
    end: /\}/,
    contains: [
      {
        className: 'titlex',
        begin: /[\w\-&.]+/,
      },
    ],
  }
  const LITERAL = {
    className: 'literalx',
    begin: /\\x\w\w|\\u\w\w\w\w|\\[xu]\{[\w.]+\}/,
  }
  const SPECIAL_ESCAPE = {
    className: 'literalx',
    begin: /\\[.?+*^|\-(){}[\]\\]/,
  }
  const CHAR_ESCAPE = {
    className: 'titlex',
    begin: /\\./,
  }

  return {
    name: 'Regexp',
    aliases: ['regex', 'regexp'],
    contains: [
      {
        // modes, e.g. '(?s)'
        className: 'keyword',
        begin: /\(\?\w\)/,
      },
      {
        // special group start
        className: 'punctuation',
        begin: /\((\?:|\?<\w+>|\?=|\?!|\?<=|\?<!)/,
      },
      {
        className: 'punctuation',
        begin: /[|()]/,
      },
      {
        className: 'literalx',
        begin: /[\^$]/,
      },
      {
        className: 'keyword',
        begin: /[+*?.]+/,
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
      CHAR_ESCAPE,
      {
        className: 'punctuation',
        begin: /\[\^?/,
        end: /\]/,
        contains: [
          P_BRACED,
          P_SINGLE,
          LITERAL,
          SPECIAL_ESCAPE,
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
