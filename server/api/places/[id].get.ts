import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const place = await prisma.place.findUnique({
    where: { id: Number(id) },
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

  if (!place) {
    throw createError({ statusCode: 404, statusMessage: 'Место не найдено' })
  }

  return place
})