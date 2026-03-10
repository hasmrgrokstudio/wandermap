import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const emojiTag = await prisma.emojiTag.findUnique({
    where: { id: Number(id) },
    include: {
      places: {
        include: {
          city: {
            select: {
              nameRu: true,
              slug: true,
              country: { select: { nameRu: true, slug: true, flagEmoji: true } }
            }
          },
          tags: true
        }
      }
    }
  })

  if (!emojiTag) {
    throw createError({ statusCode: 404, statusMessage: 'Emoji-тег не найден' })
  }

  return emojiTag
})