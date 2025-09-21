import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

const leadingNumberAndDotRegEx = /^\d+\./
const wordSplitterRegEx = /\w\S*/g

function toTitleCase(str: string) {
  return str.replace(wordSplitterRegEx, word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })
}

function cleanGroupLabels(entries: any[]) {
  for (const entry of entries) {
    if (entry.type === 'group') {
      // Remove leading number + dot
      let label = entry.label.replace(leadingNumberAndDotRegEx, '')
      // Convert to Title Case
      entry.label = toTitleCase(label)
      // Recurse into children
      cleanGroupLabels(entry.entries)
    }
  }
}

export const onRequest = defineRouteMiddleware(context => {
  const { sidebar } = context.locals.starlightRoute
  cleanGroupLabels(sidebar)
})
