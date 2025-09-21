import { defineCollection } from 'astro:content'
import { docsSchema } from '@astrojs/starlight/schema'
import { docsLoader } from '@astrojs/starlight/loaders'
import { blogSchema } from 'starlight-blog/schema'

const leadingNumberAndDotRegEx = /^[0-9]+\./
const fileExtensionRegEx = /\.mdx?$/

function toSlug(s: string) {
  return s.toLowerCase().replace(/\W/, '-')
}

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      // Remove file extension and leading numbers + dot from each segment
      generateId: ({ entry }) => {
        const segments = entry
          .replace(fileExtensionRegEx, '')
          .split('/')
          .map(segment => toSlug(segment.replace(leadingNumberAndDotRegEx, '')))
        if (segments.length > 1 && segments[segments.length - 1] === 'index') {
          segments.pop()
        }
        return segments.join('/')
      },
    }),
    schema: docsSchema({
      extend: context => blogSchema(context),
    }),
  }),
}
