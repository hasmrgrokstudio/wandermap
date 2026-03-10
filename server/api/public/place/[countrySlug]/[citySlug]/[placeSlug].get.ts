import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const countrySlug = getRouterParam(event, 'countrySlug')
    const citySlug = getRouterParam(event, 'citySlug')
    const placeSlug = getRouterParam(event, 'placeSlug')
    
    if (!countrySlug || !citySlug || !placeSlug) {
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
      countryId_slug: { countryId: country.id, slug: citySlug }
    }
  })
  if (!city) {
    throw createError({ statusCode: 404, statusMessage: 'Город не найден' })
  }

  const place = await prisma.place.findUnique({
    where: {
      cityId_slug: { cityId: city.id, slug: placeSlug }
    },
    include: {
      city: {
        include: {
          country: { select: { nameRu: true, slug: true, flagEmoji: true } }
        }
      },
      tags: true,
      emojiTags: true
    }
  })

  if (!place || !place.isPublished) {
    throw createError({ statusCode: 404, statusMessage: 'Место не найдено' })
  }

  return place
})