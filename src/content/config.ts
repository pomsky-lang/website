import { defineCollection, z } from 'astro:content'
import { docsSchema } from '@astrojs/starlight/schema'
import { docsLoader } from '@astrojs/starlight/loaders'
import { blogSchema } from 'starlight-blog/schema'

const leadingNumberAndDotRegEx = /^[0-9]+\./
const fileExtensionRegEx = /\.mdx?$/

function toSlug(s: string) {
  return s.toLowerCase().replace(/\W/, '-')
}

const isNext = import.meta.env.PUBLIC_IS_NEXT === '1'

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
      extend: context =>
        isNext
          ? z.intersection(
              blogSchema(context),
              z.object({
                banner: z.object({ content: z.string() }).default({
                  content:
                    'You are viewing the <b>next</b> version of this website. <a href="https://pomsky-lang.org">See current version</a>',
                }),
              }),
            )
          : blogSchema(context),
    }),
  }),
}
