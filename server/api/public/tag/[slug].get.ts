import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const tag = await prisma.tag.findUnique({
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
          emojiTags: true
        },
        orderBy: { rating: 'desc' }
      }
    }
  })

  if (!tag) {
    throw createError({ statusCode: 404, statusMessage: 'Тег не найден' })
  }

  return tag
})