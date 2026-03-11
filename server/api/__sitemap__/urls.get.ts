import prisma from '~~/server/utils/prisma'
import { defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  const countries = await prisma.country.findMany({
    include: {
      cities: {
        include: {
          places: {
            where: { isPublished: true },
            select: { slug: true, updatedAt: true },
          },
        },
      },
    },
  })

  const tags = await prisma.tag.findMany({ select: { slug: true, updatedAt: true } })
  const emojiTags = await prisma.emojiTag.findMany({ select: { slug: true, updatedAt: true } })

  // Хелпер — добавляет hreflang-альтернативы к каждому URL
  function makeUrls(path: string, lastmod?: Date) {
    return [
      { loc: path, lastmod },
      { loc: `/en${path}`, lastmod },
    ]
  }

  const urls = []

  for (const country of countries) {
    urls.push(...makeUrls(`/${country.slug}`, country.updatedAt))

    for (const city of country.cities) {
      urls.push(...makeUrls(`/${country.slug}/${city.slug}`, city.updatedAt))

      for (const place of city.places) {
        urls.push(...makeUrls(`/${country.slug}/${city.slug}/${place.slug}`, place.updatedAt))
      }
    }
  }

  for (const tag of tags) {
    urls.push(...makeUrls(`/tag/${tag.slug}`, tag.updatedAt))
  }

  for (const et of emojiTags) {
    urls.push(...makeUrls(`/emoji/${et.slug}`, et.updatedAt))
  }

  return urls
})