import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const countrySlug = getRouterParam(event, 'countrySlug')
    const citySlug = getRouterParam(event, 'citySlug')
    if (!countrySlug || !citySlug) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректный URL' })
      }

  const country = await prisma.country.findUnique({
    where: { slug: countrySlug }
  })

  if (!country) {
    throw createError({ statusCode: 404, statusMessage: 'Страна не найдена' })
  }

  const city = await prisma.city.findUnique({
    where: {
      countryId_slug: {
        countryId: country.id,
        slug: citySlug
      }
    },
    include: {
      country: { select: { nameRu: true, slug: true, flagEmoji: true } },
      places: {
        where: { isPublished: true },
        include: {
          tags: true,
          emojiTags: true
        },
        orderBy: { rating: 'desc' }
      }
    }
  })

  if (!city) {
    throw createError({ statusCode: 404, statusMessage: 'Город не найден' })
  }

  return city
})