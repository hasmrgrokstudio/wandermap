import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const emojiTag = await prisma.emojiTag.findUnique({
    where: { slug },
    include: {
      places: {
        where: { isPublished: true },
        include: {
          city: {
            include: {
              country: { select: { nameRu: true, slug: true, flagEmoji: true } }
            }
          },
          tags: true
        },
        orderBy: { rating: 'desc' }
      }
    }
  })

  if (!emojiTag) {
    throw createError({ statusCode: 404, statusMessage: 'Emoji-тег не найден' })
  }

  return emojiTag
})