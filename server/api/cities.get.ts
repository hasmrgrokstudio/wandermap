import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Фильтрация по стране через query-параметр: /api/cities?countryId=1
  const query = getQuery(event)

  const where = query.countryId
    ? { countryId: Number(query.countryId) }
    : {}

  const cities = await prisma.city.findMany({
    where,
    include: {
      country: { select: { nameRu: true, slug: true, flagEmoji: true } },
      _count: { select: { places: true } }
    },
    orderBy: { nameRu: 'asc' }
  })

  return cities
})