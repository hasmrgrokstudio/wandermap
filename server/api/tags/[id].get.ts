import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const tag = await prisma.tag.findUnique({
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
          emojiTags: true
        }
      }
    }
  })

  if (!tag) {
    throw createError({ statusCode: 404, statusMessage: 'Тег не найден' })
  }

  return tag
})