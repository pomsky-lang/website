import { getSingletonHighlighter } from 'shiki'
import pomskyGrammar from './grammars/pomsky.js'
import regexpGrammar from './grammars/regexp.js'
import type { RemarkPlugins } from 'astro'

const highlighter = await getSingletonHighlighter()
await highlighter.loadTheme('dark-plus', 'light-plus')
await highlighter.loadLanguage(pomskyGrammar, regexpGrammar)

export const remarkInlineHighlight: RemarkPlugins[number] = () => {
  return (tree, { data }) => {
    process(tree as Tree)
  }
}

interface Tree {
  type: string
  value: string
  position: { start: any; end: any }
  children: Tree[]
}

const lookupMap = {
  po: 'pomsky',
  re: 'regexp',
}

function process(tree: Tree) {
  if (tree.type === 'paragraph' || tree.type === 'tableCell') {
    for (let i = 0; i < tree.children.length; i++) {
      processChild(tree, i)
    }
  } else if (tree.children) {
    tree.children.forEach(child => {
      process(child)
    })
  }
}

function processChild(tree: Tree, i: number) {
  if (tree.children[i].type !== 'inlineCode') return

  const next = tree.children[i + 1]
  if (!next) return

  const tag = next.value.match(/^#(\w\w)\b/)
  if (!tag) return

  next.value = next.value.slice(3)
  const lang = lookupMap[tag[1] as keyof typeof lookupMap]
  if (!lang) return

  const content = highlighter.codeToHtml(tree.children[i].value.replaceAll('╎', '|'), {
    lang,
    themes: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
    cssVariablePrefix: '--',
    defaultColor: false,
    structure: 'inline',
  })
  const html = `<code class="shiki lang-${lang}">${content}</code>`

  tree.children.splice(i, 1, { type: 'html', value: html } as Tree)
}
