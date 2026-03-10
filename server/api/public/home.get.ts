import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const countries = await prisma.country.findMany({
    include: {
      cities: {
        include: {
          _count: { select: { places: true } }
        }
      },
      _count: { select: { cities: true } }
    },
    orderBy: { sortOrder: 'asc' }
  })

  const totalPlaces = await prisma.place.count({
    where: { isPublished: true }
  })

  const recentPlaces = await prisma.place.findMany({
    where: { isPublished: true },
    include: {
      city: {
        include: {
          country: { select: { nameRu: true, slug: true, flagEmoji: true } }
        }
      },
      tags: true,
      emojiTags: true
    },
    orderBy: { createdAt: 'desc' },
    take: 6
  })

  return { countries, totalPlaces, recentPlaces }
})