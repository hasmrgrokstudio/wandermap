import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const city = await prisma.city.findUnique({
    where: { id: Number(id) },
    include: {
      country: { select: { nameRu: true, slug: true, flagEmoji: true } },
      places: {
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