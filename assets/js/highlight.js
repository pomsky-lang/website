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
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        className: 'string',
        variants: [
          {
            begin: /"/,
            contains: [{ begin: /\\./, className: 'keyword' }],
            end: /"/,
          },
          { begin: /'/, end: /'/ },
        ],
      },
      {
        className: 'keyword',
        beginKeywords: 'let enable disable greedy lazy range base',
      },
      {
        className: 'keyword',
        begin: /::?\s*[+-]?[A-Za-z0-9]*/,
      },
      {
        className: 'literalx',
        begin: /U\+[0-9a-fA-F]+|<%|%>|%|\^|\$/,
      },
      {
        className: 'titlex',
        begin: /\b[A-Za-z_][A-Za-z0-9_]*\b|\./,
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
        variants: [
          {
            begin: /\b\d+\b/,
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
        begin: /[+*?]+/,
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
