import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const emojiTags = await prisma.emojiTag.findMany({
    include: {
      _count: { select: { places: true } }
    },
    orderBy: { nameRu: 'asc' }
  })

  return emojiTags
})