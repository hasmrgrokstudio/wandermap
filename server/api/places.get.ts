import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Фильтры: /api/places?cityId=1 или /api/places?tagId=3 или /api/places?emojiTagId=2
  const where: any = {}

  if (query.cityId) {
    where.cityId = Number(query.cityId)
  }
  if (query.tagId) {
    where.tags = { some: { id: Number(query.tagId) } }
  }
  if (query.emojiTagId) {
    where.emojiTags = { some: { id: Number(query.emojiTagId) } }
  }

  const places = await prisma.place.findMany({
    where,
    include: {
      city: {
        select: {
          nameRu: true,
          slug: true,
          country: { select: { nameRu: true, slug: true, flagEmoji: true } }
        }
      },
      tags: true,
      emojiTags: true
    },
    orderBy: { rating: 'desc' }
  })

  return places
})